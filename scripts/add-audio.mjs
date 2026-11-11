#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, extname, join, resolve } from 'node:path';
import {
  fail,
  formatClock,
  hashFile,
  projectDir,
  probeMedia,
  rootDuration,
  wireLayer
} from './lib/studio.mjs';

const args = process.argv.slice(2);
if (args.length < 2 || args.includes('--help')) {
  console.log(`Usage:
  node scripts/add-audio.mjs <project-slug> <audio-file> [options]

Options:
  --role music|sfx|voice   Default: music
  --track <n>              Default: music 9, sfx 10, voice 11
  --volume <0..2>          Default: music 0.12, sfx 0.8, voice 1
  --start <seconds>        Default: 0
  --duration <seconds>     Default: project duration minus start
  --no-loop                Do not loop the file
  --fade-in <seconds>      Default: music 1, otherwise 0
  --fade-out <seconds>     Default: music 2, otherwise 0
  --rights <text>          Default: UNKNOWN

Examples:
  node scripts/add-audio.mjs my-clip ~/Music/bed.mp3 --role music --volume 0.12
  node scripts/add-audio.mjs my-clip assets/sfx/paper.wav --role sfx --start 2.4 --duration 0.6 --volume 0.7
`);
  process.exit(args.length < 2 ? 1 : 0);
}

const slug = args[0];
let input = resolve(args[1]);
if (!existsSync(input)) {
  const root = resolve(process.cwd());
  const cleanArg = args[1].replace(/^sfx\//, '');
  const candidates = [
    resolve(root, 'sfx', cleanArg),
    resolve(root, 'sfx', `${cleanArg}.mp3`),
    resolve(root, 'sfx', `${cleanArg}.wav`),
    resolve(root, 'STUDIO', 'sfx', cleanArg),
    resolve(root, 'STUDIO', 'sfx', `${cleanArg}.mp3`),
    resolve(root, 'STUDIO', 'sfx', `${cleanArg}.wav`),
    resolve(root, 'ASSETS', 'sfx', cleanArg),
    resolve(root, 'ASSETS', 'sfx', `${cleanArg}.mp3`)
  ];
  const found = candidates.find(c => existsSync(c));
  if (found) input = found;
}
const dir = projectDir(slug);
const html = readFileSync(join(dir, 'index.html'), 'utf8');
const projectDuration = rootDuration(html);
if (!projectDuration) fail('Could not read #clip data-duration.');

let role = 'music';
let track = null;
let volume = null;
let start = 0;
let duration = null;
let loop = null;
let fadeIn = null;
let fadeOut = null;
let rights = 'UNKNOWN';

for (let i = 2; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--role') role = args[++i];
  else if (arg === '--track') track = Number(args[++i]);
  else if (arg === '--volume') volume = Number(args[++i]);
  else if (arg === '--start') start = Number(args[++i]);
  else if (arg === '--duration') duration = Number(args[++i]);
  else if (arg === '--no-loop') loop = false;
  else if (arg === '--loop') loop = true;
  else if (arg === '--fade-in') fadeIn = Number(args[++i]);
  else if (arg === '--fade-out') fadeOut = Number(args[++i]);
  else if (arg === '--rights') rights = args[++i];
  else if (arg.startsWith('--')) fail(`Unknown option: ${arg}`);
}

if (!existsSync(input)) fail(`Audio not found: ${input}`);
if (!['music', 'sfx', 'voice'].includes(role)) fail('--role must be music, sfx or voice');
if (track == null) track = role === 'music' ? 9 : role === 'sfx' ? 10 : 11;
if (volume == null) volume = role === 'music' ? 0.12 : role === 'sfx' ? 0.8 : 1;
if (loop == null) loop = role === 'music';
if (fadeIn == null) fadeIn = role === 'music' ? 1 : 0;
if (fadeOut == null) fadeOut = role === 'music' ? 2 : 0;
if (!Number.isFinite(start) || start < 0) fail('--start must be a non-negative number');
if (!Number.isFinite(volume) || volume < 0 || volume > 2) fail('--volume must be 0..2');
if (!Number.isFinite(fadeIn) || fadeIn < 0) fail('--fade-in must be >= 0');
if (!Number.isFinite(fadeOut) || fadeOut < 0) fail('--fade-out must be >= 0');

const sourceProbe = probeMedia(input);
if (!sourceProbe.audio) fail(`No audio stream found: ${input}`);
const available = Math.max(0, projectDuration - start);
const requested = duration ?? available;
const finalDuration = Number(Math.min(loop ? requested : sourceProbe.duration, requested, available).toFixed(3));
if (!(finalDuration > 0)) fail('The selected audio range is empty.');

const outDir = join(dir, 'assets', 'audio');
mkdirSync(outDir, { recursive: true });
const stem = basename(input, extname(input)).replace(/[^a-zA-Z0-9._-]+/g, '-');
const outPath = join(outDir, `${role}-${stem}.m4a`);

const filters = [`volume=${volume}`];
if (fadeIn > 0) filters.push(`afade=t=in:st=0:d=${Math.min(fadeIn, finalDuration)}`);
if (fadeOut > 0) {
  const fadeStart = Math.max(0, finalDuration - fadeOut);
  filters.push(`afade=t=out:st=${fadeStart}:d=${Math.min(fadeOut, finalDuration)}`);
}
const ffArgs = ['-y'];
if (loop) ffArgs.push('-stream_loop', '-1');
ffArgs.push(
  '-i', input,
  '-t', String(finalDuration),
  '-af', filters.join(','),
  '-c:a', 'aac',
  '-b:a', '192k',
  '-ar', '48000',
  '-ac', '2',
  '-movflags', '+faststart',
  outPath
);
console.error(`Preparing ${role} audio -> ${outPath}`);
execFileSync('ffmpeg', ffArgs, { stdio: ['ignore', 'inherit', 'inherit'] });

const outProbe = probeMedia(outPath);
const id = `audio-${role}-${stem}`.slice(0, 64);
const result = wireLayer(dir, {
  id,
  src: `assets/audio/${basename(outPath)}`,
  start,
  duration: finalDuration,
  track,
  kind: 'audio',
  volume: 1
});

const ledgerPath = join(dir, 'assets', 'audio.json');
let ledger = [];
if (existsSync(ledgerPath)) {
  try {
    const parsed = JSON.parse(readFileSync(ledgerPath, 'utf8'));
    ledger = Array.isArray(parsed) ? parsed : parsed.audio || [];
  } catch {
    ledger = [];
  }
}
const record = {
  id,
  role,
  source: input,
  sourceSha256: hashFile(input),
  output: outPath,
  outputSha256: hashFile(outPath),
  start,
  duration: finalDuration,
  track,
  volume,
  loop,
  fadeIn,
  fadeOut,
  rights,
  sourceProbe,
  outputProbe: outProbe,
  created: new Date().toISOString()
};
const existingIndex = ledger.findIndex((item) => item.id === id);
if (existingIndex >= 0) ledger[existingIndex] = record;
else ledger.push(record);
writeFileSync(ledgerPath, `${JSON.stringify({ audio: ledger }, null, 2)}\n`);

console.log(`Audio added: ${role}`);
console.log(`File: ${outPath}`);
console.log(`Timeline: ${formatClock(start)} + ${finalDuration.toFixed(2)}s on track ${track}`);
console.log(`Ledger: ${ledgerPath}`);
console.log(result.updated ? 'Updated existing audio layer.' : 'Inserted new audio layer.');

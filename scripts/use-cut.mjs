#!/usr/bin/env node
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import {
  fail,
  hashFile,
  projectDir,
  probeMedia,
  setRootDuration
} from './lib/studio.mjs';

const args = process.argv.slice(2);
if (args.length < 2 || args.includes('--help')) {
  console.log(`Usage:
  node scripts/use-cut.mjs <project-slug> <cut-video> [options]

Options:
  --transcript <path>   Replace assets/transcript.json with this file
  --keep-name           Do not copy to assets/current.mp4; use the given path

The project's <video> and <audio> layers are repointed at the new cut and the
root duration is updated to the encoded duration.
`);
  process.exit(args.length < 2 ? 1 : 0);
}

const slug = args[0];
const dir = projectDir(slug);
const sourceVideo = resolve(args[1]);
let transcriptPath = null;
let keepName = false;

for (let i = 2; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--transcript') transcriptPath = resolve(args[++i]);
  else if (arg === '--keep-name') keepName = true;
  else if (arg.startsWith('--')) fail(`Unknown option: ${arg}`);
}

if (!existsSync(sourceVideo)) fail(`Cut video not found: ${sourceVideo}`);
if (transcriptPath && !existsSync(transcriptPath)) fail(`Transcript not found: ${transcriptPath}`);

const currentPath = keepName ? sourceVideo : join(dir, 'assets', 'current.mp4');
if (!keepName) copyFileSync(sourceVideo, currentPath);
const probe = probeMedia(currentPath);
if (!probe.video) fail(`No video stream in ${currentPath}`);

const indexPath = join(dir, 'index.html');
let html = readFileSync(indexPath, 'utf8');
if (!html.includes('id="source-video"') && !html.includes('data-has-footage="true"')) {
  fail('No footage layer found. Run import-footage.mjs first.');
}

const rel = keepName
  ? currentPath.replace(`${dir}/`, '')
  : `assets/${basename(currentPath)}`;
html = html.replace(/(<video id="source-video"[^>]*\bsrc=")[^"]*(")/, `$1${rel}$2`);
html = html.replace(/(<audio id="source-audio"[^>]*\bsrc=")[^"]*(")/, `$1${rel}$2`);
html = html.replace(/(<video id="source-video"[^>]*\bdata-duration=")[0-9.]+(")/, `$1${probe.duration.toFixed(3)}$2`);
html = html.replace(/(<audio id="source-audio"[^>]*\bdata-duration=")[0-9.]+(")/, `$1${probe.duration.toFixed(3)}$2`);
html = html.replace(/(id="clip"[^>]*data-has-footage=")false(")/, '$1true$2');
writeFileSync(indexPath, html);
const update = setRootDuration(dir, probe.duration);

if (transcriptPath) {
  const oldTranscript = join(dir, 'assets', 'transcript.json');
  if (existsSync(oldTranscript)) {
    copyFileSync(oldTranscript, join(dir, 'assets', 'transcript.pre-cut.json'));
  }
  copyFileSync(transcriptPath, oldTranscript);
}

const sourceDocPath = join(dir, 'SOURCE.md');
if (existsSync(sourceDocPath)) {
  let doc = readFileSync(sourceDocPath, 'utf8');
  doc += `\n## Current cut\n\n- File: \`${rel}\`\n- Duration: ${probe.duration.toFixed(2)}s\n- SHA-256: \`${hashFile(currentPath)}\`\n- Updated: ${new Date().toISOString()}\n`;
  writeFileSync(sourceDocPath, doc);
}

console.log(`Current cut: ${rel}`);
console.log(`Duration: ${probe.duration.toFixed(2)}s (project ${update.old}s -> ${update.duration}s)`);
if (transcriptPath) console.log(`Transcript replaced: ${transcriptPath}`);
console.log(`Next: ./scripts/make-captions.sh ${slug} && ./scripts/check-clip.sh ${slug}`);

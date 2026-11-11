#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, extname, join, resolve } from 'node:path';
import {
  copyToProject,
  fail,
  formatClock,
  hashFile,
  projectDir,
  projectFormat,
  probeMedia,
  replaceMarkedBlock,
  rootDuration,
  setRootDuration
} from './lib/studio.mjs';

const args = process.argv.slice(2);
if (args.length < 2 || args.includes('--help')) {
  console.log(`Usage:
  node scripts/import-footage.mjs <project-slug> <source-video> [options]

Options:
  --fit cover|contain    How to fit the source into the project canvas. Default: cover
  --start <seconds>      Start offset in the source. Default: 0
  --duration <seconds>   Trim to this length. Default: project duration, capped by source
  --no-proxy             Copy/remux instead of transcoding a browser-safe proxy
  --working <path>       Use an already-edited file as the working footage
  --rights <text>        Rights/permission note. Default: UNKNOWN
  --source-url <url>     Original URL or reference

Examples:
  node scripts/import-footage.mjs my-clip ~/Videos/take-01.mp4
  node scripts/import-footage.mjs my-clip assets/source/take-01.mp4 --fit contain --duration 30
`);
  process.exit(args.length < 2 ? 1 : 0);
}

const slug = args[0];
const sourcePath = resolve(args[1]);
const dir = projectDir(slug);
const format = projectFormat(dir);

let fit = 'cover';
let start = 0;
let duration = null;
let proxy = true;
let workingOverride = null;
let rights = 'UNKNOWN';
let sourceUrl = 'UNKNOWN';

for (let i = 2; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--fit') fit = args[++i];
  else if (arg === '--start') start = Number(args[++i]);
  else if (arg === '--duration') duration = Number(args[++i]);
  else if (arg === '--no-proxy') proxy = false;
  else if (arg === '--working') workingOverride = resolve(args[++i]);
  else if (arg === '--rights') rights = args[++i];
  else if (arg === '--source-url') sourceUrl = args[++i];
  else if (arg.startsWith('--')) fail(`Unknown option: ${arg}`);
}

if (!existsSync(sourcePath)) fail(`Source not found: ${sourcePath}`);
if (!['cover', 'contain'].includes(fit)) fail('--fit must be cover or contain');
if (!Number.isFinite(start) || start < 0) fail('--start must be a non-negative number');
if (duration != null && (!Number.isFinite(duration) || duration <= 0)) fail('--duration must be positive');

const indexPath = join(dir, 'index.html');
let html = readFileSync(indexPath, 'utf8');
if (!html.includes('<!-- FOOTAGE:START -->') || !html.includes('<!-- FOOTAGE:END -->')) {
  fail('Template has no FOOTAGE markers. Recreate the project with the current template or add the markers manually.');
}

const projectDuration = rootDuration(html);
const sourceProbe = probeMedia(sourcePath);
if (!sourceProbe.video) fail(`No video stream found: ${sourcePath}`);
const available = Math.max(0, sourceProbe.duration - start);
const finalDuration = Number(
  Math.min(duration ?? projectDuration ?? available, available).toFixed(3)
);
if (!(finalDuration > 0)) fail('The selected footage range is empty.');

const originalCopy = copyToProject(dir, sourcePath, 'assets/source');
const workingPath = workingOverride || join(dir, 'assets', 'working.mp4');

if (workingOverride) {
  if (!existsSync(workingOverride)) fail(`Working file not found: ${workingOverride}`);
} else if (proxy) {
  const filter = fit === 'cover'
    ? `scale=${format.width}:${format.height}:force_original_aspect_ratio=increase,crop=${format.width}:${format.height},setsar=1`
    : `scale=${format.width}:${format.height}:force_original_aspect_ratio=decrease,pad=${format.width}:${format.height}:(ow-iw)/2:(oh-ih)/2:color=black,setsar=1`;
  const ffArgs = [
    '-y',
    '-ss', String(start),
    '-i', sourcePath,
    '-t', String(finalDuration),
    '-vf', `${filter},fps=${format.fps}`,
    '-c:v', 'libx264',
    '-preset', 'medium',
    '-crf', '18',
    '-pix_fmt', 'yuv420p'
  ];
  if (sourceProbe.audio) {
    ffArgs.push('-map', '0:v:0', '-map', '0:a:0', '-c:a', 'aac', '-b:a', '192k', '-ac', '2', '-ar', '48000');
  } else {
    ffArgs.push(
      '-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=48000',
      '-map', '0:v:0', '-map', '1:a:0', '-shortest',
      '-c:a', 'aac', '-b:a', '192k'
    );
  }
  ffArgs.push('-movflags', '+faststart', workingPath);
  console.error(`Creating browser-safe proxy -> ${workingPath}`);
  execFileSync('ffmpeg', ffArgs, { stdio: ['ignore', 'inherit', 'inherit'] });
} else {
  console.error(`Copying source without proxy -> ${workingPath}`);
  execFileSync('ffmpeg', ['-y', '-i', sourcePath, '-t', String(finalDuration), '-c', 'copy', '-movflags', '+faststart', workingPath], {
    stdio: ['ignore', 'inherit', 'inherit']
  });
}

const workingProbe = probeMedia(workingPath);
const sourceRecord = {
  original: {
    ...sourceProbe,
    path: originalCopy,
    name: basename(originalCopy),
    sha256: hashFile(originalCopy)
  },
  working: {
    ...workingProbe,
    path: workingPath,
    name: basename(workingPath),
    sha256: hashFile(workingPath)
  },
  ingest: {
    fit,
    start,
    duration: finalDuration,
    proxied: Boolean(proxy && !workingOverride),
    created: new Date().toISOString(),
    source_url: sourceUrl,
    rights
  }
};
writeFileSync(join(dir, 'assets', 'source.json'), `${JSON.stringify(sourceRecord, null, 2)}\n`);

const sourceDoc = `# Source — ${slug}

| Field | Value |
|---|---|
| Original | \`${originalCopy}\` |
| Working file | \`${workingPath}\` |
| Source URL / reference | ${sourceUrl} |
| Rights / permission | ${rights} |
| Original duration | ${formatClock(sourceProbe.duration)} (${sourceProbe.duration.toFixed(2)}s) |
| Working duration | ${formatClock(workingProbe.duration)} (${workingProbe.duration.toFixed(2)}s) |
| Canvas | ${format.width}x${format.height} @ ${format.fps}fps |
| Fit | ${fit} |
| Source start | ${start.toFixed(2)}s |
| Selected duration | ${finalDuration.toFixed(2)}s |
| Original SHA-256 | \`${sourceRecord.original.sha256}\` |
| Working SHA-256 | \`${sourceRecord.working.sha256}\` |

## Provenance

- Original preserved at \`${originalCopy}\`.
- The composition reads \`${workingPath}\`.
- The original is never modified by the studio.
- Record the owner, licence and transformation before publishing.

## Probe

\`\`\`json
${JSON.stringify({ original: sourceProbe, working: workingProbe }, null, 2)}
\`\`\`
`;
writeFileSync(join(dir, 'SOURCE.md'), sourceDoc);

const videoTag = `<div id="footage" aria-hidden="true">
      <video id="source-video" data-start="0" data-duration="${finalDuration}" data-track-index="1" src="assets/${basename(workingPath)}" muted playsinline></video>
      <div class="scrim"></div>
    </div>
    <audio id="source-audio" data-start="0" data-duration="${finalDuration}" data-track-index="8" data-volume="1" src="assets/${basename(workingPath)}"></audio>`;

html = replaceMarkedBlock(html, '<!-- FOOTAGE:START -->', '<!-- FOOTAGE:END -->', videoTag, 'footage');
html = html.replace(/(id="clip"[^>]*data-has-footage=")false(")/, '$1true$2');
// The placeholder is hidden once footage is attached; move it off track 1 so it
// does not overlap the real video layer.
html = html.replace(/(<div id="media"[^>]*data-track-index=")1(")/, '$112$2');
writeFileSync(indexPath, html);

const durationUpdate = setRootDuration(dir, finalDuration);

// Keep the brief's status and source row truthful without overwriting creative notes.
const briefPath = join(dir, 'BRIEF.md');
if (existsSync(briefPath)) {
  let brief = readFileSync(briefPath, 'utf8');
  brief = brief.replace(/^\| Source \|.*\|$/m, `| Source | ${sourceUrl === 'UNKNOWN' ? basename(originalCopy) : sourceUrl} |`);
  brief = brief.replace(/^\| Status \|.*\|$/m, '| Status | `footage-attached` |');
  writeFileSync(briefPath, brief);
}

console.log(`Footage attached: ${workingPath}`);
console.log(`Duration: ${finalDuration.toFixed(2)}s (project ${durationUpdate.old}s -> ${durationUpdate.duration}s)`);
console.log(`Source record: ${join(dir, 'assets', 'source.json')}`);
console.log('Next: transcribe with `./scripts/transcribe-clip.sh ' + slug + '`');

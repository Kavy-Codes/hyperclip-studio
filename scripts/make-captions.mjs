#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import {
  escapeHtml,
  fail,
  formatClock,
  projectDir,
  projectFormat,
  readTranscript,
  rootDuration,
  wireLayer,
  writeJson
} from './lib/studio.mjs';

const args = process.argv.slice(2);
if (args.length === 0 || args.includes('--help')) {
  console.log(`Usage:
  node scripts/make-captions.mjs <project-slug> [options]

Options:
  --transcript <path>    Default: assets/transcript.json
  --output <path>        Default: compositions/captions.html
  --style boxed|plain    Default: boxed
  --position bottom|top  Default: bottom
  --chunk <n>            Max words per cue. Default: 3
  --max-chars <n>        Max characters per cue. Default: 24
  --max-duration <s>     Max cue duration. Default: 2.4
  --track <n>            Composition track. Default: 6
  --no-wire              Write the composition but do not insert it into index.html

Examples:
  node scripts/make-captions.mjs my-clip
  node scripts/make-captions.mjs my-clip --style plain --position top --chunk 2
`);
  process.exit(args.length === 0 ? 1 : 0);
}

const slug = args[0];
const dir = projectDir(slug);
const format = projectFormat(dir);
let transcriptPath = join(dir, 'assets', 'transcript.json');
let outputPath = join(dir, 'compositions', 'captions.html');
let style = 'boxed';
let position = 'bottom';
let chunk = 3;
let maxChars = 24;
let maxDuration = 2.4;
let track = 6;
let wire = true;

for (let i = 1; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--transcript') transcriptPath = resolve(args[++i]);
  else if (arg === '--output') outputPath = resolve(args[++i]);
  else if (arg === '--style') style = args[++i];
  else if (arg === '--position') position = args[++i];
  else if (arg === '--chunk') chunk = Number(args[++i]);
  else if (arg === '--max-chars') maxChars = Number(args[++i]);
  else if (arg === '--max-duration') maxDuration = Number(args[++i]);
  else if (arg === '--track') track = Number(args[++i]);
  else if (arg === '--no-wire') wire = false;
  else if (arg.startsWith('--')) fail(`Unknown option: ${arg}`);
}

if (!existsSync(transcriptPath)) {
  fail(`Transcript not found: ${transcriptPath}. Run transcribe-clip.mjs first.`);
}
if (!['boxed', 'plain'].includes(style)) fail('--style must be boxed or plain');
if (!['bottom', 'top'].includes(position)) fail('--position must be bottom or top');
if (!Number.isInteger(chunk) || chunk < 1 || chunk > 8) fail('--chunk must be 1..8');
if (!Number.isFinite(maxChars) || maxChars < 4) fail('--max-chars must be >= 4');
if (!Number.isFinite(maxDuration) || maxDuration <= 0) fail('--max-duration must be positive');
if (!Number.isInteger(track) || track < 0) fail('--track must be a non-negative integer');

const htmlPath = join(dir, 'index.html');
const projectDuration = rootDuration(readFileSync(htmlPath, 'utf8'));
if (!projectDuration) fail('Could not read #clip data-duration from index.html');

const transcript = readTranscript(transcriptPath);
const duration = Number(Math.min(projectDuration, transcript.audio_duration_secs || projectDuration).toFixed(3));
const cues = buildCues(transcript.words, { chunk, maxChars, maxDuration, duration });

if (!cues.length) fail('No caption cues were produced.');
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, renderHtml({ cues, duration, format, style, position }));
writeJson(join(dir, 'assets', 'captions.json'), {
  generated: new Date().toISOString(),
  source: transcriptPath,
  style,
  position,
  duration,
  cueCount: cues.length,
  cues
});

if (wire) {
  const result = wireLayer(dir, {
    id: 'captions',
    src: 'compositions/captions.html',
    start: 0,
    duration,
    track,
    width: format.width,
    height: format.height
  });
  console.log(`Wired captions on track ${track}${result.updated ? ' (updated existing layer)' : ''}.`);
}

console.log(`Captions: ${outputPath}`);
console.log(`Cues: ${cues.length} | Duration: ${formatClock(duration)} | Style: ${style}/${position}`);
console.log(`First cue: ${cues[0].text}`);
console.log(`Last cue:  ${cues.at(-1).text}`);

function buildCues(words, opts) {
  const groups = [];
  let current = [];
  const flush = () => {
    if (!current.length) return;
    groups.push(current);
    current = [];
  };
  for (const word of words) {
    const previous = current.at(-1);
    const gap = previous ? word.start - previous.end : 0;
    const nextLength = current.length
      ? current.reduce((sum, item) => sum + item.text.length + 1, 0) + word.text.length
      : word.text.length;
    const sentenceEnd = previous ? /[.!?]$/.test(previous.text) : false;
    if (current.length && (current.length >= opts.chunk || nextLength > opts.maxChars || gap > 0.55 || sentenceEnd)) {
      flush();
    }
    current.push(word);
    if (/[.!?]$/.test(word.text)) flush();
  }
  flush();

  const cues = groups.map((group, index) => {
    const first = group[0];
    const last = group.at(-1);
    return {
      id: `cue-${String(index).padStart(3, '0')}`,
      start: round(Math.max(0, first.start - 0.06)),
      end: round(Math.min(opts.duration, last.end + 0.12)),
      text: group.map((w) => w.text).join(' ').replace(/\s+([,.!?;:])/g, '$1'),
      words: group.map((w) => ({
        text: w.text,
        start: w.start,
        end: w.end,
        sourceStart: w.source_start,
        sourceEnd: w.source_end
      }))
    };
  });

  for (let i = 0; i < cues.length; i++) {
    const cue = cues[i];
    const next = cues[i + 1];
    if (next && cue.end > next.start - 0.02) cue.end = round(Math.max(cue.start + 0.15, next.start - 0.02));
    if (cue.end <= cue.start) cue.end = round(Math.min(opts.duration, cue.start + 0.2));
    if (cue.end > opts.duration) cue.end = opts.duration;
  }
  return cues.filter((cue) => cue.end > cue.start);
}

function renderHtml({ cues, duration, format, style, position }) {
  const portrait = format.height > format.width;
  const left = portrait ? 64 : 160;
  const right = portrait ? 64 : 160;
  const bottom = portrait ? 300 : 72;
  const top = portrait ? 160 : 56;
  const fontSize = portrait ? 54 : 42;
  const maxWidth = portrait ? 920 : 1500;
  const cueCss = position === 'top'
    ? `#captions .cue{top:${top}px;bottom:auto}`
    : `#captions .cue{bottom:${bottom}px}`;
  const spanCss = style === 'boxed'
    ? `#captions .cue span{background:rgba(0,0,0,.78);border:1px solid rgba(255,255,255,.30);padding:18px 26px;border-radius:18px;box-shadow:0 8px 28px rgba(0,0,0,.32)}`
    : `#captions .cue span{background:transparent;border:0;padding:0;text-shadow:0 3px 0 #000,0 0 18px rgba(0,0,0,.95)}`;

  const cueHtml = cues.map((cue) => `      <div class="cue" id="${cue.id}"><span>${escapeHtml(cue.text)}</span></div>`).join('\n');
  const timeline = cues.map((cue) => [
    `      tl.set('#${cue.id}', { autoAlpha: 1 }, ${cue.start});`,
    `      tl.set('#${cue.id}', { autoAlpha: 0 }, ${cue.end});`
  ].join('\n')).join('\n');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <script src="assets/gsap.min.js"></script>
  <style>
    *{box-sizing:border-box}
    html,body{margin:0;width:${format.width}px;height:${format.height}px;overflow:hidden;background:transparent}
    #captions{position:relative;width:${format.width}px;height:${format.height}px;overflow:hidden;font-family:Inter,Arial,sans-serif;pointer-events:none}
    #captions .cue{position:absolute;left:${left}px;right:${right}px;display:flex;justify-content:center;opacity:0;visibility:hidden}
    ${cueCss}
    #captions .cue span{display:inline-block;max-width:${maxWidth}px;color:#fff;font-size:${fontSize}px;line-height:1.12;font-weight:800;letter-spacing:.02em;text-align:center;text-transform:uppercase}
    ${spanCss}
  </style>
</head>
<body>
  <div id="captions" data-composition-id="captions" data-start="0" data-duration="${duration}" data-width="${format.width}" data-height="${format.height}">
${cueHtml}
  </div>
  <script>
    const tl = gsap.timeline({ paused: true });
    tl.set('#captions .cue', { autoAlpha: 0 }, 0);
${timeline}
    tl.to({}, { duration: ${duration} }, 0);
    window.__timelines = window.__timelines || {};
    window.__timelines['captions'] = tl;
  </script>
</body>
</html>
`;
}

function round(value) {
  return Number(Number(value).toFixed(3));
}

#!/usr/bin/env node
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
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

const STOP_WORDS = new Set(['a', 'an', 'the', 'in', 'on', 'at', 'to', 'for', 'of', 'and', 'but', 'or', 'so', 'if', 'is', 'was', 'are', 'were', 'it', 'that', 'this', 'then', 'there', 'they', 'them', 'i', 'you', 'he', 'she', 'we', 'my', 'your', 'his', 'her', 'our', 'what', 'which', 'who', 'how', 'when', 'where', 'why']);
const NEG_WORDS = new Set(['lost', 'pissed', 'broke', 'never', 'bad', 'worst', 'drop', 'dropped', 'fail', 'failed', 'zero', 'hate', 'no', 'not', 'debt', 'loss', 'crash', 'stole', 'steal', 'jail', 'illegal', 'crazy', 'stupid', 'piss']);

function cleanWord(str) {
  return str.replace(/^[^\w$€£]+|[^\w$€£%]+$/g, '');
}

const args = process.argv.slice(2);
if (args.length === 0 || args.includes('--help')) {
  console.log(`Usage:
  node scripts/make-captions.mjs <project-slug> [options]

Options:
  --transcript <path>    Default: assets/transcript.json
  --output <path>        Default: compositions/captions.html
  --style creator|boxed|plain Default: creator
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
let style = 'creator';
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
if (!['creator', 'boxed', 'plain'].includes(style)) fail('--style must be creator, boxed or plain');
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

// Ensure Poppins font is available in project
const fontsDir = join(dir, 'assets', 'fonts');
const poppinsTarget = join(fontsDir, 'Poppins-Bold.ttf');
const studioFont = resolve(dir, '../../assets/fonts/Poppins-Bold.ttf');
if (!existsSync(poppinsTarget) && existsSync(studioFont)) {
  mkdirSync(fontsDir, { recursive: true });
  copyFileSync(studioFont, poppinsTarget);
}

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
  const bottom = portrait ? 340 : 72;
  const top = portrait ? 160 : 56;
  const fontSize = portrait ? 64 : 44;
  const maxWidth = portrait ? 960 : 1500;
  const cueCss = position === 'top'
    ? `#captions .cue{top:${top}px;bottom:auto}`
    : `#captions .cue{bottom:${bottom}px}`;

  let spanCss = '';
  if (style === 'creator') {
    spanCss = `
    #captions .cue span.cue-box { display: inline-flex; flex-wrap: wrap; justify-content: center; align-items: baseline; gap: 8px; max-width:${maxWidth}px; padding:0 30px; }
    .mk-cw {
      display: inline-block;
      font-family: "Poppins", sans-serif;
      font-size: ${fontSize}px;
      font-weight: 900;
      line-height: 1.05;
      text-transform: uppercase;
      letter-spacing: -0.01em;
      color: #ffffff;
      -webkit-text-stroke: 4px #000000;
      paint-order: stroke fill;
      text-shadow: 0 4px 12px rgba(0, 0, 0, 0.95), 0 2px 4px #000000;
      filter: drop-shadow(0 6px 20px rgba(0, 0, 0, 0.9));
      margin: 0 3px;
    }
    .mk-cw.key {
      font-size: ${fontSize + 8}px;
      color: #ffe600 !important;
      -webkit-text-stroke: 4.5px #000000;
      paint-order: stroke fill;
      text-shadow:
        0 0 10px #ffe600,
        0 0 25px rgba(255, 230, 0, 0.95),
        0 0 50px rgba(255, 215, 0, 0.8),
        0 4px 15px rgba(0, 0, 0, 0.95);
      filter: drop-shadow(0 0 30px rgba(255, 230, 0, 0.75)) drop-shadow(0 8px 24px rgba(0, 0, 0, 0.95));
    }
    .mk-cw.key.neg {
      color: #ff3b30 !important;
      -webkit-text-stroke: 4.5px #000000;
      paint-order: stroke fill;
      text-shadow:
        0 0 10px #ff3b30,
        0 0 25px rgba(255, 59, 48, 0.95),
        0 0 50px rgba(255, 59, 48, 0.8),
        0 4px 15px rgba(0, 0, 0, 0.95);
      filter: drop-shadow(0 0 30px rgba(255, 59, 48, 0.75)) drop-shadow(0 8px 24px rgba(0, 0, 0, 0.95));
    }
    `;
  } else if (style === 'boxed') {
    spanCss = `#captions .cue span{background:rgba(0,0,0,.78);border:1px solid rgba(255,255,255,.30);padding:18px 26px;border-radius:18px;box-shadow:0 8px 28px rgba(0,0,0,.32);color:#fff;font-size:${fontSize}px;line-height:1.12;font-weight:800;letter-spacing:.02em;text-align:center;text-transform:uppercase;max-width:${maxWidth}px;padding:0 30px;}`;
  } else {
    spanCss = `#captions .cue span{background:transparent;border:0;padding:0;color:#fff;font-size:${fontSize}px;line-height:1.12;font-weight:800;letter-spacing:.02em;text-align:center;text-transform:uppercase;text-shadow:0 3px 0 #000,0 0 18px rgba(0,0,0,.95);max-width:${maxWidth}px;padding:0 30px;}`;
  }

  let cueHtml = '';
  let timelineLines = [];

  if (style === 'creator') {
    let globalWordIdx = 0;
    cueHtml = cues.map((cue, ci) => {
      // Score words in cue to determine the prominent keyword
      let bestScore = -1;
      let keyWordIdx = -1;
      (cue.words || []).forEach((w, wi) => {
        const clean = cleanWord(w.text).toLowerCase();
        let score = 0;
        if (/\d|[$€£%]/.test(w.text)) score += 12;
        if (!STOP_WORDS.has(clean)) score += Math.min(clean.length, 8);
        if (score > bestScore) {
          bestScore = score;
          keyWordIdx = wi;
        }
      });
      cue.keyWordIdx = keyWordIdx;

      const wordsMarkup = (cue.words || []).map((w, wi) => {
        const wid = `w_${ci}_${wi}`;
        const clean = cleanWord(w.text).toLowerCase();
        const isKey = (wi === keyWordIdx);
        const isNeg = isKey && NEG_WORDS.has(clean);
        const cls = 'mk-cw' + (isKey ? ' key' : '') + (isNeg ? ' neg' : '');
        return `<span class="${cls}" id="${wid}">${escapeHtml(w.text)}</span>`;
      }).join(' ');

      return `      <div class="cue" id="${cue.id}"><span class="cue-box">${wordsMarkup}</span></div>`;
    }).join('\n');

    cues.forEach((cue, ci) => {
      timelineLines.push(`      tl.set('#${cue.id}', { autoAlpha: 1 }, ${cue.start});`);
      const words = cue.words || [];
      words.forEach((w, wi) => {
        const wid = `w_${ci}_${wi}`;
        const clean = cleanWord(w.text).toLowerCase();
        const isKey = (wi === cue.keyWordIdx);
        timelineLines.push(`      tl.set('#${wid}', { opacity: 0.45, scale: 0.95 }, ${cue.start});`);
        timelineLines.push(`      tl.fromTo('#${wid}', { scale: 1.25, opacity: 1.0 }, { scale: ${isKey ? 1.08 : 1.0}, opacity: 1.0, duration: 0.16, ease: "back.out(2.5)" }, ${w.start});`);
        if (wi + 1 < words.length) {
          const nextStart = words[wi + 1].start;
          timelineLines.push(`      tl.to('#${wid}', { scale: 1.0, opacity: 0.85, duration: 0.12, ease: "power2.out" }, ${nextStart});`);
        }
      });
      timelineLines.push(`      tl.set('#${cue.id}', { autoAlpha: 0 }, ${cue.end});`);
    });
  } else {
    cueHtml = cues.map((cue) => `      <div class="cue" id="${cue.id}"><span>${escapeHtml(cue.text)}</span></div>`).join('\n');
    timelineLines = cues.flatMap((cue) => [
      `      tl.set('#${cue.id}', { autoAlpha: 1 }, ${cue.start});`,
      `      tl.set('#${cue.id}', { autoAlpha: 0 }, ${cue.end});`
    ]);
  }

  const timeline = timelineLines.join('\n');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <script src="assets/gsap.min.js"></script>
  <style>
    @font-face {
      font-family: "Poppins";
      src: url("../assets/fonts/Poppins-Bold.ttf") format("truetype"),
           url("assets/fonts/Poppins-Bold.ttf") format("truetype");
      font-weight: 700 900;
      font-style: normal;
    }
    *{box-sizing:border-box}
    html,body{margin:0;width:${format.width}px;height:${format.height}px;overflow:hidden;background:transparent}
    #captions{position:relative;width:${format.width}px;height:${format.height}px;overflow:hidden;pointer-events:none}
    #captions .cue{position:absolute;left:0;right:0;width:100%;display:flex;justify-content:center;align-items:center;opacity:0;visibility:hidden;text-align:center;}
    ${cueCss}
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

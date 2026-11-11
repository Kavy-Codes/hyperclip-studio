#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { basename, extname, join, resolve } from 'node:path';
import {
  fail,
  formatClock,
  projectDir,
  projectFormat,
  probeMedia,
  readTranscript,
  writeJson
} from './lib/studio.mjs';
import { STUDIO_ROOT } from './lib/studio.mjs';

const args = process.argv.slice(2);
if (args.length === 0 || args.includes('--help')) {
  console.log(`Usage:
  node scripts/transcribe-clip.mjs <project-slug> [options]

Options:
  --input <path>       Audio/video to transcribe. Default: assets/working.mp4
  --import <path>      Import an existing .json, .srt or .vtt transcript
  --model <name>       Whisper model: tiny.en, base.en, small.en, medium.en. Default: base.en
  --language <code>    Language code. Default: en
  --engine <name>      auto, whisper, parakeet. Default: whisper
  --output <path>      Default: assets/transcript.json

Examples:
  node scripts/transcribe-clip.mjs my-clip
  node scripts/transcribe-clip.mjs my-clip --import captions.srt
  node scripts/transcribe-clip.mjs my-clip --model small.en --language en
`);
  process.exit(args.length === 0 ? 1 : 0);
}

const slug = args[0];
const dir = projectDir(slug);
const format = projectFormat(dir);
let inputPath = join(dir, 'assets', 'working.mp4');
let importPath = null;
let model = 'base.en';
let language = 'en';
let engine = 'whisper';
let outputPath = join(dir, 'assets', 'transcript.json');

for (let i = 1; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--input') inputPath = resolve(args[++i]);
  else if (arg === '--import') importPath = resolve(args[++i]);
  else if (arg === '--model') model = args[++i];
  else if (arg === '--language') language = args[++i];
  else if (arg === '--engine') engine = args[++i];
  else if (arg === '--output') outputPath = resolve(args[++i]);
  else if (arg.startsWith('--')) fail(`Unknown option: ${arg}`);
}

let rawEntries = [];
let producedBy = 'import';
let sourcePath = importPath;

if (importPath) {
  if (!existsSync(importPath)) fail(`Import not found: ${importPath}`);
  rawEntries = parseImport(importPath);
  producedBy = `import:${extname(importPath).slice(1).toLowerCase()}`;
} else {
  if (!existsSync(inputPath)) {
    fail(`Input not found: ${inputPath}. Run import-footage.mjs first or pass --input.`);
  }
  const whisper = findWhisper();
  if (!whisper) {
    fail(
      'Local whisper.cpp is not installed.\n' +
      'Run `./scripts/setup-asr.sh` once, or import a transcript with --import <file.srt|.vtt|.json>.'
    );
  }
  const tmp = join(dir, '.transcribe-tmp');
  rmSync(tmp, { recursive: true, force: true });
  mkdirSync(tmp, { recursive: true });
  const env = {
    ...process.env,
    HOME: join(STUDIO_ROOT, '.home'),
    HYPERFRAMES_WHISPER_PATH: whisper
  };
  console.error(`Transcribing ${basename(inputPath)} with ${model} (${engine})...`);
  try {
    execFileSync(
      'npx',
      [
        'hyperframes', 'transcribe', inputPath,
        '--dir', tmp,
        '--json',
        '--engine', engine,
        '--model', model,
        '--language', language
      ],
      { cwd: dir, env, stdio: ['ignore', 'inherit', 'inherit'], timeout: 30 * 60 * 1000 }
    );
  } catch (error) {
    rmSync(tmp, { recursive: true, force: true });
    fail(`Transcription failed. Check the model/binary setup and retry.\n${error.message}`);
  }
  const transcriptPath = join(tmp, 'transcript.json');
  if (!existsSync(transcriptPath)) {
    rmSync(tmp, { recursive: true, force: true });
    fail('HyperFrames reported success but wrote no transcript.json.');
  }
  const parsed = JSON.parse(readFileSync(transcriptPath, 'utf8'));
  rawEntries = Array.isArray(parsed) ? parsed : parsed.words || parsed.transcript || [];
  sourcePath = inputPath;
  producedBy = `hyperframes:${engine}:${model}`;
  rmSync(tmp, { recursive: true, force: true });
}

const normalized = normalizeEntries(rawEntries, language);
if (!normalized.words.length) fail('No timed words found in the transcript.');

const mediaProbe = existsSync(inputPath) ? probeMedia(inputPath) : null;
const audioDuration = Number(
  mediaProbe?.duration || normalized.audio_duration_secs || normalized.words.at(-1).end
);
const transcript = {
  language_code: language,
  audio_duration_secs: Number(audioDuration.toFixed(3)),
  produced_by: producedBy,
  source: sourcePath,
  words: normalized.words
};

writeJson(outputPath, transcript);
writeJson(join(dir, 'assets', 'transcript.raw.json'), {
  source: sourcePath,
  produced_by: producedBy,
  entries: rawEntries
});
writeFileSync(join(dir, 'assets', 'transcript.txt'), `${transcript.words.map((w) => w.text).join(' ')}\n`);
writeFileSync(join(dir, 'assets', 'transcript.md'), renderMarkdown(transcript));

console.log(`Transcript: ${outputPath}`);
console.log(`Words: ${transcript.words.length}`);
console.log(`Duration: ${formatClock(transcript.audio_duration_secs)} (${transcript.audio_duration_secs.toFixed(2)}s)`);
console.log(`First: ${transcript.words.slice(0, 8).map((w) => w.text).join(' ')}`);
console.log(`Last:  ${transcript.words.slice(-8).map((w) => w.text).join(' ')}`);
console.log('Next: ./scripts/cut-silences.sh ' + slug + ' --apply');

function findWhisper() {
  const envPath = process.env.HYPERFRAMES_WHISPER_PATH;
  if (envPath && existsSync(envPath)) return envPath;
  const candidates = [
    join(STUDIO_ROOT, 'tools', 'whisper.cpp', 'build', 'bin', 'whisper-cli'),
    join(STUDIO_ROOT, 'tools', 'whisper.cpp', 'build', 'whisper-cli')
  ];
  return candidates.find((p) => existsSync(p)) || null;
}

function normalizeEntries(entries, lang) {
  const words = [];
  for (const entry of entries) {
    if (!entry || typeof entry.text !== 'string') continue;
    const start = Number(entry.start);
    const end = Number(entry.end);
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) continue;
    const text = entry.text.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (!text) continue;
    const tokens = text.split(' ');
    if (tokens.length === 1) {
      words.push({
        text: tokens[0],
        start: round(start),
        end: round(end),
        source_start: entry.source_start ?? entry.sourceStart ?? null,
        source_end: entry.source_end ?? entry.sourceEnd ?? null
      });
      continue;
    }
    const total = tokens.reduce((sum, token) => sum + token.length, 0) || tokens.length;
    let cursor = start;
    tokens.forEach((token, index) => {
      const tokenEnd = index === tokens.length - 1
        ? end
        : round(cursor + ((end - start) * token.length) / total);
      words.push({
        text: token,
        start: round(cursor),
        end: round(tokenEnd),
        source_start: entry.source_start ?? entry.sourceStart ?? null,
        source_end: entry.source_end ?? entry.sourceEnd ?? null
      });
      cursor = tokenEnd;
    });
  }
  words.sort((a, b) => a.start - b.start);
  return { words, audio_duration_secs: words.length ? words.at(-1).end : 0, language_code: lang };
}

function parseImport(path) {
  const ext = extname(path).toLowerCase();
  if (ext === '.json') {
    const parsed = JSON.parse(readFileSync(path, 'utf8'));
    if (Array.isArray(parsed)) return parsed;
    if (Array.isArray(parsed.words)) return parsed.words;
    if (Array.isArray(parsed.transcript)) return parsed.transcript;
    if (Array.isArray(parsed.segments)) return parsed.segments;
    fail('JSON transcript must be an array or contain words[], transcript[] or segments[].');
  }
  if (ext === '.srt' || ext === '.vtt') return parseCues(readFileSync(path, 'utf8'));
  fail(`Unsupported transcript format: ${ext}. Use .json, .srt or .vtt.`);
}

function parseCues(text) {
  const normalized = text.replace(/\r\n/g, '\n').replace(/^\uFEFF/, '');
  const blocks = normalized.split(/\n{2,}/);
  const entries = [];
  const timeRe = /(\d{1,2}):(\d{2}):(\d{2})[.,](\d{3})\s*-->\s*(\d{1,2}):(\d{2}):(\d{2})[.,](\d{3})/;
  for (const block of blocks) {
    const lines = block.split('\n').map((line) => line.trim()).filter(Boolean);
    if (!lines.length || /^WEBVTT/i.test(lines[0]) || /^NOTE\b/i.test(lines[0])) continue;
    const timeLine = lines.find((line) => timeRe.test(line));
    if (!timeLine) continue;
    const match = timeLine.match(timeRe);
    const start = toSeconds(match[1], match[2], match[3], match[4]);
    const end = toSeconds(match[5], match[6], match[7], match[8]);
    const textLines = lines.slice(lines.indexOf(timeLine) + 1);
    const cueText = textLines.join(' ').replace(/<[^>]+>/g, '').trim();
    if (cueText) entries.push({ text: cueText, start, end });
  }
  if (!entries.length) fail('No timed cues found in the SRT/VTT file.');
  return entries;
}

function toSeconds(h, m, s, ms) {
  return Number(h) * 3600 + Number(m) * 60 + Number(s) + Number(ms) / 1000;
}

function round(value) {
  return Number(Number(value).toFixed(3));
}

function renderMarkdown(transcript) {
  const lines = [
    `# Transcript — ${slug}`,
    '',
    `| Field | Value |`,
    `|---|---|`,
    `| Produced by | ${transcript.produced_by} |`,
    `| Language | ${transcript.language_code} |`,
    `| Duration | ${transcript.audio_duration_secs.toFixed(2)}s |`,
    `| Words | ${transcript.words.length} |`,
    `| Source | ${transcript.source || 'UNKNOWN'} |`,
    '',
    '## Words',
    '',
    '| Start | End | Word |',
    '|---:|---:|---|',
    ...transcript.words.map((w) => `| ${w.start.toFixed(2)} | ${w.end.toFixed(2)} | ${w.text.replaceAll('|', '\\|')} |`),
    ''
  ];
  return `${lines.join('\n')}\n`;
}

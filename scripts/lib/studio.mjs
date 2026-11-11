import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync
} from 'node:fs';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const STUDIO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const KIT_ROOT = join(STUDIO_ROOT, 'vendor', 'herk-edit-kit');
export const PROJECTS_ROOT = join(STUDIO_ROOT, 'projects');
export const EXPORTS_ROOT = join(STUDIO_ROOT, 'exports');

export function fail(message, code = 1) {
  console.error(message);
  process.exit(code);
}

export function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

export function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

export function projectDir(slug) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug || '')) {
    fail(`Invalid project slug: ${slug || '(empty)'}. Use lowercase kebab-case.`);
  }
  const dir = join(PROJECTS_ROOT, slug);
  if (!existsSync(dir)) fail(`Project not found: ${dir}`);
  return dir;
}

export function projectMeta(dir) {
  const metaPath = join(dir, 'meta.json');
  if (!existsSync(metaPath)) fail(`meta.json missing in ${dir}`);
  return readJson(metaPath);
}

export function projectFormat(dir) {
  const meta = projectMeta(dir);
  return {
    width: Number(meta.width || 1080),
    height: Number(meta.height || 1920),
    fps: Number(meta.fps || 30),
    orientation: Number(meta.width || 1080) > Number(meta.height || 1920) ? 'landscape' : 'portrait'
  };
}

export function rootDuration(html) {
  const match = html.match(/id="clip"[^>]*data-duration="([0-9.]+)"/);
  return match ? Number(match[1]) : null;
}

export function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function hashFile(path) {
  const hash = createHash('sha256');
  hash.update(readFileSync(path));
  return hash.digest('hex');
}

export function probeMedia(path) {
  const raw = execFileSync(
    'ffprobe',
    [
      '-v', 'error',
      '-print_format', 'json',
      '-show_format',
      '-show_streams',
      path
    ],
    { encoding: 'utf8' }
  );
  const data = JSON.parse(raw);
  const video = (data.streams || []).find((s) => s.codec_type === 'video');
  const audio = (data.streams || []).find((s) => s.codec_type === 'audio');
  const fps = video?.avg_frame_rate || video?.r_frame_rate || null;
  const [num, den] = String(fps || '').split('/').map(Number);
  return {
    path: resolve(path),
    duration: Number(data.format?.duration || 0),
    size: Number(data.format?.size || statSync(path).size),
    bitRate: Number(data.format?.bit_rate || 0),
    formatName: data.format?.format_name || null,
    video: video
      ? {
          codec: video.codec_name || null,
          width: Number(video.width || 0),
          height: Number(video.height || 0),
          fps: num && den ? Number((num / den).toFixed(3)) : null,
          pixFmt: video.pix_fmt || null
        }
      : null,
    audio: audio
      ? {
          codec: audio.codec_name || null,
          sampleRate: Number(audio.sample_rate || 0),
          channels: Number(audio.channels || 0)
        }
      : null
  };
}

export function listProjects() {
  if (!existsSync(PROJECTS_ROOT)) return [];
  return readdirSync(PROJECTS_ROOT)
    .filter((name) => statSync(join(PROJECTS_ROOT, name)).isDirectory())
    .filter((name) => existsSync(join(PROJECTS_ROOT, name, 'index.html')))
    .sort();
}

export function replaceMarkedBlock(html, startMarker, endMarker, content, label) {
  const start = html.indexOf(startMarker);
  const end = html.indexOf(endMarker);
  if (start === -1 || end === -1 || end < start) {
    fail(`Missing ${startMarker} / ${endMarker} markers in index.html. Recreate the project from the current template or add the markers manually.`);
  }
  const before = html.slice(0, start + startMarker.length);
  const after = html.slice(end);
  return `${before}\n${content.trim()}\n    ${after}`;
}

export function appendToMarkedBlock(html, startMarker, endMarker, content, label) {
  const start = html.indexOf(startMarker);
  const end = html.indexOf(endMarker);
  if (start === -1 || end === -1 || end < start) {
    fail(`Missing ${startMarker} / ${endMarker} markers in index.html. Recreate the project from the current template or add the markers manually.`);
  }
  const before = html.slice(0, end).trimEnd();
  const after = html.slice(end);
  return `${before}\n${content.trim()}\n    ${after}`;
}

export function wireLayer(dir, options) {
  const {
    id,
    src,
    start = 0,
    duration,
    track,
    width,
    height,
    kind = 'composition'
  } = options;
  if (!id || !src) fail('wireLayer requires id and src');
  const indexPath = join(dir, 'index.html');
  let html = readFileSync(indexPath, 'utf8');
  const safeId = String(id).replace(/"/g, '&quot;');
  const attrs = [
    `id="${safeId}"`,
    `data-composition-id="${safeId}"`,
    `data-composition-src="${src}"`,
    `data-start="${start}"`,
    `data-duration="${duration}"`,
    `data-track-index="${track}"`,
    `data-width="${width}"`,
    `data-height="${height}"`
  ].join(' ');
  const snippet = kind === 'audio'
    ? `<audio id="${safeId}" data-start="${start}" data-duration="${duration}" data-track-index="${track}" data-volume="${options.volume ?? 1}" src="${src}"></audio>`
    : `<div ${attrs}></div>`;
  const block = kind === 'audio' ? ['<!-- AUDIO:START -->', '<!-- AUDIO:END -->'] : ['<!-- LAYERS:START -->', '<!-- LAYERS:END -->'];
  const existing = new RegExp(`<(?:div|audio)\\b[^>]*\\bid="${safeId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>(?:</(?:div|audio)>)?`, 'i');
  if (existing.test(html)) {
    html = html.replace(existing, snippet);
    writeFileSync(indexPath, html);
    return { changed: true, id, snippet, updated: true };
  }
  html = appendToMarkedBlock(html, block[0], block[1], snippet, kind);
  writeFileSync(indexPath, html);
  return { changed: true, id, snippet, updated: false };
}

export function setRootDuration(dir, duration) {
  const indexPath = join(dir, 'index.html');
  let html = readFileSync(indexPath, 'utf8');
  const old = rootDuration(html);
  if (!old) fail('Could not find #clip data-duration in index.html');
  const rounded = Number(Number(duration).toFixed(3));
  if (Math.abs(old - rounded) < 0.0005) return { changed: false, old, duration: rounded };
  html = html.replace(/(id="clip"[^>]*data-duration=")[0-9.]+(")/, `$1${rounded}$2`);
  // Keep the template's full-length layers in sync when they used the old duration.
  html = html.replaceAll(`data-duration="${old}"`, `data-duration="${rounded}"`);
  // The progress bar tween is the only inline duration that must track the root.
  html = html.replace(new RegExp(`duration:\\s*${old}(?=\\s*,\\s*ease:\\s*'none')`, 'g'), `duration: ${rounded}`);
  writeFileSync(indexPath, html);
  return { changed: true, old, duration: rounded };
}

export function readTranscript(path) {
  const raw = readJson(path);
  let words = [];
  if (Array.isArray(raw)) {
    words = raw.flatMap((entry) => splitEntry(entry));
  } else if (Array.isArray(raw.words)) {
    words = raw.words;
  } else if (Array.isArray(raw.transcript)) {
    words = raw.transcript.flatMap((entry) => splitEntry(entry));
  } else if (Array.isArray(raw.segments)) {
    words = raw.segments.flatMap((entry) => splitEntry(entry));
  }
  words = words
    .filter((w) => w && typeof w.text === 'string')
    .map((w) => ({
      text: w.text.trim(),
      start: Number(w.start),
      end: Number(w.end),
      source_start: w.source_start ?? w.sourceStart ?? null,
      source_end: w.source_end ?? w.sourceEnd ?? null
    }))
    .filter((w) => w.text && Number.isFinite(w.start) && Number.isFinite(w.end) && w.end > w.start)
    .sort((a, b) => a.start - b.start);
  if (!words.length) fail(`No timed words found in transcript: ${path}`);
  return {
    language_code: raw.language_code || raw.language || 'en',
    audio_duration_secs: Number(raw.audio_duration_secs || raw.duration || words.at(-1).end),
    words
  };
}

function splitEntry(entry) {
  if (!entry || typeof entry.text !== 'string') return [];
  const start = Number(entry.start);
  const end = Number(entry.end);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return [];
  const tokens = entry.text.trim().split(/\s+/).filter(Boolean);
  if (tokens.length <= 1) return [{ text: entry.text.trim(), start, end }];
  const totalChars = tokens.reduce((sum, token) => sum + token.length, 0) || tokens.length;
  let cursor = start;
  return tokens.map((token, index) => {
    const share = token.length / totalChars;
    const tokenEnd = index === tokens.length - 1 ? end : Number((cursor + (end - start) * share).toFixed(3));
    const word = { text: token, start: Number(cursor.toFixed(3)), end: tokenEnd };
    cursor = tokenEnd;
    return word;
  });
}

export function formatClock(seconds) {
  const total = Math.max(0, Number(seconds) || 0);
  const minutes = Math.floor(total / 60);
  const rest = total - minutes * 60;
  return `${String(minutes).padStart(2, '0')}:${rest.toFixed(2).padStart(5, '0')}`;
}

export function ensureDir(path) {
  mkdirSync(path, { recursive: true });
  return path;
}

export function copyToProject(dir, sourcePath, subdir = 'assets/source') {
  const destDir = ensureDir(join(dir, subdir));
  const dest = join(destDir, basename(sourcePath));
  if (resolve(sourcePath) !== resolve(dest)) {
    writeFileSync(dest, readFileSync(sourcePath));
  }
  return dest;
}

export function fileStem(path) {
  return basename(path, extname(path));
}

#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { projectDir, projectFormat, rootDuration, wireLayer } from './lib/studio.mjs';

const args = process.argv.slice(2);
if (args.length === 0 || args.includes('--help')) {
  console.log(`Usage:
  node scripts/wire-layer.mjs <project-slug> --id <id> --src <path> [options]

Options:
  --start <seconds>     Default: 0
  --duration <seconds>  Default: project root duration
  --track <number>      Default: 5
  --width <px>          Default: project width
  --height <px>         Default: project height
  --audio               Wire an <audio> element instead of a composition
  --volume <0..1>       Audio volume (with --audio). Default: 1

Examples:
  node scripts/wire-layer.mjs my-clip --id captions --src compositions/captions.html --track 6
  node scripts/wire-layer.mjs my-clip --id music --src assets/audio/bed.m4a --track 9 --audio --volume 0.12
`);
  process.exit(args.length === 0 ? 1 : 0);
}

const slug = args[0];
const dir = projectDir(slug);
const format = projectFormat(dir);
const options = {
  id: null,
  src: null,
  start: 0,
  duration: null,
  track: 5,
  width: format.width,
  height: format.height,
  kind: 'composition',
  volume: 1
};

for (let i = 1; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--id') options.id = args[++i];
  else if (arg === '--src') options.src = args[++i];
  else if (arg === '--start') options.start = Number(args[++i]);
  else if (arg === '--duration') options.duration = Number(args[++i]);
  else if (arg === '--track') options.track = Number(args[++i]);
  else if (arg === '--width') options.width = Number(args[++i]);
  else if (arg === '--height') options.height = Number(args[++i]);
  else if (arg === '--audio') options.kind = 'audio';
  else if (arg === '--volume') options.volume = Number(args[++i]);
  else if (arg.startsWith('--')) {
    console.error(`Unknown option: ${arg}`);
    process.exit(1);
  }
}

if (!options.id || !options.src) {
  console.error('Both --id and --src are required.');
  process.exit(1);
}
if (!Number.isFinite(options.start) || options.start < 0) {
  console.error('--start must be a non-negative number.');
  process.exit(1);
}
if (!Number.isFinite(options.track) || options.track < 0) {
  console.error('--track must be a non-negative number.');
  process.exit(1);
}
if (options.duration == null) {
  const html = readFileSync(`${dir}/index.html`, 'utf8');
  options.duration = rootDuration(html);
}
if (!Number.isFinite(options.duration) || options.duration <= 0) {
  console.error('--duration must be a positive number.');
  process.exit(1);
}

const result = wireLayer(dir, options);
if (result.changed) {
  console.log(`Wired ${options.kind}: ${options.id}`);
  console.log(result.snippet);
} else {
  console.log(`Already wired: ${options.id}`);
}

#!/usr/bin/env node

/**
 * HyperFrames Registry Search
 * 
 * Instant local search across all 456 official HyperFrames blocks, components, and visuals.
 * 
 * Usage:
 *   node STUDIO/scripts/search-registry.mjs <query> [options]
 *   ./STUDIO/scripts/search-registry.sh <query> [--limit 10] [--json]
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const STUDIO_ROOT = resolve(__dirname, '..');
const REGISTRY_FILE = join(STUDIO_ROOT, 'registry.json');

if (!existsSync(REGISTRY_FILE)) {
  console.error('Error: registry.json not found in', STUDIO_ROOT);
  process.exit(1);
}

const args = process.argv.slice(2);
let query = '';
let limit = 10;
let json = false;
let project = '';

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--limit' || arg === '-l') {
    limit = parseInt(args[++i], 10);
  } else if (arg === '--json') {
    json = true;
  } else if (arg === '--project' || arg === '-p') {
    project = args[++i];
  } else if (!arg.startsWith('-') && !query) {
    query = arg;
  }
}

if (!query) {
  console.error('Usage: search-registry.sh <search-query> [--limit <n>] [--project <slug>] [--json]');
  process.exit(1);
}

const items = JSON.parse(readFileSync(REGISTRY_FILE, 'utf-8'));
const q = query.toLowerCase().trim();
const terms = q.split(/\s+/);

// Score matches
const scored = items.map(item => {
  let score = 0;
  const name = item.name.toLowerCase();
  const title = item.title.toLowerCase();
  const desc = (item.description || '').toLowerCase();
  const tags = (item.tags || []).map(t => t.toLowerCase());

  for (const term of terms) {
    if (name === term) score += 100;
    else if (name.includes(term)) score += 40;
    if (title.toLowerCase() === term) score += 80;
    else if (title.includes(term)) score += 30;
    if (tags.includes(term)) score += 25;
    if (desc.includes(term)) score += 10;
  }

  return { item, score };
}).filter(res => res.score > 0);

scored.sort((a, b) => b.score - a.score);
const matches = scored.slice(0, limit).map(s => s.item);

if (json) {
  console.log(JSON.stringify(matches, null, 2));
  process.exit(0);
}

console.log(`\nFound ${scored.length} matching visual(s) for "${query}" (showing top ${matches.length}):\n`);

for (const m of matches) {
  const dim = m.dimensions ? `${m.dimensions.width}x${m.dimensions.height}` : 'auto';
  const dur = m.duration ? `${m.duration}s` : 'n/a';
  const projFlag = project ? `--dir projects/${project} ` : '';
  const installCmd = `npx hyperframes add ${m.name} ${projFlag}--no-clipboard`;

  console.log(`🔷 \x1b[1m${m.title}\x1b[0m (\x1b[36m${m.name}\x1b[0m) [${m.type}]`);
  console.log(`   ⏱ ${dur} | 📐 ${dim}`);
  if (m.description) {
    console.log(`   📝 ${m.description.slice(0, 140)}${m.description.length > 140 ? '...' : ''}`);
  }
  if (m.tags && m.tags.length > 0) {
    console.log(`   🏷 Tags: ${m.tags.slice(0, 6).join(', ')}`);
  }
  if (m.variables && m.variables.length > 0) {
    const vars = m.variables.map(v => `${v.id}=${JSON.stringify(v.default)}`).slice(0, 4).join(', ');
    console.log(`   ⚙ Vars: ${vars}`);
  }
  console.log(`   📥 Install: \x1b[32m${installCmd}\x1b[0m\n`);
}

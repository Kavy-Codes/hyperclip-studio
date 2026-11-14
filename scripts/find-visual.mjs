#!/usr/bin/env node

/**
 * Unified Visual Search for Creator Studio
 *
 * Searches across:
 *   1. 456 HyperFrames Official Registry Blocks
 *   2. 406 Herk Edit Kit Style Cards
 *   3. Studio Reusable Components
 *   4. Video Format Recipes
 *
 * Usage:
 *   ./STUDIO/scripts/find-visual.sh <query> [--project <slug>] [--limit <n>]
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const STUDIO_ROOT = resolve(__dirname, '..');

const REGISTRY_FILE = join(STUDIO_ROOT, 'registry.json');
const CATALOG_FILE = join(STUDIO_ROOT, 'catalog.json');

const args = process.argv.slice(2);
let query = '';
let project = '';
let limit = 5;
let json = false;

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--limit' || arg === '-l') {
    limit = parseInt(args[++i], 10);
  } else if (arg === '--project' || arg === '-p') {
    project = args[++i];
  } else if (arg === '--json') {
    json = true;
  } else if (!arg.startsWith('-') && !query) {
    query = arg;
  }
}

if (!query) {
  console.log(`
Usage:
  ./STUDIO/scripts/find-visual.sh <search-query> [options]

Options:
  --project <slug>   Tailor installation commands to this project
  --limit <n>        Max results per category (default: 5)
  --json             Output raw JSON results

Examples:
  ./STUDIO/scripts/find-visual.sh "stat" --project kylie-zero-v2
  ./STUDIO/scripts/find-visual.sh "phone"
  ./STUDIO/scripts/find-visual.sh "vox map"
`);
  process.exit(1);
}

const q = query.toLowerCase().trim();
const terms = q.split(/\s+/);

// 1. Search Registry
let registryMatches = [];
if (existsSync(REGISTRY_FILE)) {
  const regItems = JSON.parse(readFileSync(REGISTRY_FILE, 'utf-8'));
  const scored = regItems.map(item => {
    let score = 0;
    const name = (item.name || '').toLowerCase();
    const title = (item.title || '').toLowerCase();
    const desc = (item.description || '').toLowerCase();
    const tags = (item.tags || []).map(t => t.toLowerCase());

    for (const t of terms) {
      if (name === t) score += 100;
      else if (name.includes(t)) score += 40;
      if (title === t) score += 80;
      else if (title.includes(t)) score += 30;
      if (tags.includes(t)) score += 25;
      if (desc.includes(t)) score += 10;
    }
    return { item, score };
  }).filter(s => s.score > 0);

  scored.sort((a, b) => b.score - a.score);
  registryMatches = scored.slice(0, limit).map(s => s.item);
}

// 2. Search Catalog Cards
let cardMatches = [];
let compMatches = [];
let recipeMatches = [];
if (existsSync(CATALOG_FILE)) {
  const catalog = JSON.parse(readFileSync(CATALOG_FILE, 'utf-8'));
  const cards = catalog.cards || [];
  const scoredCards = cards.map(c => {
    let score = 0;
    const id = (c.id || '').toLowerCase();
    const styleName = (c.styleName || '').toLowerCase();
    const purpose = (c.purpose || '').toLowerCase();
    const slots = (c.slots || []).join(' ').toLowerCase();

    for (const t of terms) {
      if (id.includes(t)) score += 50;
      if (styleName.includes(t)) score += 40;
      if (purpose.includes(t)) score += 30;
      if (slots.includes(t)) score += 15;
    }
    return { item: c, score };
  }).filter(s => s.score > 0);

  scoredCards.sort((a, b) => b.score - a.score);
  cardMatches = scoredCards.slice(0, limit).map(s => s.item);

  // Components
  const comps = catalog.components || [];
  compMatches = comps.filter(c => {
    const txt = `${c.id} ${c.title || ''} ${c.summary || ''}`.toLowerCase();
    return terms.some(t => txt.includes(t));
  }).slice(0, limit);

  // Recipes
  const recipes = catalog.recipes || [];
  recipeMatches = recipes.filter(r => {
    const txt = `${r.id} ${r.title || ''} ${r.summary || ''}`.toLowerCase();
    return terms.some(t => txt.includes(t));
  }).slice(0, limit);
}

if (json) {
  console.log(JSON.stringify({ registry: registryMatches, cards: cardMatches, components: compMatches, recipes: recipeMatches }, null, 2));
  process.exit(0);
}

const totalCount = registryMatches.length + cardMatches.length + compMatches.length + recipeMatches.length;

if (totalCount === 0) {
  console.log(`\nNo visuals found matching "${query}". Try related terms (e.g., metric, phone, chart, quote, section).\n`);
  process.exit(0);
}

console.log(`\n===================================================================`);
console.log(`🔍 STUDIO VISUAL SEARCH: "${query}" (found ${totalCount} results)`);
console.log(`===================================================================\n`);

if (registryMatches.length > 0) {
  console.log(`📦 HYPERFRAMES REGISTRY BLOCKS (${registryMatches.length}):`);
  for (const m of registryMatches) {
    const dim = m.dimensions ? `${m.dimensions.width}x${m.dimensions.height}` : 'auto';
    const dur = m.duration ? `${m.duration}s` : 'n/a';
    const projFlag = project ? `--dir projects/${project} ` : '';
    console.log(`  🔷 \x1b[1m${m.title}\x1b[0m (\x1b[36m${m.name}\x1b[0m) [${m.type}]`);
    console.log(`     ⏱ ${dur} | 📐 ${dim}`);
    if (m.description) {
      console.log(`     📝 ${m.description.slice(0, 120)}${m.description.length > 120 ? '...' : ''}`);
    }
    console.log(`     📥 \x1b[32mnpx hyperframes add ${m.name} ${projFlag}--no-clipboard\x1b[0m\n`);
  }
}

if (cardMatches.length > 0) {
  console.log(`🃏 STYLE LIBRARY CARDS (${cardMatches.length}):`);
  for (const c of cardMatches) {
    const targetProj = project || '<slug>';
    console.log(`  🎴 \x1b[1m${c.styleName}\x1b[0m — \x1b[36m${c.purpose}\x1b[0m (\x1b[33m${c.id}\x1b[0m)`);
    console.log(`     ⏱ ${c.duration.min}-${c.duration.max}s | Slots: ${c.slots.join(', ')}`);
    console.log(`     📥 \x1b[32m./STUDIO/scripts/add-card.sh ${targetProj} ${c.id} --portrait --start 2 --duration 4\x1b[0m\n`);
  }
}

if (compMatches.length > 0) {
  console.log(`🧩 REUSABLE COMPONENTS (${compMatches.length}):`);
  for (const comp of compMatches) {
    const targetProj = project || '<slug>';
    console.log(`  🔹 \x1b[1m${comp.title}\x1b[0m (\x1b[36m${comp.id}\x1b[0m)`);
    if (comp.summary) console.log(`     📝 ${comp.summary}`);
    console.log(`     📥 \x1b[32m./STUDIO/scripts/add-component.sh ${targetProj} ${comp.id} --start 0 --duration 3\x1b[0m\n`);
  }
}

if (recipeMatches.length > 0) {
  console.log(`📖 PRODUCTION RECIPES (${recipeMatches.length}):`);
  for (const r of recipeMatches) {
    console.log(`  📜 \x1b[1m${r.title}\x1b[0m (\x1b[36m${r.id}\x1b[0m) -> ${r.file}`);
    if (r.summary) console.log(`     📝 ${r.summary}\n`);
  }
}

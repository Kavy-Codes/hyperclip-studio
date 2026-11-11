import { readFileSync, writeFileSync } from 'node:fs';

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error('Usage: node fill-template.mjs <file> [file...]');
  process.exit(1);
}

const values = {
  SLUG: process.env.SLUG || 'untitled-clip',
  TITLE: process.env.TITLE || process.env.SLUG || 'Untitled clip',
  CHANNEL: process.env.CHANNEL || 'UNKNOWN',
  DATE: process.env.DATE || new Date().toISOString().slice(0, 10),
  SOURCE: process.env.SOURCE || 'UNKNOWN',
  SOURCE_LABEL: process.env.SOURCE_LABEL || 'Source: UNKNOWN',
  FORMAT: process.env.FORMAT || 'portrait',
  WIDTH: process.env.WIDTH || '1080',
  HEIGHT: process.env.HEIGHT || '1920',
  DURATION: process.env.DURATION || '15',
  HOOK: process.env.HOOK || 'The moment everyone missed.',
  CONTEXT: process.env.CONTEXT || 'One line of context.',
  PAYOFF: process.env.PAYOFF || 'The payoff lands here.',
  CAPTION: process.env.CAPTION || 'Exact spoken words go here.',
  CARD_ID: process.env.CARD_ID || 'card-id',
  CARD_FILE: process.env.CARD_FILE || 'card.html',
  CARD_TITLE: process.env.CARD_TITLE || 'Style card',
  ADAPTER_ID: process.env.ADAPTER_ID || 'card-adapter'
};

for (const file of files) {
  let text = readFileSync(file, 'utf8');
  for (const [key, value] of Object.entries(values)) {
    text = text.split(`{{${key}}}`).join(value);
  }
  writeFileSync(file, text);
  console.log(`filled ${file}`);
}

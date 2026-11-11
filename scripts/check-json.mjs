#!/usr/bin/env node
// Run hyperframes check --json, suppress the known 0.7.109 root-start false positive,
// and print a compact pass/fail summary.
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const project = process.argv[2];
if (!project) {
  console.error('Usage: node scripts/check-json.mjs <project-dir> [check args]');
  process.exit(2);
}

const result = spawnSync('npx', ['hyperframes', 'check', '.', '--json', ...process.argv.slice(3)], {
  cwd: project,
  encoding: 'utf8',
  timeout: 15 * 60 * 1000,
});
let report;
try {
  report = JSON.parse(result.stdout);
} catch {
  process.stderr.write(result.stderr || result.stdout || '');
  process.exit(result.status || 1);
}

let html = '';
try {
  html = readFileSync(join(project, 'index.html'), 'utf8');
} catch {}
const rootTag = html.match(/<div[^>]*data-composition-id="[^"]+"[^>]*>/i)?.[0] || '';
const hasInlineTimedVideo = /<video\b[^>]*\bdata-start=/i.test(html);
const suppressRootStart = rootTag && !/\bdata-start=/.test(rootTag) && hasInlineTimedVideo;

const sections = ['lint', 'runtime', 'layout', 'motion', 'contrast'];
let totalErrors = 0;
let totalWarnings = 0;
let suppressed = 0;
for (const name of sections) {
  const section = report[name];
  if (!section) continue;
  const findings = (section.findings || []).filter((finding) => {
    if (name === 'lint' && finding.code === 'root_composition_missing_data_start' && suppressRootStart) {
      suppressed++;
      return false;
    }
    return true;
  });
  const errors = findings.filter((f) => f.severity === 'error').length;
  const warnings = findings.filter((f) => f.severity === 'warning').length;
  totalErrors += errors;
  totalWarnings += warnings;
  const status = errors ? 'FAIL' : warnings ? 'warn' : 'PASS';
  console.log(`${name.padEnd(9)} ${status}  ${errors} error(s), ${warnings} warning(s)`);
  for (const finding of findings) {
    if (finding.severity === 'info') continue;
    console.log(`  ${finding.severity === 'error' ? '✗' : '!'} [${finding.code}] ${finding.message}`);
    if (finding.fixHint) console.log(`    Fix: ${finding.fixHint}`);
  }
}
if (suppressed) {
  console.log(`lint      note: suppressed ${suppressed} known root_composition_missing_data_start false positive(s)`);
}
console.log(totalErrors ? 'Result: FAIL' : 'Result: PASS');
process.exit(totalErrors > 0 ? 1 : 0);

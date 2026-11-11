#!/usr/bin/env node
// Lint a project and suppress the known HyperFrames 0.7.109 false positive:
// root_composition_missing_data_start fires even though an inline <video data-start>
// requires the root to omit data-start to avoid video_nested_in_timed_element.
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const project = process.argv[2];
if (!project) {
  console.error('Usage: node scripts/lint-clip.mjs <project-dir> [lint args]');
  process.exit(2);
}

const result = spawnSync('npx', ['hyperframes', 'lint', '--json', ...process.argv.slice(3)], {
  cwd: project,
  encoding: 'utf8',
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
} catch {
  // The lint report will carry the real error.
}
const rootTag = html.match(/<div[^>]*data-composition-id="[^"]+"[^>]*>/i)?.[0] || '';
const hasInlineTimedVideo = /<video\b[^>]*\bdata-start=/i.test(html);
const suppressRootStart = rootTag && !/\bdata-start=/.test(rootTag) && hasInlineTimedVideo;

const findings = (report.findings || []).filter((finding) => {
  if (finding.code === 'root_composition_missing_data_start' && suppressRootStart) return false;
  return true;
});
const errorCount = findings.filter((f) => f.severity === 'error').length;
const warningCount = findings.filter((f) => f.severity === 'warning').length;
const infoCount = findings.filter((f) => f.severity === 'info').length;

if (suppressRootStart && (report.findings || []).some((f) => f.code === 'root_composition_missing_data_start')) {
  console.log('  note: suppressed root_composition_missing_data_start (inline <video data-start> requires root data-start omitted)');
}
for (const finding of findings) {
  if (finding.severity === 'info') continue;
  console.log(`  ${finding.severity === 'error' ? '✗' : '!'} [${finding.code}] ${finding.message}`);
  if (finding.fixHint) console.log(`    Fix: ${finding.fixHint}`);
}
console.log(`  ${errorCount} error(s), ${warningCount} warning(s), ${infoCount} info(s)`);
process.exit(errorCount > 0 ? 1 : 0);

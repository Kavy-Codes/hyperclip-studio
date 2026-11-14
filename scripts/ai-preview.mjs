#!/usr/bin/env node

/**
 * AI-Native Preview Engine for HyperFrames compositions
 * 
 * Purpose:
 * Built specifically for AI agents (zero human UI overhead, no React editor, no buttons).
 * Instant headless frame capture at arbitrary timestamps with fractional resolutions (1/8, 1/4, 1/2, 1).
 *
 * Usage:
 *   node STUDIO/scripts/ai-preview.mjs <slug> [options]
 *   ./STUDIO/scripts/ai-preview.sh <slug> --at 3.0,16.5,24.0 --scale 1/4
 */

import { execSync, spawn } from 'child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const STUDIO_ROOT = resolve(__dirname, '..');

// Helper to find Chrome headless binary
function findChromeExecutable() {
  const home = process.env.HOME || process.env.USERPROFILE || '/root';
  const candidates = [
    join(home, '.cache/hyperframes/chrome/chrome-headless-shell/linux-152.0.7977.30/chrome-headless-shell-linux64/chrome-headless-shell'),
    join(home, '.cache/hyperframes/chrome/chrome-headless-shell/linux-152.0.7928.2/chrome-headless-shell-linux64/chrome-headless-shell'),
    join(home, '.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell'),
    join(home, '.cache/ms-playwright/chromium_headless_shell-1208/chrome-headless-shell-linux64/chrome-headless-shell'),
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  ];
  for (const c of candidates) {
    if (existsSync(c)) return c;
  }
  // Try searching in cache
  try {
    const found = execSync(`find "${home}/.cache/hyperframes" -name chrome-headless-shell 2>/dev/null`, { encoding: 'utf-8' }).trim().split('\n')[0];
    if (found && existsSync(found)) return found;
  } catch {}
  try {
    const foundPw = execSync(`find "${home}/.cache/ms-playwright" -name chrome-headless-shell 2>/dev/null`, { encoding: 'utf-8' }).trim().split('\n')[0];
    if (foundPw && existsSync(foundPw)) return foundPw;
  } catch {}
  return null;
}

// Parse CLI flags
function parseArgs() {
  const args = process.argv.slice(2);
  let slug = '';
  const options = {
    at: [],
    scale: 0.25, // Default 1/4
    scaleLabel: '1/4',
    outDir: '',
    contactSheet: true,
    quality: 80,
    port: 3002,
    json: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (!arg.startsWith('-') && !slug) {
      slug = arg;
      continue;
    }
    if (arg === '--at') {
      const val = args[++i];
      if (val) options.at = val.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
    } else if (arg.startsWith('--at=')) {
      options.at = arg.slice(5).split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
    } else if (arg === '--scale' || arg === '-s') {
      const val = args[++i];
      parseScale(val, options);
    } else if (arg.startsWith('--scale=')) {
      parseScale(arg.slice(8), options);
    } else if (arg === '-o' || arg === '--out' || arg === '--output') {
      options.outDir = args[++i];
    } else if (arg === '--port') {
      options.port = parseInt(args[++i], 10);
    } else if (arg === '--no-contact-sheet') {
      options.contactSheet = false;
    } else if (arg === '--json') {
      options.json = true;
    } else if (arg === '--quality' || arg === '-q') {
      options.quality = parseInt(args[++i], 10);
    }
  }

  if (!slug) {
    console.error('Usage: ai-preview <slug> [--at <seconds>] [--scale 1/8|1/4|1/2|1] [-o <outDir>]');
    process.exit(1);
  }

  return { slug, options };
}

function parseScale(val, options) {
  if (val === '1/8' || val === '0.125') {
    options.scale = 0.125;
    options.scaleLabel = '1/8';
  } else if (val === '1/4' || val === '0.25') {
    options.scale = 0.25;
    options.scaleLabel = '1/4';
  } else if (val === '1/2' || val === '0.5') {
    options.scale = 0.5;
    options.scaleLabel = '1/2';
  } else if (val === '1' || val === '1/1' || val === '1.0' || val === 'full') {
    options.scale = 1.0;
    options.scaleLabel = 'full';
  } else {
    const f = parseFloat(val);
    if (!isNaN(f) && f > 0 && f <= 1) {
      options.scale = f;
      options.scaleLabel = `${Math.round(f * 100)}%`;
    }
  }
}

// Ensure the HyperFrames background preview server is active
async function ensurePreviewServer(slug, initialPort = 3002) {
  for (let port = initialPort; port <= initialPort + 10; port++) {
    const checkUrl = `http://127.0.0.1:${port}/api/projects`;
    let res;
    try {
      res = await fetch(checkUrl);
    } catch {
      // Port is completely free! Start preview server on this port
      const projDir = resolve(STUDIO_ROOT, 'projects', slug);
      if (!existsSync(projDir)) {
        throw new Error(`Project directory not found: ${projDir}`);
      }
      execSync(`npx hyperframes preview --background --no-open --port=${port} "${projDir}"`, {
        cwd: STUDIO_ROOT,
        stdio: 'ignore'
      });
      // Wait for it to become ready
      const deadline = Date.now() + 6000;
      while (Date.now() < deadline) {
        try {
          const r = await fetch(checkUrl);
          if (r.ok) return port;
        } catch {}
        await new Promise(r => setTimeout(r, 200));
      }
      continue;
    }
    if (res && res.ok) {
      const data = await res.json();
      if (data.projects && data.projects.some(p => p.id === slug)) {
        return port;
      }
    }
  }
  throw new Error(`Failed to find or launch preview server for project "${slug}"`);
}

async function main() {
  const { slug, options } = parseArgs();
  const projDir = resolve(STUDIO_ROOT, 'projects', slug);
  if (!existsSync(projDir)) {
    console.error(`Error: Project "${slug}" not found in ${projDir}`);
    process.exit(1);
  }

  // Determine output directory
  const outDir = options.outDir ? resolve(options.outDir) : resolve(projDir, '.preview');
  mkdirSync(outDir, { recursive: true });

  // Locate chrome
  const chromePath = findChromeExecutable();
  if (!chromePath) {
    console.error('Error: Could not locate Chrome/Chromium headless shell');
    process.exit(1);
  }

  // Ensure preview server
  const activePort = await ensurePreviewServer(slug, options.port);

  // Import playwright from vendored herk kit
  let playwright;
  try {
    playwright = await import(resolve(STUDIO_ROOT, 'vendor/herk-edit-kit/node_modules/playwright/index.js'));
  } catch {
    playwright = await import('playwright');
  }
  const { chromium } = playwright.default || playwright;

  // Determine timestamps to capture
  let timestamps = options.at;
  if (!timestamps || timestamps.length === 0) {
    // Read meta.json duration or default to 5 samples
    let duration = 30;
    try {
      const meta = JSON.parse(readFileSync(join(projDir, 'meta.json'), 'utf-8'));
      if (meta.duration) duration = meta.duration;
    } catch {}
    timestamps = [
      Math.round(duration * 0.1 * 10) / 10,
      Math.round(duration * 0.3 * 10) / 10,
      Math.round(duration * 0.5 * 10) / 10,
      Math.round(duration * 0.7 * 10) / 10,
      Math.round(duration * 0.9 * 10) / 10
    ];
  }

  // Launch headless browser
  const browser = await chromium.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const previewUrl = `http://127.0.0.1:${activePort}/api/projects/${encodeURIComponent(slug)}/preview`;
  const context = await browser.newContext({
    viewport: { width: 1080, height: 1920 }
  });
  const page = await context.newPage();

  // Navigate to pure composition canvas
  await page.goto(previewUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.__renderReady === true, { timeout: 8000 }).catch(() => {});

  // Determine composition dimensions from DOM
  const compInfo = await page.evaluate(() => {
    const root = document.querySelector('[data-composition-id]') || document.body;
    const w = parseInt(root.getAttribute('data-width') || window.innerWidth || '1080', 10);
    const h = parseInt(root.getAttribute('data-height') || window.innerHeight || '1920', 10);
    const dur = parseFloat(root.getAttribute('data-duration') || '0');
    return { width: w, height: h, duration: dur };
  });

  const targetW = Math.round(compInfo.width * options.scale);
  const targetH = Math.round(compInfo.height * options.scale);

  // Ensure all videos have loaded data
  await page.evaluate(async () => {
    const vids = Array.from(document.querySelectorAll('video'));
    await Promise.all(vids.map(v => {
      if (v.readyState >= 2) return Promise.resolve();
      return new Promise(res => {
        v.addEventListener('loadeddata', () => res(), { once: true });
        v.addEventListener('canplay', () => res(), { once: true });
        setTimeout(res, 2500);
      });
    }));
  });

  const capturedFrames = [];

  for (const time of timestamps) {
    const safeTime = Math.max(0, time);
    // Seek timeline & media in browser
    await page.evaluate(async (t) => {
      // 1. Seek video elements and await frame readiness
      const vids = Array.from(document.querySelectorAll('video'));
      await Promise.all(vids.map(v => new Promise(res => {
        const onDone = () => {
          // If browser supports requestVideoFrameCallback, wait 1 frame
          if ('requestVideoFrameCallback' in v) {
            v.requestVideoFrameCallback(() => res());
          } else {
            setTimeout(res, 80);
          }
        };
        if (Math.abs(v.currentTime - t) < 0.03 && v.readyState >= 2) return onDone();
        v.addEventListener('seeked', onDone, { once: true });
        v.currentTime = t;
        setTimeout(res, 1200); // Generous fallback for slow decoding
      })));

      // 2. Seek HyperFrames player
      if (window.__player && typeof window.__player.seek === 'function') {
        window.__player.seek(t);
      }
      // 3. Fallback seek all registered timelines
      if (window.__timelines) {
        for (const k of Object.keys(window.__timelines)) {
          window.__timelines[k].seek(t).pause();
        }
      }
      // 4. Tick GSAP ticker
      if (window.gsap && window.gsap.ticker) {
        window.gsap.ticker.tick();
      }
      if (typeof window.__hfWaitForSeekCompletion === 'function') {
        await window.__hfWaitForSeekCompletion();
      }
    }, safeTime);

    // Wait for composite flush
    await page.waitForTimeout(150);

    // Save initial master shot to temp buffer/file
    const rawPath = join(outDir, `_raw_${safeTime}s.jpg`);
    await page.screenshot({ path: rawPath, type: 'jpeg', quality: 90 });

    // Scale to requested resolution with ffmpeg
    const timeLabel = safeTime.toFixed(1).replace(/\.0$/, '');
    const finalName = `frame-${timeLabel}s-${options.scaleLabel.replace('/', '-')}.jpg`;
    const finalPath = join(outDir, finalName);

    if (options.scale === 1.0) {
      execSync(`mv "${rawPath}" "${finalPath}"`);
    } else {
      execSync(`ffmpeg -y -i "${rawPath}" -vf "scale=${targetW}:${targetH}" -q:v 3 "${finalPath}" 2>/dev/null`);
      try { execSync(`rm -f "${rawPath}"`); } catch {}
    }

    const stat = execSync(`ls -lh "${finalPath}"`, { encoding: 'utf-8' }).trim().split(/\s+/);
    const size = stat[4] || '';

    capturedFrames.push({
      time: safeTime,
      path: finalPath,
      size,
      width: targetW,
      height: targetH
    });
  }

  await browser.close();

  // Create a contact sheet if requested and multiple frames exist
  let contactSheetPath = null;
  if (options.contactSheet && capturedFrames.length > 1) {
    const csName = `contact-sheet-${options.scaleLabel.replace('/', '-')}.jpg`;
    contactSheetPath = join(outDir, csName);
    const inputArgs = capturedFrames.map(f => `-i "${f.path}"`).join(' ');
    const count = capturedFrames.length;
    // Horizontal strip or grid layout
    const filter = `hstack=inputs=${count}`;
    try {
      execSync(`ffmpeg -y ${inputArgs} -filter_complex "${filter}" -q:v 3 "${contactSheetPath}" 2>/dev/null`);
    } catch {
      // Fallback to montage if available
      try {
        const framePaths = capturedFrames.map(f => `"${f.path}"`).join(' ');
        execSync(`montage ${framePaths} -tile ${count}x1 -geometry +4+4 "${contactSheetPath}" 2>/dev/null`);
      } catch {}
    }
  }

  const result = {
    ok: true,
    slug,
    scale: options.scaleLabel,
    resolution: `${targetW}x${targetH}`,
    outDir,
    frames: capturedFrames,
    contactSheet: contactSheetPath
  };

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`\n AI Preview Generated (${options.scaleLabel} | ${targetW}x${targetH}):`);
    for (const f of capturedFrames) {
      console.log(`  [${f.time}s] -> ${f.path} (${f.size})`);
    }
    if (contactSheetPath) {
      console.log(`\n Contact Sheet Grid: ${contactSheetPath}`);
    }
  }
}

main().catch(err => {
  console.error('AI Preview Error:', err);
  process.exit(1);
});

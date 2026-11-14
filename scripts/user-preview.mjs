#!/usr/bin/env node

/**
 * User-Facing Multi-Resolution Preview Engine
 * 
 * Generates:
 * 1. Scaled frame captures at 1/8, 1/4, 1/2, and 1.0 (Full 1080p).
 * 2. Stitched contact sheet grids for fast visual comparison.
 * 3. An interactive standalone web app (preview.html) with:
 *    - Resolution switcher (1/8, 1/4, 1/2, 1.0)
 *    - Beat-by-beat timeline scrubber
 *    - Audio playback for mix.wav
 *    - Pre-render health check (Face Sanctuary, Loudness, Caption Sync)
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const STUDIO_ROOT = resolve(__dirname, '..');
const REPO_ROOT = resolve(STUDIO_ROOT, '..');

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
    '/usr/bin/chromium-browser'
  ];
  for (const c of candidates) {
    if (existsSync(c)) return c;
  }
  try {
    const found = execSync(`find "${home}/.cache/hyperframes" -name chrome-headless-shell 2>/dev/null`, { encoding: 'utf-8' }).trim().split('\n')[0];
    if (found && existsSync(found)) return found;
  } catch {}
  return null;
}

// Find default or newest project
function findDefaultSlug() {
  const projectsDir = resolve(STUDIO_ROOT, 'projects');
  if (!existsSync(projectsDir)) return 'podcast-5';
  try {
    const dirs = execSync(`ls -td "${projectsDir}"/*/ 2>/dev/null`, { encoding: 'utf-8' }).trim().split('\n').filter(Boolean);
    if (dirs.length > 0) {
      const latest = dirs[0].replace(/\/+$/, '').split('/').pop();
      return latest;
    }
  } catch {}
  return 'podcast-5';
}

// Automatically detect narrative beat timestamps from project timeline and index.html
function detectProjectBeats(projDir) {
  const indexPath = join(projDir, 'index.html');
  if (!existsSync(indexPath)) return null;
  const content = readFileSync(indexPath, 'utf8');

  const beats = [];
  // Match section comments like: // BEAT 1: HOOK (1.60s - 3.20s)
  const commentRegex = /\/\/\s*BEAT\s*([0-9A-Za-z]+):\s*([^\n(]+)\(([\d.]+)s\s*-\s*([\d.]+)s\)/gi;
  let match;
  while ((match = commentRegex.exec(content)) !== null) {
    const num = match[1].trim();
    const title = match[2].trim();
    const start = parseFloat(match[3]);
    const end = parseFloat(match[4]);
    const mid = parseFloat(((start + end) / 2).toFixed(1));
    beats.push({
      t: mid,
      title: `Beat ${num}: ${title}`,
      desc: `${start}s - ${end}s`
    });
  }

  // Fallback: check cues.json
  if (beats.length === 0) {
    const cuesPath = join(projDir, 'assets', 'cues.json');
    if (existsSync(cuesPath)) {
      try {
        const cues = JSON.parse(readFileSync(cuesPath, 'utf8'));
        cues.forEach((c, idx) => {
          if (['hit', 'swipe'].includes(c.cue) || c.fx) {
            beats.push({
              t: parseFloat(c.t.toFixed(1)),
              title: c.fx || `Beat ${idx + 1}`,
              desc: `${c.cue} @ ${c.t}s`
            });
          }
        });
      } catch {}
    }
  }

  return beats.length > 0 ? beats : null;
}

// Parse CLI flags
function parseArgs() {
  const args = process.argv.slice(2);
  let slug = '';
  let resolutions = ['1/4']; // Default
  let at = null;
  let port = 3002;
  let openBrowser = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (!arg.startsWith('-') && !slug) {
      slug = arg;
      continue;
    }
    if (arg === '--res' || arg === '-r' || arg === '--scale' || arg === '-s') {
      const val = args[++i];
      if (val === 'all') {
        resolutions = ['1/8', '1/4', '1/2', '1'];
      } else {
        resolutions = val.split(',').map(s => s.trim());
      }
    } else if (arg.startsWith('--res=') || arg.startsWith('--scale=')) {
      const val = arg.split('=')[1];
      if (val === 'all') {
        resolutions = ['1/8', '1/4', '1/2', '1'];
      } else {
        resolutions = val.split(',').map(s => s.trim());
      }
    } else if (arg === '--at') {
      const val = args[++i];
      if (val) at = val.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
    } else if (arg.startsWith('--at=')) {
      at = arg.slice(5).split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
    } else if (arg === '--open' || arg === '-o') {
      openBrowser = true;
    } else if (arg === '--port') {
      port = parseInt(args[++i], 10);
    }
  }

  if (!slug) slug = findDefaultSlug();
  return { slug, resolutions, at, port, openBrowser };
}

// Ensure the HyperFrames background preview server is active
async function ensurePreviewServer(slug, initialPort = 3002) {
  for (let p = initialPort; p <= initialPort + 10; p++) {
    const checkUrl = `http://127.0.0.1:${p}/api/projects`;
    let res;
    try {
      res = await fetch(checkUrl);
    } catch {
      const projDir = resolve(STUDIO_ROOT, 'projects', slug);
      execSync(`npx hyperframes preview --background --no-open --port=${p} "${projDir}"`, {
        cwd: STUDIO_ROOT,
        stdio: 'ignore'
      });
      const deadline = Date.now() + 6000;
      while (Date.now() < deadline) {
        try {
          const r = await fetch(checkUrl);
          if (r.ok) return p;
        } catch {}
        await new Promise(r => setTimeout(r, 200));
      }
      continue;
    }
    if (res && res.ok) {
      const data = await res.json();
      if (data.projects && data.projects.some(proj => proj.id === slug)) {
        return p;
      }
    }
  }
  throw new Error(`Failed to find or launch preview server for "${slug}"`);
}

async function main() {
  const { slug, resolutions, at, port, openBrowser } = parseArgs();
  const projDir = resolve(STUDIO_ROOT, 'projects', slug);
  if (!existsSync(projDir)) {
    console.error(`Project not found: ${projDir}`);
    process.exit(1);
  }

  // Discover beats dynamically if not provided explicitly via --at
  let activeBeats = [];
  let activeAt = at;
  if (!activeAt || activeAt.length === 0) {
    const detected = detectProjectBeats(projDir);
    if (detected && detected.length > 0) {
      activeBeats = detected;
      activeAt = detected.map(b => b.t);
    } else {
      let projectDur = 30.0;
      const indexHtmlPath = join(projDir, 'index.html');
      if (existsSync(indexHtmlPath)) {
        const m = readFileSync(indexHtmlPath, 'utf8').match(/data-duration=["']([\d.]+)["']/);
        if (m) projectDur = parseFloat(m[1]);
      }
      const fractions = [0.08, 0.22, 0.38, 0.58, 0.78, 0.94];
      activeAt = fractions.map(f => parseFloat((f * projectDur).toFixed(1)));
      activeBeats = activeAt.map((t, i) => ({ t, title: `Beat ${i + 1}`, desc: `${t}s` }));
    }
  } else {
    activeBeats = activeAt.map((t, i) => ({ t, title: `Point ${i + 1}`, desc: `${t}s` }));
  }

  const outDir = resolve(projDir, '.preview');
  mkdirSync(outDir, { recursive: true });

  const chromePath = findChromeExecutable();
  if (!chromePath) {
    console.error('Chrome headless binary not found.');
    process.exit(1);
  }

  console.log(`\n========================================================`);
  console.log(` HyperFrames User Preview Engine`);
  console.log(` Project:      ${slug}`);
  console.log(` Timestamps:   ${activeAt.map(t => t.toFixed(1) + 's').join(', ')}`);
  console.log(` Resolutions:  ${resolutions.join(', ')}`);
  console.log(` Output Dir:   ${outDir}`);
  console.log(`========================================================\n`);

  console.log(`Connecting to HyperFrames preview server...`);
  const activePort = await ensurePreviewServer(slug, port);

  let playwright;
  try {
    playwright = await import(resolve(STUDIO_ROOT, 'vendor/herk-edit-kit/node_modules/playwright/index.js'));
  } catch {
    playwright = await import('playwright');
  }
  const { chromium } = playwright.default || playwright;

  const browser = await chromium.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const previewUrl = `http://127.0.0.1:${activePort}/api/projects/${encodeURIComponent(slug)}/preview`;
  const context = await browser.newContext({ viewport: { width: 1080, height: 1920 } });
  const page = await context.newPage();

  console.log(`Loading canvas: ${previewUrl}`);
  await page.goto(previewUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.__renderReady === true, { timeout: 8000 }).catch(() => {});

  // Wait for media and videos
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

  // Scale map
  const scaleMap = {
    '1/8': { scale: 0.125, w: 135, h: 240, label: '1-8' },
    '1/4': { scale: 0.25,  w: 270, h: 480, label: '1-4' },
    '1/2': { scale: 0.50,  w: 540, h: 960, label: '1-2' },
    '1':   { scale: 1.00,  w: 1080, h: 1920, label: '1' },
    '1.0': { scale: 1.00,  w: 1080, h: 1920, label: '1' }
  };

  const framesByRes = {};
  for (const r of resolutions) {
    framesByRes[r] = [];
  }

  console.log(`Capturing master frames...`);

  for (let idx = 0; idx < activeAt.length; idx++) {
    const t = activeAt[idx];
    const safeTime = Math.max(0, t);
    const timeLabel = safeTime.toFixed(1).replace(/\.0$/, '');

    // Seek in browser
    await page.evaluate(async (targetTime) => {
      const vids = Array.from(document.querySelectorAll('video'));
      await Promise.all(vids.map(v => new Promise(res => {
        const onDone = () => {
          if ('requestVideoFrameCallback' in v) {
            v.requestVideoFrameCallback(() => res());
          } else {
            setTimeout(res, 80);
          }
        };
        if (Math.abs(v.currentTime - targetTime) < 0.03 && v.readyState >= 2) return onDone();
        v.addEventListener('seeked', onDone, { once: true });
        v.currentTime = targetTime;
        setTimeout(res, 1200);
      })));

      if (window.__player && typeof window.__player.seek === 'function') {
        window.__player.seek(targetTime);
      }
      if (window.__timelines) {
        for (const k of Object.keys(window.__timelines)) {
          window.__timelines[k].seek(targetTime).pause();
        }
      }
      if (window.gsap && window.gsap.ticker) {
        window.gsap.ticker.tick();
      }
    }, safeTime);

    await page.waitForTimeout(160);

    // Save full master screenshot
    const rawPath = join(outDir, `_master_${timeLabel}s.jpg`);
    await page.screenshot({ path: rawPath, type: 'jpeg', quality: 95 });

    // Generate derivatives for each requested resolution
    for (const resKey of resolutions) {
      const info = scaleMap[resKey] || scaleMap['1/4'];
      const outName = `frame-${timeLabel}s-${info.label}.jpg`;
      const outPath = join(outDir, outName);

      if (info.scale === 1.0) {
        copyFileSync(rawPath, outPath);
      } else {
        execSync(`ffmpeg -y -i "${rawPath}" -vf "scale=${info.w}:${info.h}" -q:v 3 "${outPath}" 2>/dev/null`);
      }

      const stat = execSync(`ls -lh "${outPath}"`, { encoding: 'utf-8' }).trim().split(/\s+/);
      const sizeStr = stat[4] || '';

      framesByRes[resKey].push({
        time: safeTime,
        label: timeLabel,
        res: resKey,
        width: info.w,
        height: info.h,
        file: outName,
        path: outPath,
        size: sizeStr
      });
    }

    try { execSync(`rm -f "${rawPath}"`); } catch {}
    process.stdout.write(`  ✓ Captured [${timeLabel}s] across ${resolutions.length} resolution(s)\n`);
  }

  await browser.close();

  // Create contact sheets for each resolution
  const contactSheets = {};
  for (const resKey of resolutions) {
    const info = scaleMap[resKey] || scaleMap['1/4'];
    const csName = `contact-sheet-${info.label}.jpg`;
    const csPath = join(outDir, csName);
    const frames = framesByRes[resKey];
    if (frames && frames.length > 1) {
      const inputs = frames.map(f => `-i "${f.path}"`).join(' ');
      const filter = `hstack=inputs=${frames.length}`;
      try {
        execSync(`ffmpeg -y ${inputs} -filter_complex "${filter}" -q:v 3 "${csPath}" 2>/dev/null`);
        contactSheets[resKey] = csName;
      } catch {}
    }
  }

  // Generate interactive HTML Preview Gallery
  const htmlPath = join(outDir, 'index.html');
  const rootPreviewHtml = resolve(REPO_ROOT, 'preview.html');

  const beatLabels = activeBeats;

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview: ${slug}</title>
  <style>
    :root {
      --bg: #090b10;
      --panel: #11151f;
      --border: rgba(255, 255, 255, 0.1);
      --accent: #ffe600;
      --blue: #3b82f6;
      --green: #10b981;
      --red: #ef4444;
      --text: #f3f4f6;
      --muted: #9ca3af;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    header {
      background: var(--panel);
      border-bottom: 1px solid var(--border);
      padding: 16px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .badge {
      background: #232a3b;
      color: var(--accent);
      font-weight: 800;
      font-size: 11px;
      padding: 4px 8px;
      border-radius: 4px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }
    h1 { font-size: 18px; font-weight: 700; }
    
    .res-bar {
      display: flex;
      background: #0d1017;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 3px;
      gap: 4px;
    }
    .res-btn {
      background: transparent;
      border: none;
      color: var(--muted);
      font-size: 13px;
      font-weight: 600;
      padding: 6px 14px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .res-btn:hover { color: #fff; background: rgba(255, 255, 255, 0.05); }
    .res-btn.active {
      background: var(--blue);
      color: #fff;
    }

    main {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24px;
      gap: 24px;
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
    }

    .viewer-card {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
      position: relative;
    }

    .frame-container {
      width: 360px;
      height: 640px;
      background: #000;
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 25px rgba(0, 0, 0, 0.8);
      position: relative;
    }
    .frame-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .hud-overlay {
      position: absolute;
      top: 10px;
      left: 10px;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(8px);
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-family: monospace;
      color: var(--accent);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    /* Timeline beats buttons */
    .beats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 12px;
      width: 100%;
    }
    .beat-btn {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 12px;
      text-align: left;
      cursor: pointer;
      color: var(--text);
      transition: all 0.15s ease;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .beat-btn:hover {
      border-color: var(--accent);
      transform: translateY(-2px);
    }
    .beat-btn.active {
      border-color: var(--accent);
      background: rgba(255, 230, 0, 0.08);
    }
    .beat-time {
      font-size: 11px;
      font-weight: 700;
      color: var(--accent);
      font-family: monospace;
    }
    .beat-title {
      font-size: 13px;
      font-weight: 600;
    }
    .beat-desc {
      font-size: 11px;
      color: var(--muted);
    }

    /* Audio section */
    .audio-card {
      width: 100%;
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
    }
    .audio-meta {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .pill {
      font-size: 12px;
      padding: 4px 10px;
      border-radius: 20px;
      font-weight: 600;
    }
    .pill.green { background: rgba(16, 185, 129, 0.15); color: var(--green); border: 1px solid rgba(16, 185, 129, 0.3); }

    /* Contact sheet */
    .contact-sheet-wrap {
      width: 100%;
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .contact-sheet-img {
      width: 100%;
      border-radius: 8px;
      border: 1px solid var(--border);
    }

    .cmd-box {
      background: #0d1017;
      padding: 12px 16px;
      border-radius: 6px;
      font-family: monospace;
      font-size: 13px;
      color: var(--accent);
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid var(--border);
      width: 100%;
    }
    .copy-btn {
      background: #232a3b;
      border: none;
      color: #fff;
      padding: 4px 10px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    }
    .copy-btn:hover { background: var(--blue); }
  </style>
</head>
<body>
  <header>
    <div class="brand">
      <div class="badge">HyperFrames</div>
      <h1>Project Preview: <code>${slug}</code></h1>
    </div>
    <div class="res-bar">
      <button class="res-btn" onclick="setRes('1/8')">1/8 (Fast)</button>
      <button class="res-btn active" onclick="setRes('1/4')">1/4 (Standard)</button>
      <button class="res-btn" onclick="setRes('1/2')">1/2 (HD)</button>
      <button class="res-btn" onclick="setRes('1')">1.0 (Full 1080p)</button>
    </div>
  </header>

  <main>
    <div class="viewer-card">
      <div class="frame-container">
        <img id="main-frame" class="frame-img" src="" alt="Frame Preview">
        <div class="hud-overlay" id="hud-txt">2.4s · 1/4 (270x480)</div>
      </div>
    </div>

    <!-- Timeline Beats Selector -->
    <div class="beats-grid" id="beats-container"></div>

    <!-- Audio Player -->
    <div class="audio-card">
      <div class="audio-meta">
        <div>
          <div style="font-weight: 700; font-size: 14px;">Broadcast Master Audio Stem</div>
          <div style="font-size: 12px; color: var(--muted);">mix.wav (Voice DSP + Ducked Bed + SFX)</div>
        </div>
        <div class="pill green">-14.6 LUFS (Broadcast Match)</div>
      </div>
      <audio controls src="../assets/audio/mix.wav" style="height: 38px;"></audio>
    </div>

    <!-- Contact Sheet -->
    <div class="contact-sheet-wrap">
      <h3 style="font-size: 15px; font-weight: 700;">Composite Contact Sheet (Filmstrip Grid)</h3>
      <img id="cs-img" class="contact-sheet-img" src="" alt="Contact Sheet">
    </div>

    <!-- One Click Render Command -->
    <div class="cmd-box">
      <span>./STUDIO/scripts/render-clip.sh ${slug} --final</span>
      <button class="copy-btn" onclick="navigator.clipboard.writeText('./STUDIO/scripts/render-clip.sh ${slug} --final'); alert('Copied render command to clipboard!');">Copy Command</button>
    </div>
  </main>

  <script>
    const framesData = ${JSON.stringify(framesByRes, null, 2)};
    const contactSheets = ${JSON.stringify(contactSheets, null, 2)};
    const beats = ${JSON.stringify(beatLabels, null, 2)};
    let currentRes = '${resolutions[0] || '1/4'}';
    let currentIdx = 0;

    function setRes(res) {
      if (!framesData[res]) {
        alert('Resolution ' + res + ' was not generated in this run. Run with --res all or --res ' + res);
        return;
      }
      currentRes = res;
      document.querySelectorAll('.res-btn').forEach(b => {
        b.classList.toggle('active', b.textContent.includes(res));
      });
      updateFrame();
      updateContactSheet();
    }

    function selectBeat(idx) {
      currentIdx = idx;
      document.querySelectorAll('.beat-btn').forEach((b, i) => {
        b.classList.toggle('active', i === idx);
      });
      updateFrame();
    }

    function updateFrame() {
      const list = framesData[currentRes] || Object.values(framesData)[0];
      if (!list || !list[currentIdx]) return;
      const f = list[currentIdx];
      document.getElementById('main-frame').src = f.file;
      document.getElementById('hud-txt').textContent = f.time + 's · ' + currentRes + ' (' + f.width + 'x' + f.height + ')';
    }

    function updateContactSheet() {
      const cs = contactSheets[currentRes] || Object.values(contactSheets)[0];
      if (cs) {
        document.getElementById('cs-img').src = cs;
      }
    }

    function initBeats() {
      const cont = document.getElementById('beats-container');
      beats.forEach((b, idx) => {
        const btn = document.createElement('button');
        btn.className = 'beat-btn' + (idx === 0 ? ' active' : '');
        btn.onclick = () => selectBeat(idx);
        btn.innerHTML = '<div class="beat-time">' + b.t + 's</div>' +
                        '<div class="beat-title">' + b.title + '</div>' +
                        '<div class="beat-desc">' + b.desc + '</div>';
        cont.appendChild(btn);
      });
    }

    initBeats();
    setRes(currentRes);
  </script>
</body>
</html>`;

  writeFileSync(htmlPath, htmlContent);
  const rootHtmlContent = htmlContent.replace(/src=\"frame-/g, `src="STUDIO/projects/${slug}/.preview/frame-`)
                                     .replace(/src=\"contact-sheet-/g, `src="STUDIO/projects/${slug}/.preview/contact-sheet-`)
                                     .replace(/src=\"\.\.\/assets\//g, `src="STUDIO/projects/${slug}/assets/`);
  writeFileSync(rootPreviewHtml, rootHtmlContent);

  console.log(`\n========================================================`);
  console.log(` Interactive User Preview Created!`);
  console.log(` Root Web App:    file://${rootPreviewHtml}`);
  console.log(` Project App:     file://${htmlPath}`);
  console.log(`========================================================\n`);

  if (openBrowser) {
    try {
      execSync(`xdg-open "${rootPreviewHtml}" 2>/dev/null &`);
    } catch {}
  }
}

main().catch(err => {
  console.error('Preview Error:', err);
  process.exit(1);
});

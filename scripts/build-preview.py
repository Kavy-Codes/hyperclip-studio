#!/usr/bin/env python3
import os, sys, glob, json, subprocess

def run(cmd):
    return subprocess.run(cmd, shell=True, check=True, capture_output=True, text=True)

slug = sys.argv[1] if len(sys.argv) > 1 else "podcast-5"
root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
proj_dir = os.path.join(root, "STUDIO", "projects", slug)
preview_dir = os.path.join(proj_dir, ".preview")
os.makedirs(preview_dir, exist_ok=True)

# Find latest rendered MP4
renders = sorted(glob.glob(f"{proj_dir}/renders/*.mp4"), key=os.path.getmtime, reverse=True)
exports = sorted(glob.glob(f"{root}/STUDIO/exports/{slug}-*.mp4"), key=os.path.getmtime, reverse=True)
candidate = renders[0] if renders else (exports[0] if exports else None)

if not candidate:
    print(f"Error: No rendered video found for {slug}", file=sys.stderr)
    sys.exit(1)

print(f"Source video: {candidate}")

# 1. Generate multi-resolution video proxies
proxies = {
    "1": ("1080:1920", "video_1.mp4"),
    "1/2": ("540:960", "video_1_2.mp4"),
    "1/4": ("270:480", "video_1_4.mp4")
}

# Copy/link full res
master_dst = os.path.join(preview_dir, "video_1.mp4")
if os.path.exists(master_dst): os.remove(master_dst)
os.link(candidate, master_dst)

# Transcode 1/2 and 1/4
print("Generating video proxies...")
run(f"ffmpeg -y -i '{candidate}' -vf 'scale=540:960' -c:v libx264 -crf 22 -preset fast -c:a copy '{preview_dir}/video_1_2.mp4'")
run(f"ffmpeg -y -i '{candidate}' -vf 'scale=270:480' -c:v libx264 -crf 24 -preset fast -c:a copy '{preview_dir}/video_1_4.mp4'")

# 2. Extract multi-resolution frame snapshots
beats = [
    {"t": 2.4, "title": "Beat 1: Hook Intro", "desc": "CASH-OUT REFINANCE (Center Chest @ Y: 940px)"},
    {"t": 6.5, "title": "Beat 2: Rate Metric", "desc": "2.5% FIXED RATE (Mint Neon + Curve)"},
    {"t": 11.0, "title": "Beat 3: $25M Mansion", "desc": "$25M Rotoscoped Behind + ALL CASH"},
    {"t": 21.8, "title": "Beat 4: Climax Zero", "desc": "Crimson $0 Beside Head + ZERO DOLLARS"},
    {"t": 24.5, "title": "Beat 5: Reaction", "desc": "Graham Stephan Clean Reaction Shot"},
    {"t": 26.0, "title": "Beat 6: Outro Loop", "desc": "Complete Cliffhanger Question"}
]

res_scales = {
    "1": ("1080", "1920", "1"),
    "1/2": ("540", "960", "1-2"),
    "1/4": ("270", "480", "1-4"),
    "1/8": ("135", "240", "1-8")
}

frames_data = {}

for r_key, (w, h, tag) in res_scales.items():
    frames_data[r_key] = []
    for b in beats:
        t = b["t"]
        fname = f"frame-{t}s-{tag}.jpg"
        out_path = os.path.join(preview_dir, fname)
        run(f"ffmpeg -y -ss {t} -i '{candidate}' -vf 'scale={w}:{h}' -frames:v 1 -q:v 3 '{out_path}'")
        sz_kb = round(os.path.getsize(out_path) / 1024, 1)
        frames_data[r_key].append({
            "time": t,
            "title": b["title"],
            "desc": b["desc"],
            "width": int(w),
            "height": int(h),
            "res": r_key,
            "file": fname,
            "size": f"{sz_kb}K"
        })

# 3. Generate Contact Sheets
contact_sheets = {}
for r_key, (w, h, tag) in res_scales.items():
    cs_name = f"contact-sheet-{tag}.jpg"
    cs_path = os.path.join(preview_dir, cs_name)
    inputs = " ".join([f"-i '{preview_dir}/{f['file']}'" for f in frames_data[r_key]])
    n = len(frames_data[r_key])
    run(f"ffmpeg -y {inputs} -filter_complex 'hstack=inputs={n}' -q:v 3 '{cs_path}'")
    contact_sheets[r_key] = cs_name

print("Frame snapshots and contact sheets created.")

# 4. Generate Interactive Preview Web Apps
def build_html(base_url_prefix):
    # base_url_prefix is "" for .preview/index.html, and "STUDIO/projects/podcast-5/.preview/" for root preview.html
    audio_path = f"{base_url_prefix}../assets/audio/mix.wav" if base_url_prefix == "" else f"STUDIO/projects/{slug}/assets/audio/mix.wav"
    
    # Pre-render JSON with appropriate prefix
    client_frames = {}
    for r, flist in frames_data.items():
        client_frames[r] = []
        for f in flist:
            item = dict(f)
            item["src"] = base_url_prefix + f["file"]
            client_frames[r].append(item)
            
    client_cs = {}
    for r, cs in contact_sheets.items():
        client_cs[r] = base_url_prefix + cs
        
    client_videos = {
        "1/4": base_url_prefix + "video_1_4.mp4",
        "1/2": base_url_prefix + "video_1_2.mp4",
        "1": base_url_prefix + "video_1.mp4"
    }

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview: {slug} (Broadcast Master V3)</title>
  <style>
    :root {{
      --bg: #07090e;
      --panel: #0f131c;
      --panel-border: rgba(255, 255, 255, 0.08);
      --accent: #ffe600;
      --green: #00ff66;
      --red: #ff3b30;
      --blue: #3b82f6;
      --text: #f5f2ea;
      --muted: #8b949e;
    }}
    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body {{
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }}
    header {{
      background: var(--panel);
      border-bottom: 1px solid var(--panel-border);
      padding: 16px 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }}
    .brand {{
      display: flex;
      align-items: center;
      gap: 12px;
    }}
    .badge {{
      background: rgba(255, 230, 0, 0.15);
      color: var(--accent);
      border: 1px solid rgba(255, 230, 0, 0.3);
      font-weight: 800;
      font-size: 11px;
      padding: 4px 10px;
      border-radius: 4px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }}
    h1 {{ font-size: 18px; font-weight: 700; }}

    .mode-tabs {{
      display: flex;
      background: #090c12;
      border: 1px solid var(--panel-border);
      border-radius: 8px;
      padding: 4px;
      gap: 4px;
    }}
    .mode-btn {{
      background: transparent;
      border: none;
      color: var(--muted);
      font-size: 13px;
      font-weight: 600;
      padding: 6px 16px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.15s ease;
    }}
    .mode-btn.active {{
      background: var(--blue);
      color: #fff;
    }}

    .res-bar {{
      display: flex;
      background: #090c12;
      border: 1px solid var(--panel-border);
      border-radius: 8px;
      padding: 4px;
      gap: 4px;
    }}
    .res-btn {{
      background: transparent;
      border: none;
      color: var(--muted);
      font-size: 13px;
      font-weight: 600;
      padding: 6px 14px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.15s ease;
    }}
    .res-btn.active {{
      background: #232a3b;
      color: var(--accent);
      border: 1px solid rgba(255, 230, 0, 0.3);
    }}

    main {{
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 28px;
      gap: 24px;
      max-width: 1300px;
      margin: 0 auto;
      width: 100%;
    }}

    .theater-card {{
      background: var(--panel);
      border: 1px solid var(--panel-border);
      border-radius: 14px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: 0 12px 48px rgba(0, 0, 0, 0.6);
      width: 100%;
      max-width: 520px;
      position: relative;
    }}

    .screen-wrap {{
      width: 360px;
      height: 640px;
      background: #000;
      border-radius: 10px;
      overflow: hidden;
      position: relative;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
    }}

    video.main-player {{
      width: 100%;
      height: 100%;
      object-fit: contain;
      background: #000;
      display: block;
    }}

    img.frame-inspect {{
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: none;
    }}

    .hud-chip {{
      position: absolute;
      top: 12px;
      left: 12px;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(8px);
      padding: 5px 10px;
      border-radius: 6px;
      font-size: 11px;
      font-family: monospace;
      color: var(--accent);
      border: 1px solid rgba(255, 255, 255, 0.1);
      z-index: 5;
    }}

    /* Beat Jumpers */
    .beats-grid {{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 12px;
      width: 100%;
    }}
    .beat-card {{
      background: var(--panel);
      border: 1px solid var(--panel-border);
      border-radius: 10px;
      padding: 14px;
      text-align: left;
      cursor: pointer;
      color: var(--text);
      transition: all 0.15s ease;
    }}
    .beat-card:hover {{
      border-color: rgba(255, 255, 255, 0.25);
      transform: translateY(-2px);
    }}
    .beat-card.active {{
      border-color: var(--accent);
      background: #141a26;
      box-shadow: 0 0 20px rgba(255, 230, 0, 0.12);
    }}
    .beat-time {{
      font-size: 12px;
      font-family: monospace;
      font-weight: 700;
      color: var(--accent);
      margin-bottom: 4px;
    }}
    .beat-title {{
      font-size: 14px;
      font-weight: 700;
      margin-bottom: 4px;
    }}
    .beat-desc {{
      font-size: 12px;
      color: var(--muted);
      line-height: 1.35;
    }}

    /* Filmstrip Contact Sheet */
    .filmstrip-box {{
      width: 100%;
      background: var(--panel);
      border: 1px solid var(--panel-border);
      border-radius: 12px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }}
    .filmstrip-img {{
      width: 100%;
      border-radius: 8px;
      border: 1px solid var(--panel-border);
      display: block;
    }}

    /* Audio section */
    .audio-card {{
      width: 100%;
      background: var(--panel);
      border: 1px solid var(--panel-border);
      border-radius: 12px;
      padding: 18px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      flex-wrap: wrap;
    }}
    .audio-info {{
      display: flex;
      flex-direction: column;
      gap: 4px;
    }}
    .pill {{
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
    }}
    .pill.green {{ background: rgba(0, 255, 102, 0.15); color: var(--green); border: 1px solid rgba(0, 255, 102, 0.3); }}

    /* Render button bar */
    .action-bar {{
      width: 100%;
      background: #090c12;
      border: 1px solid var(--panel-border);
      padding: 14px 20px;
      border-radius: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: monospace;
      font-size: 13px;
      color: var(--accent);
    }}
    .action-btn {{
      background: #232a3b;
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #fff;
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }}
    .action-btn:hover {{ background: var(--blue); }}
  </style>
</head>
<body>
  <header>
    <div class="brand">
      <div class="badge">BROADCAST V3</div>
      <h1>Project Preview: <code>{slug}</code></h1>
    </div>

    <!-- Mode Selector -->
    <div class="mode-tabs">
      <button class="mode-btn active" id="btn-mode-video" onclick="setMode('video')">🎥 Video Player</button>
      <button class="mode-btn" id="btn-mode-frames" onclick="setMode('frames')">🔍 Frame Inspector</button>
    </div>

    <!-- Resolution Selector -->
    <div class="res-bar">
      <button class="res-btn active" id="res-1-4" onclick="setRes('1/4')">1/4 Draft (Fast)</button>
      <button class="res-btn" id="res-1-2" onclick="setRes('1/2')">1/2 HD (720p)</button>
      <button class="res-btn" id="res-1" onclick="setRes('1')">1.0 Full (1080p)</button>
    </div>
  </header>

  <main>
    <!-- Screen Box -->
    <div class="theater-card">
      <div class="screen-wrap">
        <video id="player" class="main-player" controls playsinline preload="auto">
          <source id="player-src" src="{client_videos['1/4']}" type="video/mp4">
        </video>
        <img id="inspector-img" class="frame-inspect" alt="Frame Inspection" src="{client_frames['1/4'][0]['src']}">
        <div class="hud-chip" id="hud-txt">Mode: Video · 1/4 Draft (270x480)</div>
      </div>
    </div>

    <!-- Timeline Beats Selector -->
    <div class="beats-grid" id="beats-wrap"></div>

    <!-- Audio Stem Card -->
    <div class="audio-card">
      <div class="audio-info">
        <div style="font-weight: 700; font-size: 15px;">Broadcast Master Stem: <code>mix.wav</code></div>
        <div style="font-size: 13px; color: var(--muted);">Clean Dialogue + Sidechain-Ducked Hip-Hop Bed + Real Studio Hits</div>
      </div>
      <div class="pill green">-14.0 LUFS · 0.0 True Peak</div>
      <audio controls src="{audio_path}" style="height: 38px;"></audio>
    </div>

    <!-- Contact Sheet -->
    <div class="filmstrip-box">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h3 style="font-size: 15px; font-weight: 700;">Filmstrip Contact Sheet (All 6 Beats)</h3>
        <span style="font-size: 12px; color: var(--muted);" id="cs-res-txt">Resolution: 1/4</span>
      </div>
      <img id="cs-img" class="filmstrip-img" src="{client_cs['1/4']}" alt="Filmstrip Contact Sheet">
    </div>

    <!-- Action Bar -->
    <div class="action-bar">
      <span>Render Broadcast Final: <code>./STUDIO/scripts/render-clip.sh {slug} --final</code></span>
      <button class="action-btn" onclick="navigator.clipboard.writeText('./STUDIO/scripts/render-clip.sh {slug} --final'); alert('Copied render command to clipboard!');">Copy Command</button>
    </div>
  </main>

  <script>
    const videos = {json.dumps(client_videos, indent=2)};
    const frames = {json.dumps(client_frames, indent=2)};
    const contactSheets = {json.dumps(client_cs, indent=2)};
    const beats = {json.dumps(beats, indent=2)};

    let currentMode = 'video';
    let currentRes = '1/4';
    let currentIdx = 0;

    const player = document.getElementById('player');
    const playerSrc = document.getElementById('player-src');
    const inspectImg = document.getElementById('inspector-img');
    const hudTxt = document.getElementById('hud-txt');
    const csImg = document.getElementById('cs-img');
    const csResTxt = document.getElementById('cs-res-txt');

    function setMode(mode) {{
      currentMode = mode;
      document.getElementById('btn-mode-video').classList.toggle('active', mode === 'video');
      document.getElementById('btn-mode-frames').classList.toggle('active', mode === 'frames');

      if (mode === 'video') {{
        player.style.display = 'block';
        inspectImg.style.display = 'none';
        hudTxt.textContent = 'Mode: Video · ' + currentRes;
      }} else {{
        player.style.display = 'none';
        player.pause();
        inspectImg.style.display = 'block';
        updateInspector();
      }}
    }}

    function setRes(res) {{
      currentRes = res;
      document.querySelectorAll('.res-btn').forEach(b => {{
        b.classList.toggle('active', b.id === 'res-' + res.replace('/', '-'));
      }});

      if (currentMode === 'video') {{
        const currTime = player.currentTime;
        const isPlaying = !player.paused;
        player.src = videos[res] || videos['1/4'];
        player.currentTime = currTime;
        if (isPlaying) player.play();
        hudTxt.textContent = 'Mode: Video · ' + res;
      }} else {{
        updateInspector();
      }}

      // Update contact sheet
      if (contactSheets[res]) {{
        csImg.src = contactSheets[res];
        csResTxt.textContent = 'Resolution: ' + res;
      }}
    }}

    function jumpToBeat(idx) {{
      currentIdx = idx;
      document.querySelectorAll('.beat-card').forEach((b, i) => {{
        b.classList.toggle('active', i === idx);
      }});

      const b = beats[idx];
      if (currentMode === 'video') {{
        player.currentTime = b.t;
        player.play();
      }} else {{
        updateInspector();
      }}
    }}

    function updateInspector() {{
      const list = frames[currentRes] || frames['1/4'];
      if (!list || !list[currentIdx]) return;
      const f = list[currentIdx];
      inspectImg.src = f.src;
      hudTxt.textContent = 'Frame: ' + f.time + 's · ' + currentRes + ' (' + f.width + 'x' + f.height + ')';
    }}

    function initBeats() {{
      const cont = document.getElementById('beats-wrap');
      beats.forEach((b, idx) => {{
        const card = document.createElement('div');
        card.className = 'beat-card' + (idx === 0 ? ' active' : '');
        card.onclick = () => jumpToBeat(idx);
        card.innerHTML = '<div class="beat-time">' + b.t.toFixed(1) + 's</div>' +
                         '<div class="beat-title">' + b.title + '</div>' +
                         '<div class="beat-desc">' + b.desc + '</div>';
        cont.appendChild(card);
      }});
    }}

    initBeats();
    setMode('video');
    setRes('1/4');
  </script>
</body>
</html>"""
    return html

# Write project-level index.html
with open(os.path.join(preview_dir, "index.html"), "w") as f:
    f.write(build_html(""))

# Write root-level preview.html
with open(os.path.join(root, "preview.html"), "w") as f:
    f.write(build_html(f"STUDIO/projects/{slug}/.preview/"))

print("Interactive Web Preview successfully generated!")

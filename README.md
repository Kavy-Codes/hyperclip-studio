# ⚡ HyperClip Studio

> **Code-First, Headless Video Editing Studio for AI & Human Creators**  
> Powered by [HyperFrames](https://hyperframes.com), [GSAP](https://gsap.com), [Whisper.cpp](https://github.com/ggerganov/whisper.cpp), and [FFmpeg](https://ffmpeg.org).

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![HyperFrames: 0.7.109](https://img.shields.io/badge/HyperFrames-0.7.109-emerald.svg)](https://hyperframes.com)
[![GSAP: 3.14.2](https://img.shields.io/badge/GSAP-3.14.2-green.svg)](https://gsap.com)
[![Whisper: Local ASR](https://img.shields.io/badge/Whisper-Local_ASR-purple.svg)](https://github.com/ggerganov/whisper.cpp)
[![Platform: Linux / macOS](https://img.shields.io/badge/Platform-Linux%20%7C%20macOS-orange.svg)]()

---

## 💡 What is HyperClip Studio?

HyperClip Studio replaces cumbersome traditional GUI video editing software (Premiere, DaVinci, CapCut) with a **declarative, code-first rendering engine**. Video timelines, animations, kinetic typography, dynamic cards, and audio beds are defined using standard **HTML5, CSS3, and GSAP**, then rendered frame-by-frame directly into broadcast-ready MP4 files.

Built from the ground up to pair seamlessly with **AI coding assistants** (Claude Code, Cursor, Codex, Gemini CLI) or standalone human developers.

---

## ✨ Features

- 🚀 **100% Code-Driven Editing**: Animate text, cameras, badges, charts, and b-roll using modern web technologies and GSAP timelines.
- ⚡ **AI-Native Preview & Live Studio**: Generate multi-frame contact sheets and fractional previews (`1/8`, `1/4`, `1/2`, `1`) in 3–5 seconds, plus an interactive live preview app (`./preview.sh`).
- 🔮 **Pure Optical Rotoscoping Engine**: Place 3D typography behind subjects' heads with 4-tier neon bloom (`./scripts/roto-text.sh`) with zero double-vision or decoder drift.
- 💬 **Creator Kinetic Captions**: High-retention word-by-word tracking with scale-bounce pop, intelligent keyword saliency scoring, and electric yellow / crimson highlights.
- 🎙️ **Local Whisper Speech Recognition**: Zero-cost, 100% private word-level transcription and automatic animated caption synchronization powered by local `whisper.cpp`.
- ✂️ **Automatic Silence Cutting**: Intelligently detects and cuts pauses and filler silence using FFmpeg `silencedetect`.
- 🔊 **Broadcast Audio Engine & Inferred Foley**: Automatically infer frame-exact SFX cues from transcripts and mix voice (-14.6 LUFS), sidechain-ducked music (-38 LUFS), and aligned SFX (-17 dBFS) via `./scripts/mix-sound.sh`.
- 🎨 **456+ Visual Component Registry**: Instant search and insertion of production-ready motion graphics, stat callouts, badges, and templates (`scripts/search-registry.sh`).
- 🛡️ **5-Stage QA Check Suite**: Comprehensive validation checks for lint errors, runtime exceptions, layout overflow, motion timing, and text contrast.
- 👤 **Subject Face Sanctuary Guarantee**: Built-in rules enforcing pristine chin and face headroom (`Y: 150px–850px` clean) across vertical edits.

---

## 🛠️ System Prerequisites

- **Node.js**: `>= 20.0.0`
- **FFmpeg & FFprobe**: `>= 5.0`
- **Git & CMake**: (Used by the installer to compile local Whisper ASR)
- **OS**: Linux (Ubuntu, Debian, Fedora, Arch) or macOS.

---

## 📦 Quick Installation (1-Step)

Clone the repository and run the automated installer:

```bash
git clone https://github.com/Kavy-Codes/hyperclip-studio.git
cd hyperclip-studio
./install.sh
```

The installer will automatically:
1. Verify system dependencies (`node`, `ffmpeg`, `cmake`, `git`).
2. Install pinned dependencies (`hyperframes: 0.7.109`, `gsap`, `playwright`).
3. Clone and compile `whisper.cpp` with the `base.en` speech model.
4. Run diagnostics (`./scripts/doctor.sh`) to verify full readiness.

---

## 🎬 Quickstart Tutorial

### 1. Fast-Path Automated Clipping
Drop your video into `INBOX/` or pass a file path:

```bash
# Ingest, transcribe, cut silences, and generate kinetic captions in one command:
./edit.sh "/path/to/interview.mp4" --format portrait
```

### 2. Verify with the AI Preview Engine
Instead of waiting 4+ minutes for a full video render, inspect key moments instantly:

```bash
# Capture contact sheet at 3s, 15s, and 24s at 1/4 resolution (~3 seconds):
./scripts/ai-preview.sh <slug> --at 3.0,15.0,24.0 --scale 1/4
```
Preview frames are saved to `projects/<slug>/.preview/contact-sheet-1-4.jpg`.

### 3. Add Motion Graphics & Cards
Search the registry and inject styled cards directly above captions:

```bash
# Search 456 visual components:
./scripts/search-registry.sh "badge"

# Add a style-library card:
./scripts/add-card.sh <slug> t2-lb-warning
```

### 4. Quality Check & Render Final Master
Run the verification suite and produce standard or draft quality MP4s:

```bash
# Run 5-stage preflight and lint verification:
./scripts/check-clip.sh <slug>

# Render high-quality vertical MP4:
./scripts/render-clip.sh <slug> --quality standard
```
The finished video will be saved to `exports/<slug>-<timestamp>.mp4`!

---

## 📁 Repository Architecture

```text
hyperclip-studio/
├── install.sh                  # One-step automated installer
├── edit.sh                     # Fast-path CLI: ./edit.sh "/path/to/video.mp4"
├── preview.sh & preview.html   # Instant multi-resolution studio preview engine
├── package.json                # Pinned HyperFrames (0.7.109), GSAP, Playwright
├── README.md                   # Complete documentation
├── AGENTS.md                   # Operating guide for AI pair programmers
├── LICENSE                     # MIT License
├── .gitignore & .gitattributes # Clean repository filters & line-ending normalization
├── scripts/                    # Studio CLI & Automation Tools:
│   ├── roto-text.sh & .py      # Pure optical rotoscoping (3D text behind subject)
│   ├── infer-cues.py           # Automated narrative Foley & punchline cue detection
│   ├── mix-sound.sh            # EBU R128 voice (-14.6 LUFS) & ducked music (-38 LUFS)
│   ├── ai-preview.sh & .mjs    # AI headless preview engine
│   ├── user-preview.mjs        # Proportional multi-resolution preview server
│   ├── make-captions.mjs & .sh # Creator Kinetic Captions with word-level pop
│   ├── import-footage.mjs & .sh# Ingestion with 1.0s GOPs & proxy generation
│   ├── new-edit.sh & quick-edit# Video intake & end-to-end pipeline managers
│   ├── check-clip.sh           # 5-stage validation check suite
│   ├── render-clip.sh          # Low-memory, single-worker renderer
│   ├── setup-asr.sh            # Local Whisper.cpp speech setup
│   ├── add-card.sh             # Inject style-library cards
│   ├── add-component.sh        # Inject HyperFrames UI components
│   ├── search-registry.sh      # Local 456-component search engine
│   └── doctor.sh               # System diagnostic tool
├── sfx/                        # Curated studio sound effects (whooshes, hits, risers)
├── components/                 # Reusable UI overlays & motion elements
├── templates/                  # Base portrait (v1, v2) & landscape project templates
├── recipes/                    # Motion graphics recipe definitions
├── registry.json & REGISTRY.md # 456-item official HyperFrames catalog index
├── vendor/herk-edit-kit/       # Style library, motion cards & templates
├── projects/demo/              # Zero-dependency sample project ready to render
├── INBOX/                      # Drop folder for raw footage
├── source/                     # Original footage archive
├── projects/                   # Active projects workspace
└── exports/                    # Render output directory
```

---

## 🤖 AI Agent Integration

HyperClip Studio is natively designed for autonomous AI agents (Codex, Claude Code, Cursor, Gemini CLI, OpenCode):

- **Headless Previews**: Agents can inspect visual alignment using `ai-preview.sh` and read contact sheets without needing a display server or manual browser clicking.
- **Three-Tier Safe Zones**: Built-in layout rules enforce face protection (`Y=150–850px`), lower-third graphic desks (`Y=960–1200px`), and caption zones (`Y=1340–1650px`).
- See [AGENTS.md](AGENTS.md) for full instructions and agent operational guidelines.

---

## 📄 License

MIT © 2026 [Kavy-Codes](https://github.com/Kavy-Codes). Free for personal, commercial, and open-source use.

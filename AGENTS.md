# HyperClip Studio — AI Operator & Agent Contract

This file provides operating rules for AI coding assistants (Claude Code, Cursor, Codex, Gemini CLI, OpenCode, Aider) working in this repository.

---

## 1. Core Operating Principles

HyperClip Studio is a **code-first, browser-rendered video editing studio** built on HyperFrames, GSAP, FFmpeg, and Whisper ASR. It renders high-retention short-form video directly from HTML/CSS/JS.

* **Fast-Path**: To ingest a new video:
  ```bash
  ./edit.sh "/path/to/video.mp4" --format portrait
  ```
  *(With no argument, it picks the newest video from `INBOX/`)*.
* **Non-Destructive**: Originals in `INBOX/` or `source/` are never overwritten. All working compositions live in `projects/<slug>/`.
* **Zero UI Overhead**: Never use heavy browser UIs or manual web clicking when iterating. Use the **AI-Native Preview Engine**:
  ```bash
  ./scripts/ai-preview.sh <slug> --at 3.0,15.5,24.0 --scale 1/4
  ```

---

## 2. Technical Invariants & Rules

1. **Pinned HyperFrames CLI (`0.7.109`)**:
   Always run through `npm` / `npx hyperframes` (which resolves `0.7.109`). Never install or run `@latest`.
2. **Three-Tier Safe Zones (1080x1920 Vertical)**:
   * **Tier 1 (Face Sanctuary: Y=150–850px)**: Kept 100% clear of graphic cards, badges, and stickers.
   * **Tier 2 (Graphic Desk: Y=960–1200px)**: Anchors all overlay cards, metric chips, and badges. Positioned directly above captions.
   * **Tier 3 (Caption Anchor: Y=1340–1650px)**: Reserved for word-level kinetic captions.
3. **GSAP Owns Transforms**:
   Do **NOT** set CSS `transform` on any element animated by a GSAP tween. Let GSAP manage transforms via `tl.fromTo()` or `tl.to()`.
4. **Root-Relative Asset Paths**:
   In sub-compositions (`compositions/overlays.html`, `compositions/captions.html`), all asset paths must be root-relative (`assets/...`, NOT `../assets/...`).
5. **Timeline Registration**:
   Ensure `data-composition-id`, `meta.json` `id`, and `window.__timelines[...]` keys match identically.
6. **Track Allocation (Collision-Free Audio & Video)**:
   * `Track 0`: Background grain / backdrop
   * `Track 1`: Source video footage
   * `Track 5`: Overlay graphics (`overlays.html`)
   * `Track 6`: Captions (`captions.html`)
   * `Track 8`: Primary dialogue (`source-audio`)
   * `Track 9`: Music bed
   * `Track 10`: SFX whooshes & hits
   * `Track 11`: SFX clicks & risers
   * `Track 12`: SFX impacts & sub-drops

---

## 3. Workflow CLI Cheatsheet

```bash
# System healthcheck
./scripts/doctor.sh

# Fast AI headless preview (returns contact sheet in ~3-5 seconds)
./scripts/ai-preview.sh <slug> --scale 1/4

# Inject a style-library card into overlays
./scripts/add-card.sh <slug> <card-slug>

# Search 456 visual components
./scripts/search-registry.sh <keyword>

# 5-stage validation (lint, runtime, layout, motion, contrast)
./scripts/check-clip.sh <slug>

# Production render (low memory mode, standard quality)
./scripts/render-clip.sh <slug> --quality standard
```

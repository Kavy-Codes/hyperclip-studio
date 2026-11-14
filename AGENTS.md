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
2. **Subject Face Sanctuary Guarantee (1080x1920 Vertical)**:
   * **Tier 1 (Face Sanctuary: Y=150–850px)**: Kept 100% clear of graphic cards, badges, and stickers. Never place headers or cards across chin, beard, or eyes.
   * **Tier 2 (Graphic Desk: Y=920–1200px)**: Anchors all overlay cards, metric chips, and badges. Positioned safely below chin.
   * **Tier 3 (Caption Anchor: bottom: 340px / Y=1520–1560px)**: Reserved for word-level kinetic captions to clear microphones.
3. **Pure Optical Rotoscoping (`./scripts/roto-text.sh <slug>`)**:
   Never place duplicate `<video>` or cutout overlay elements in the HTML DOM (causes asynchronous decoder drift and severe double vision). Use `./scripts/roto-text.sh` to bake pure optical occlusion (`visible = text * (1.0 - mask)`) directly into `working.mp4` with 4-tier cinematic neon bloom.
4. **Keyframe-Dense Ingestion Standard (`-g 30 -keyint_min 30`)**:
   Always enforce 1.0s GOP keyframe intervals on `working.mp4` and preview proxies to eliminate seek stalls in headless Chrome.
5. **Broadcast Audio Standards (`./scripts/mix-sound.sh <slug>`)**:
   Mix dialogue to `-14.6 LUFS`, music bed sidechain-ducked to `-38 LUFS` under voice, and SFX transients aligned at `-17 dBFS`. Use `infer-cues.py` for automated narrative Foley.
6. **Creator Kinetic Captions (`./scripts/make-captions.sh <slug>`)**:
   Uses Poppins Bold, uppercase, heavy stroke, and electric yellow (`#ffe600`) keyword highlights with active word scale pops (`back.out(2.5)`). Captions must remain continuous during speech; never gate with `hide: HIDE`.
7. **GSAP Owns Transforms**:
   Do **NOT** set CSS `transform` on any element animated by a GSAP tween. Let GSAP manage transforms via `tl.fromTo()` or `tl.to()`.
8. **Root-Relative Asset Paths**:
   In sub-compositions (`compositions/overlays.html`, `compositions/captions.html`), all asset paths must be root-relative (`assets/...`, NOT `../assets/...`).
9. **Timeline Registration**:
   Ensure `data-composition-id`, `meta.json` `id`, and `window.__timelines[...]` keys match identically.
10. **Track Allocation (Collision-Free Audio & Video)**:
    * `Track 0`: Background grain / backdrop
    * `Track 1`: Source video footage
    * `Track 5`: Overlay graphics (`overlays.html`)
    * `Track 6`: Captions (`captions.html`)
    * `Track 8`: Broadcast master audio stem (`mix.wav`)
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

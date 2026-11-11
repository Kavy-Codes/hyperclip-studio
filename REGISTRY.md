# HyperFrames Online Registry Catalog

Total visuals: **456 items** directly installable via `npx hyperframes add <name>`.
Source: [https://hyperframes.heygen.com/catalog](https://hyperframes.heygen.com/catalog) and official GitHub Registry.

## How to Install into Any Project

Run from the `STUDIO/` directory:
```bash
# Install a block or component directly into your project
npx hyperframes add <item-name> --dir projects/<project-slug> --no-clipboard

# Example: install AI Answer Rank
npx hyperframes add ai-answer-rank --dir projects/podcast-3 --no-clipboard
```

---

## Category Sitemap

- [3D & Vector Graphics (22)](#3d-vector-graphics)
- [Camera Moves & Optical Effects (11)](#camera-moves-optical-effects)
- [Carousels & Orbit Cards (22)](#carousels-orbit-cards)
- [Code & Developer Snippets (14)](#code-developer-snippets)
- [Cursors & UI Pointers (14)](#cursors-ui-pointers)
- [Data, Metrics & Charts (23)](#data-metrics-charts)
- [Motion, Badges & Reusable Blocks (195)](#motion-badges-reusable-blocks)
- [Scenes, App Showcases & Demos (20)](#scenes-app-showcases-demos)
- [Surfaces, Glass & Textures (21)](#surfaces-glass-textures)
- [Text, Captions & Typography (45)](#text-captions-typography)
- [Transitions & Wipes (69)](#transitions-wipes)

---

## 3D & Vector Graphics (22)

| Item Name (`add`) | Title | Duration / Canvas | Description | Key Variables |
|---|---|---|---|---|
| `ui-3d-reveal` | **3D UI Reveal** | 13s (1920x1080) | Perspective 3D reveal animation for UI elements | - |
| `app-showcase` | **App Showcase** | 5.5s (1920x1080) | Fitness app product showcase with three floating smartphone screens | - |
| `code-3d-extrude` | **Code 3D Extrude** | 8s (1920x1080) | Syntax-highlighted code on a lit, beveled 3D slab that rotates through real space and s... | - |
| `cosmic-orb` | **Cosmic Orb** | 10s (1920x1080) | An iridescent soap-bubble planet: a slowly spinning sphere of nebula bands, dust lanes ... | `hue`, `accent`, `spin` |
| `camera-dolly-zoom` | **Dolly Zoom (Vertigo Shot)** | 4s (1920x1080) | Camera tracks toward or away from the subject while the field of view changes the oppos... | `direction`, `strength`, `subjectDistance` |
| `gallery-tunnel` | **Gallery Tunnel** | 12s (1920x1080) | An infinite corridor of panels: a square tunnel receding to a vanishing point, its floo... | `images`, `imageMix`, `speed` |
| `goo` | **Goo** | 2s (1920x1080) | A glossy green liquid ball whose surface bulges and ripples like wet goo, centred on bl... | - |
| `ios26-liquid-glass` | **iOS 26 Liquid Glass Home Screen** | 15s (1920x1080) | 3D iPhone with a normal iOS 26 home screen, liquid glass app icons, shader wallpaper, d... | - |
| `vfx-iphone-device` | **iPhone & MacBook 3D Showcase** | 15s (1920x1080) | Real GLTF iPhone 15 Pro Max and MacBook Pro models with live HTML-in-Canvas screen cont... | - |
| `macos-tahoe-liquid-glass` | **macOS Tahoe Liquid Glass Desktop** | 15s (1920x1080) | 3D MacBook with a macOS Tahoe-style desktop, glass menu bar, Finder window, dock, and c... | - |
| `carousel-orbit-1` | **Orbit Carousel 1** | 6s (1920x1080) | Image cards on a spinning 3D Fibonacci sphere, billboarded to the camera, sized by came... | `image1`, `image2`, `image3` |
| `carousel-orbit-2` | **Orbit Carousel 2** | 6s (1920x1080) | Image cards on a spinning 3D Fibonacci sphere, billboarded to the camera, sized by came... | `image1`, `image2`, `image3` |
| `carousel-orbit-3` | **Orbit Carousel 3** | 6s (1920x1080) | Image cards on a spinning 3D Fibonacci sphere, billboarded to the camera, sized by came... | `image1`, `image2`, `image3` |
| `carousel-orbit-4` | **Orbit Carousel 4** | 6s (1920x1080) | Image cards on a spinning 3D Fibonacci sphere, billboarded to the camera, sized by came... | `image1`, `image2`, `image3` |
| `carousel-orbit-5` | **Orbit Carousel 5** | 6s (1920x1080) | Image cards on a spinning 3D Fibonacci sphere, billboarded to the camera, sized by came... | `image1`, `image2`, `image3` |
| `caption-parallax-layers` | **Parallax Layers** | - (1080x1080) | Behind-subject 3D text layering with vertical stretch effect | - |
| `three-orbiting-cards` | **Three Orbiting Cards** | - (1080x1080) | A Three.js-powered orbit scene driven by a paused GSAP timeline for deterministic renders. | - |
| `carousel-vision-1` | **Vision Carousel 1** | 6s (1920x1080) | A ring of large image cards tilted into a row under a 3D camera, each card turning towa... | `image1`, `image2`, `image3` |
| `carousel-vision-2` | **Vision Carousel 2** | 6s (1920x1080) | A ring of large image cards tilted into a row under a 3D camera, each card turning towa... | `image1`, `image2`, `image3` |
| `carousel-vision-3` | **Vision Carousel 3** | 6s (1920x1080) | A ring of large image cards tilted into a row under a 3D camera, each card turning towa... | `image1`, `image2`, `image3` |
| `carousel-vision-4` | **Vision Carousel 4** | 6s (1920x1080) | A ring of large image cards tilted into a row under a 3D camera, each card turning towa... | `image1`, `image2`, `image3` |
| `carousel-vision-5` | **Vision Carousel 5** | 6s (1920x1080) | A ring of large image cards tilted into a row under a 3D camera, each card turning towa... | `image1`, `image2`, `image3` |

## Camera Moves & Optical Effects (11)

| Item Name (`add`) | Title | Duration / Canvas | Description | Key Variables |
|---|---|---|---|---|
| `camcorder-hud` | **Camcorder HUD** | 4s (1920x1080) | Responsive REC, battery, editable date placeholder, and timeline-driven counter overlay... | - |
| `yt-camera-move` | **Camera Punch-In** | - (1080x1080) | Dynamic zoom, slide, and 3D tilt-pan helpers for any wrapper (video, include, card) wit... | - |
| `camera-rig-depth-stack` | **Camera Rig Depth Stack** | - (1080x1080) | A 3D camera-rig-style card stack with depth, parallax, and focus shift. | - |
| `camera-scan-gate` | **Camera Scan Gate** | - (1080x1080) | A camera and QR recognition moment with a viewfinder sweep, bracket lock, confirmation ... | `scanColor`, `targetLabel`, `sweepSpeed` |
| `camera-shake` | **Camera Shake** | - (1080x1080) | Procedural handheld, telephoto and rig camera shake for any wrapper: nine measured prof... | `shakeProfile`, `shakeIntensity`, `shakeFrequency` |
| `drift-hold` | **Drift Hold** | - (1080x1080) | A centered content card stays subtly alive through loop-exact rotation, scale breathing... | `text`, `intensity` |
| `filmed-screen` | **Filmed Screen** | - (1080x1080) | Your scene, filmed off a screen: perspective, depth of field that follows an element yo... | - |
| `focus-rack` | **Focus Rack** | - (1080x1080) | Focus shifts once between two cards at different apparent depths through synchronized b... | `label_a`, `label_b`, `accent` |
| `push-in` | **Push In** | - (1080x1080) | A centered headline gains focus through one slow, continuous camera push and a gentle f... | `text`, `intensity` |
| `scroll-camera-story` | **Scroll Camera Story** | - (1080x1080) | A compressed forced-scroll cinematic pass: a tall scene of slotted sections travels pas... | `sections`, `travel`, `cues` |
| `ui-focus-zoom` | **UI Focus Zoom** | - (1080x1080) | A full app surface establishes with one settle, then the camera zooms and pans to an an... | `anchor_x`, `anchor_y`, `zoom` |

## Carousels & Orbit Cards (22)

| Item Name (`add`) | Title | Duration / Canvas | Description | Key Variables |
|---|---|---|---|---|
| `carousel-circle-1` | **Circle Carousel 1** | 6s (1920x1080) | Image cards ride a circle with a size gradient by depth angle, sweeping in fast-slow-fa... | `image1`, `image2`, `image3` |
| `carousel-circle-2` | **Circle Carousel 2** | 6s (1920x1080) | Image cards ride a circle with a size gradient by depth angle, sweeping in fast-slow-fa... | `image1`, `image2`, `image3` |
| `carousel-circle-3` | **Circle Carousel 3** | 6s (1920x1080) | Image cards ride a circle with a size gradient by depth angle, sweeping in fast-slow-fa... | `image1`, `image2`, `image3` |
| `carousel-circle-4` | **Circle Carousel 4** | 6s (1920x1080) | Image cards ride a circle with a size gradient by depth angle, sweeping in fast-slow-fa... | `image1`, `image2`, `image3` |
| `carousel-circle-5` | **Circle Carousel 5** | 6s (1920x1080) | Image cards ride a circle with a size gradient by depth angle, sweeping in fast-slow-fa... | `image1`, `image2`, `image3` |
| `cuboid-carousel` | **Cuboid Carousel** | 6.67s (1920x1080) | A chain of bevelled cuboids rides a travelling wave as a content carousel. | - |
| `frost-sequence-camera-orbit` | **Frost Sequence Camera Orbit** | 22.5s (1920x1080) | An orbiting camera follows an ice logo as it breaks apart, reforms into two text moment... | - |
| `locked-nucleus-orbit` | **Locked Nucleus Orbit** | - (1080x1080) | A fixed center nucleus anchors deterministic satellite orbits that settle into a compos... | `label`, `accent`, `satellites` |
| `orbit-card` | **Orbit Card** | 10s (1920x1080) | A single feature card orbits a dot sphere on approved Blender camera motion. | - |
| `carousel-path-1` | **Path Carousel 1** | 6s (1920x1080) | Image cards ride an open bezier path (arc, V, diagonal, wave, S-curve) with depth scali... | `image1`, `image2`, `image3` |
| `carousel-path-2` | **Path Carousel 2** | 6s (1920x1080) | Image cards ride an open bezier path (arc, V, diagonal, wave, S-curve) with depth scali... | `image1`, `image2`, `image3` |
| `carousel-path-3` | **Path Carousel 3** | 6s (1920x1080) | Image cards ride an open bezier path (arc, V, diagonal, wave, S-curve) with depth scali... | `image1`, `image2`, `image3` |
| `carousel-path-4` | **Path Carousel 4** | 6s (1920x1080) | Image cards ride an open bezier path (arc, V, diagonal, wave, S-curve) with depth scali... | `image1`, `image2`, `image3` |
| `carousel-path-5` | **Path Carousel 5** | 6s (1920x1080) | Image cards ride an open bezier path (arc, V, diagonal, wave, S-curve) with depth scali... | `image1`, `image2`, `image3` |
| `screen-flow-carousel` | **Screen Flow Carousel** | - (1080x1080) | Two to five app screens ride a horizontal rail: one primary at center, neighbors recede... | `screens`, `captions`, `cues` |
| `share-sheet-carousel` | **Share-Sheet Carousel** | 7.2333s (1080x1920) | A share sheet springs up from the bottom of the phone and cycles previews inside its ca... | `shareTitle`, `senderName`, `itemLabel` |
| `spiral-galaxy` | **Spiral Galaxy** | 10s (1920x1080) | A spiral galaxy seen from outside, turning with real differential rotation: inner stars... | `stars`, `arms`, `rate` |
| `carousel-text-circle-1` | **Text + Circle Carousel 1** | 5s (1920x1080) | A headline mask-reveals word by word while a circle carousel converges from off-frame a... | `image1`, `image2`, `image3` |
| `carousel-text-circle-2` | **Text + Circle Carousel 2** | 5s (1920x1080) | A headline mask-reveals word by word while a circle carousel converges from off-frame a... | `image1`, `image2`, `image3` |
| `carousel-text-circle-3` | **Text + Circle Carousel 3** | 5s (1920x1080) | A headline mask-reveals word by word while a circle carousel converges from off-frame a... | `image1`, `image2`, `image3` |
| `carousel-text-circle-4` | **Text + Circle Carousel 4** | 5s (1920x1080) | A headline mask-reveals word by word while a circle carousel converges from off-frame a... | `image1`, `image2`, `image3` |
| `carousel-text-circle-5` | **Text + Circle Carousel 5** | 5s (1920x1080) | A headline mask-reveals word by word while a circle carousel converges from off-frame a... | `image1`, `image2`, `image3` |

## Code & Developer Snippets (14)

| Item Name (`add`) | Title | Duration / Canvas | Description | Key Variables |
|---|---|---|---|---|
| `code-diff` | **Code Diff** | 6s (1920x1080) | An edit shown as a colored diff — removed lines collapse in red, added lines expand in ... | - |
| `code-highlight` | **Code Highlight Sweep** | 5s (1920x1080) | A highlight band sweeps across a target line while the surrounding context dims — draws... | - |
| `code-morph` | **Code Morph** | 7s (1920x1080) | One snippet transforms into another — tokens glide between positions, leavers fade out,... | - |
| `code-particle-assemble` | **Code Particle Assemble** | 8s (1920x1080) | Thousands of GPU points scatter through space and fly to the exact glyph pixels of the ... | - |
| `code-scroll` | **Code Scroll To Line** | 6s (1920x1080) | The camera scrolls a long file to bring a target line to center and spotlights it — for... | - |
| `code-shader-dissolve` | **Code Shader Dissolve** | 7s (1920x1080) | The code compiles into existence: a GPU fragment shader resolves it out of seeded noise... | - |
| `code-slice-hero` | **Code Slice Hero** | 8s (1920x1080) | A tiled headline surface flips cell by cell under a sweeping depth field to reveal the ... | - |
| `code-snippet-apple-terminal-pro` | **Code Snippet - Apple Terminal Pro** | 12s (1920x1080) | Apple Terminal Pro profile: black background with grey text and lime green cursor, per-... | - |
| `code-snippet-dark-2026` | **Code Snippet - Dark 2026** | 11s (1920x1080) | VS Code workbench with per-character typing animation in the Dark 2026 theme. Full edit... | - |
| `code-snippet-dark-modern` | **Code Snippet - Dark Modern** | 11s (1920x1080) | VS Code workbench with per-character typing animation in the Dark Modern theme. Full ed... | - |
| `code-terminal-run` | **Code Terminal Run** | - (1080x1080) | A token-chrome terminal panel runs one command: the prompt line types deterministically... | `prompt_glyph`, `cadence`, `cues` |
| `code-typing` | **Code Typing** | 5s (1920x1080) | Token-streamed typing reveal with a caret that tracks the frontier — deterministic, no ... | - |
| `matrix-decode` | **Matrix Decode** | - (1080x1080) | Random scramble resolves left-to-right into the target text. | `text`, `accent`, `size` |
| `terminal-simulator` | **Terminal Simulator** | - (1080x1080) | A terminal window types commands and streams log output. | - |

## Cursors & UI Pointers (14)

| Item Name (`add`) | Title | Duration / Canvas | Description | Key Variables |
|---|---|---|---|---|
| `agent-cursor` | **Agent Cursor** | - (1080x1080) | An AI agent operating a UI: a cursor with an accent name label that types out each step... | `agent_name`, `steps`, `targets` |
| `cursor-annotate` | **Annotate Cursor** | - (1080x1080) | A marker pen glides onto the frame and hand-draws a loose loop, an underline, or an arr... | `shape`, `color`, `target_x` |
| `cursor-glyph-trail` | **Cursor Glyph Trail** | - (1080x1080) | A tutorial cursor path: on a settings screen the arrow clicks through three steps, leav... | `glyphs`, `density`, `path` |
| `dart-cursor` | **Dart Cursor** | - (1080x1080) | A bold outlined arrowhead that dives in from camera depth, flies nose-first with motion... | `tone`, `target_x`, `target_y` |
| `cursor-drag-drop` | **Drag and Drop Cursor** | - (1080x1080) | A cursor grabs a task card, lifts and tilts it into its motion, carries it in lockstep ... | `card_label`, `accent`, `tone` |
| `magnetic-cursor` | **Magnetic Cursor** | - (1080x1080) | A soft dot pointer glides across an editor toolbar, is pulled into each button and morp... | `accent`, `tone`, `visits` |
| `cursor-marquee-select` | **Marquee Select Cursor** | - (1080x1080) | A cursor drags a selection rectangle across a photo grid; each tile rings and pops a ch... | `accent`, `start_x`, `start_y` |
| `multiplayer-cursors` | **Multiplayer Cursors** | - (1080x1080) | Labeled collaborator cursors with token-derived colors and soft glows drift from spread... | `cursorCount`, `labels` |
| `oversized-cursor` | **Oversized Cursor** | - (1080x1080) | The look-here pointer for a video: the macOS arrow at 3.5x its normal size lands its ti... | `cursor_variant`, `target_x`, `target_y` |
| `yt-circle-pointer` | **Pointer Circle + Countdown** | - (1080x1080) | Draw-on annotation ellipse around a target plus a countdown chip that pulses each tick | - |
| `press-ripple` | **Press Ripple** | - (1080x1080) | A cursor decel-arrives from off-stage, lands slightly off-center on a caller-positioned... | `label`, `done_label`, `target_x` |
| `pull-to-refresh` | **Pull to Refresh** | - (1080x1080) | A mobile list pulls through nonlinear rubber-band resistance, arms at a threshold, comm... | `pullDistance`, `spinnerStyle` |
| `touch-indicator` | **Touch Indicator** | - (1080x1080) | A translucent contact-circle gesture actor for mobile UI scenes: it touches the glass o... | `gesture`, `polarity`, `targetX` |
| `cursor-zoom-follow` | **Zoom Follow Cursor** | - (1080x1080) | Screen-recording auto-zoom: the camera pushes in toward each upcoming click, trails the... | `image`, `zoom`, `click1_x` |

## Data, Metrics & Charts (23)

| Item Name (`add`) | Title | Duration / Canvas | Description | Key Variables |
|---|---|---|---|---|
| `animated-bar-chart` | **Animated Bar Chart** | - (1080x1080) | A compact data card with deterministic bar growth and value callouts. | - |
| `bar-chart-race` | **Bar Chart Race** | 12s (1920x1080) | Ranked bars grow and overtake each other as a time series advances, with the axis resca... | `title`, `subtitle`, `periods` |
| `chart-story` | **Chart Story** | - (1080x1080) | One chart builds from data in reading order and lands the exact supplied values: stagge... | `type`, `data`, `labels` |
| `conic-progress-ring` | **Conic Progress Ring** | - (1080x1080) | A token-driven conic progress ring whose angular fill and center count settle together ... | `progress`, `thickness`, `label` |
| `mk-progress-stat` | **Count-Up Stat Card** | 7s (1920x1080) | Big-numeral statistic with count-up, label, thin progress track filling to value/max, a... | - |
| `data-chart` | **Data Chart** | 15s (1920x1080) | Animated bar + line chart with staggered reveal, NYT-style typography, and value labels | - |
| `decline-chart` | **Decline Chart** | - (1080x1080) | A metric line draws downward as its value counts down and the ambient background darken... | `label`, `start_value`, `end_value` |
| `flowchart` | **Flowchart** | 12s (1920x1080) | Animated decision tree with SVG connectors, sticky-note nodes, cursor interaction, and ... | - |
| `flowchart-vertical` | **Flowchart Vertical** | 12s (1440x2560) | Portrait animated decision tree with SVG connectors, sticky-note nodes, cursor interact... | - |
| `logo-wall` | **Logo Wall** | - (1080x1080) | A trusted-by wall of placeholder lettermark logos that fades and scales into place with... | `rows`, `cols`, `stagger` |
| `mk-line-graph` | **Minimal Line Graph** | 7s (1920x1080) | One or two SVG series draw on with dots popping and value labels riding the draw front;... | - |
| `number-wheel` | **Number Wheel** | - (1080x1080) | A rolling digit counter primitive for metrics, prices, counts, and scoreboards | `spin`, `spacing`, `tone` |
| `oscilloscope-trace` | **Oscilloscope Trace** | 6s (1920x1080) | CRT oscilloscope beam sweeping a waveform across a 10x8 graticule, with closed-form pho... | `waveform`, `frequency`, `amplitude` |
| `pan-stations` | **Pan Stations** | - (1080x1080) | A lateral camera move across a continuous row of labeled feature stations, with a stead... | `stationCount`, `labels`, `dwell` |
| `spain-map` | **Spain Map** | 12s (1920x1080) | Animated Spain choropleth by autonomous community with staggered reveals and gradient l... | - |
| `star-rating-fill` | **Star Rating Fill** | - (1080x1080) | A token-driven star row whose colored layer sweeps to a rating, preserves the fractiona... | `rating`, `starCount`, `showValue` |
| `state-chip-rail` | **State Chip Rail** | - (1080x1080) | A rail of mono status chips advances a seek-safe data-state snap machine on a cue sched... | `states`, `times`, `badge_state` |
| `us-map-bubble` | **US Bubble Map** | 12s (1920x1080) | Animated US bubble map with proportional city markers, value callouts, and connection l... | - |
| `us-map-flow` | **US Flow Map** | 12s (1920x1080) | Animated connection arcs between US cities over a base map — composable origin-destinat... | - |
| `us-map-hex` | **US Hex Grid Map** | 10s (1920x1080) | Animated hexagonal tile grid map — each state as an equal-weight hex with data fill and... | - |
| `us-map` | **US Map** | 12s (1920x1080) | Animated US choropleth map with staggered state reveals, value labels, and gradient leg... | - |
| `week-in-merges` | **Week in Merges** | 16s (1080x1350) | Each author's avatar bounces across their row at a speed set by how many pull requests ... | `eyebrow`, `title`, `period` |
| `world-map` | **World Map** | 14s (1920x1080) | Animated world choropleth with country-by-country reveal, tooltip labels, and rotating ... | - |

## Motion, Badges & Reusable Blocks (195)

| Item Name (`add`) | Title | Duration / Canvas | Description | Key Variables |
|---|---|---|---|---|
| `arc-motion-path` | **Arc Motion Path** | - (1080x1080) | A GSAP MotionPath primitive that flies a callout along a curved arc with autorotation. | - |
| `aurora` | **Aurora** | 2s (1920x1080) | Green and violet aurora curtains ripple across a night sky. A WebGPU shader from the Sh... | - |
| `aurora-drift` | **Aurora Drift** | - (1080x1080) | Three soft accent-derived aurora fields drift in an exact ambient loop over a deep base... | `accent`, `mood` |
| `avatar-cloud` | **Avatar Cloud** | - (1080x1080) | Lettermark avatars populate a loose elliptical cloud while fine SVG links draw between ... | `avatarCount`, `showLinks`, `label` |
| `avatar-group-hover` | **Avatar Group Hover** | - (1080x1080) | A distance-falloff avatar group lift with bouncy hover return | `size`, `overlap`, `accent` |
| `mk-emphasis-type` | **Background Emphasis Type** | - (1080x1080) | Oversized low-contrast background word drifting slowly behind the subject — typography ... | - |
| `badge-pop` | **Badge Pop** | - (1080x1080) | A transitions.dev-inspired notification badge pop with elastic scale and count reveal | `count`, `accent`, `surface` |
| `beat-accent` | **Beat Accent** | - (1080x1080) | A single music-hit sting: impact flash, micro scale-pulse on the subject, immediate decay. | `text`, `flashColor`, `intensity` |
| `beat-pulse-background` | **Beat Pulse Background** | - (1080x1080) | An accent-derived backdrop pulses its glow intensity and saturation on a deterministic,... | `beats`, `accent`, `intensity` |
| `beat-timeline` | **Beat Timeline** | - (1080x1080) | A paused master-timeline orchestration spine that pins titled beat rows to evenly space... | `beatCount`, `interval`, `labels` |
| `blob` | **Blob** | 2s (1920x1080) | A soft coral and pink blob with a warm highlight slowly changes shape on black. A WebGP... | - |
| `blur-in` | **Blur In** | - (1080x1080) | An Operator Black word-level content reveal that resolves its own text from controlled ... | `size`, `tone`, `align` |
| `blur-out-up` | **Blur Out Up** | - (1080x1080) | Words arrive clean and depart upward with increasing blur for airy exits. | `direction`, `distance`, `blur` |
| `browser-device-stage` | **Browser Device Stage** | - (1080x1080) | A generic app surface in token-native device chrome (browser, window, or phone). The sc... | `chrome`, `title`, `swap_at` |
| `canopy-part-title` | **Canopy Part Title** | 12s (1920x1080) | Leaves sweep through the frame and part to reveal the headline. | - |
| `card-resize` | **Card Resize** | - (1080x1080) | A transitions.dev-inspired card resize primitive that expands a compact card into a det... | `surface`, `accent`, `elevation` |
| `caret-swap` | **Caret Swap** | - (1080x1080) | A gradient caret expands over one phrase, collapses to the left, then types its replace... | `from_text`, `to_text`, `font_size` |
| `char-slam-explode` | **Char Slam Explode** | - (1080x1080) | Headline glyphs hold in a deterministic scatter, then reassemble with an overshooting s... | `text`, `accent`, `spread` |
| `yt-prism-title` | **Chromatic Fringe Title** | 6s (1920x1080) | Display title on a transparent root: blur-focus entrance, red/blue fringe that settles ... | - |
| `chrome-orb` | **Chrome Orb** | 2s (1920x1080) | A mirror-chrome orb reflects a bright studio light, on black. A WebGPU shader from the ... | - |
| `cinemagraph` | **Cinemagraph** | 10s (1920x1080) | A still photograph with one living region: the frame is frozen while a single feathered... | - |
| `color-wheel` | **Color Wheel** | 2s (1920x1080) | A wide gradient slides slowly through the colours of the rainbow. A WebGPU shader from ... | - |
| `yt-comment-card` | **Comment Cards** | 8s (1920x1080) | Social comments typing on over footage: avatar pop, username and time, per-character ty... | - |
| `comparison-split` | **Comparison Split** | - (1080x1080) | Two full-bleed panels compare before and after states as a persistent divider wipes the... | `split`, `orientation`, `labelA` |
| `confetti` | **Confetti** | - (1080x1080) | A deterministic celebration burst with seeded particles and gravity. | - |
| `constellation-hub` | **Constellation Hub** | - (1080x1080) | Feature nodes brighten in narration order as real-length SVG connectors draw outward fr... | `hub_label`, `nodes`, `cues` |
| `count-up` | **Count Up** | - (1080x1080) | A token-native stat counter that eases between values, counting up or down, and lands w... | `start`, `end`, `prefix` |
| `cta-close` | **CTA Close** | - (1080x1080) | A display-scale action line lands per word and fills the frame with air, one generous C... | `action_line`, `button_label`, `accent` |
| `cta-lockup` | **CTA Lockup** | - (1080x1080) | A canonical closing lockup that reveals an action line, pops in an accent CTA capsule, ... | `action_line`, `button_label`, `microcopy` |
| `decision-tree` | **Decision Tree** | 10s (1920x1080) | Animated flowchart with branching paths | - |
| `device-frame-stage` | **Device Frame Stage** | - (1080x1080) | A phone or tablet mockup staged as a physical scene prop with a screen slot for arbitra... | `device`, `cutout`, `body` |
| `dynamic-grid` | **Dynamic Grid** | - (1080x1080) | A responsive animated grid background driven by CSS variables for SaaS, code, and data ... | `density`, `weight`, `tone` |
| `echo-smear` | **Echo Smear** | - (1080x1080) | Distance-adaptive streak — records each element's real trajectory (position, rotation, ... | - |
| `echo-trail` | **Echo Trail** | - (1080x1080) | A moving element renders with N ghosted copies of itself at t minus i times delta, opac... | `echoes`, `delta`, `path` |
| `exploded-stack` | **Exploded Stack** | 5s (1920x1080) | Isometric layer plates explode apart with a label beside each layer, hold, then collaps... | - |
| `facet-morph` | **Facet Morph** | - (1080x1080) | A faceted low-poly mass of 36 triangles continuously reshapes between three authored si... | `forms`, `hold_last`, `accent` |
| `yt-feather-highlight` | **Feathered Spotlight** | - (1080x1080) | Dims the frame except a feathered ellipse; the hole's position and size are CSS variabl... | - |
| `flowing-gradient` | **Flowing Gradient** | 2s (1920x1080) | Bands of orange and violet flow across the frame in a smooth gradient. A WebGPU shader ... | - |
| `focus-blur-resolve` | **Focus Blur Resolve** | - (1080x1080) | A premium focus pull from heavy blur to crisp text, then a soft blur-out exit. | `tone`, `size`, `blur` |
| `focus-swap` | **Focus Swap** | - (1080x1080) | Moves attention between two side-by-side cards as one recedes with scale, blur, and dim... | `focus`, `blurPx`, `dim` |
| `freeze-frame-dressing` | **Freeze-Frame Dressing** | 4s (1920x1080) | Timeline-driven paper, tape, and flash dressing for a freeze-frame or background-remove... | - |
| `frost` | **Frost** | 2s (1920x1080) | A frozen blue orb with frost creeping in from its edge, on black. A WebGPU shader from ... | - |
| `gesture-tap` | **Gesture Tap** | - (1080x1080) | A contact circle taps a mobile pill button, releases it into a new labeled accent state... | `tap_label`, `response_label`, `accent` |
| `gloss-sweep` | **Gloss Sweep** | - (1080x1080) | A card lands with a restrained slam, catches one diagonal specular gloss, and holds per... | `text`, `accent`, `sweep_angle` |
| `godrays` | **Godrays** | 2s (1920x1080) | Rays of light fan out from a corner and drift across a deep blue field. A WebGPU shader... | - |
| `gooey-split` | **Gooey Split** | 4.7s (1920x1080) | A dot splits into a three-dot menu with a gooey metaball neck, spins into a swirl mark ... | - |
| `grid-card-assemble` | **Grid Card Assemble** | - (1080x1080) | N capability cards (thin-line icon that draws on, mono label, optional muted body) stag... | `items`, `layout`, `columns` |
| `mk-usage-arc` | **Hairline Arc Gauge** | - (1080x1080) | Thin circular gauge that draws on while its percentage counts up; one helper call drive... | - |
| `hw-arrow` | **Hand-Drawn Arrow** | - (1080x1080) | Wobbled draw-on arrow with straight, gentle, and swoop curve poses, a four-way stroke t... | - |
| `hw-boil` | **Hand-Drawn Boil** | - (1080x1080) | Hand-drawn jitter that re-poses every N frames, as seek-safe helpers: pose derives from... | - |
| `hw-box-label` | **Hand-Drawn Box Label** | - (1080x1080) | Wobbled rounded rectangle draws on — across the authored stroke matrix (plain/soft/shar... | - |
| `hw-pipeline` | **Hand-Drawn Flowchart** | 7s (1920x1080) | Wobbled boxes with handwritten labels joined by curved connectors, drawing on in sequen... | - |
| `hw-title` | **Handwritten Title** | 6s (1920x1080) | Handwritten display text with a scalar-driven word-by-word highlight sweep and a seeded... | - |
| `hw-write-title` | **Handwritten Write-On Title** | 6s (1920x1080) | True glyph write-on: filled Caveat letterforms revealed by baked per-glyph centerline s... | - |
| `headline-slam` | **Headline Slam** | - (1080x1080) | A heavyweight headline scales down into frame, lands with a deterministic three-frame s... | `text`, `accent_word_index`, `accent` |
| `heatmap` | **Heatmap** | 2s (1920x1080) | Thermal colours flow through a glowing orb, on black. A WebGPU shader from the Shaders ... | - |
| `hologram` | **Hologram** | 2s (1920x1080) | A pale blue holographic orb with scan rings and flicker, on black. A WebGPU shader from... | - |
| `holographic` | **Holographic** | 2s (1920x1080) | An iridescent foil orb with a shifting rainbow sheen, centred on black. A WebGPU shader... | - |
| `icon-morph-beat` | **Icon Morph Beat** | - (1080x1080) | An icon morphs between authored state silhouettes, shifts to an accent color, and marks... | `pair`, `accent` |
| `icon-swap` | **Icon Swap** | - (1080x1080) | A scale-and-blur icon swap primitive for toolbar and action state changes | `tone`, `size`, `shape` |
| `instagram-follow` | **Instagram Follow** | 4.5s (1080x1920) | Animated Instagram follow overlay with profile card and follow button | - |
| `keyframe-scrub-stack` | **Keyframe Scrub Stack** | - (1080x1080) | A keyframe-sequenced stack of cards with offset timing and easing presets. | - |
| `kinetic-center-build` | **Kinetic Center Build** | - (1080x1080) | Words enter from the right and push the growing phrase left until the final line locks ... | `text`, `font_size`, `entry_offset` |
| `kinetic-type` | **Kinetic Type** | 15s (1920x1080) | Bold kinetic typography promo | - |
| `kinetic-type-swap` | **Kinetic Type Swap** | - (1080x1080) | A held sentence keeps its fixed text in place while one widest-word masked slot rolls t... | `prefix`, `options`, `suffix` |
| `lens-flare` | **Lens Flare** | 2s (1920x1080) | A camera lens flare: a bright star burst and a faint rainbow halo that slowly shimmer o... | - |
| `light-edge` | **Light Edge** | 2s (1920x1080) | Purple and cyan light races around the edge of an orb on black. A WebGPU shader from th... | - |
| `light-sweep-pass` | **Light Sweep Pass** | - (1080x1080) | A traveling key light re-shades a slotted scene: a soft diagonal gradient band crosses ... | `angle`, `sweep_at`, `strength` |
| `line-swap` | **Line Swap** | - (1080x1080) | A masked full-line beat replacement: line A holds center then exits up through an overf... | `line_a`, `line_b`, `swap_at` |
| `line-by-line-slide` | **Line-by-Line Slide** | - (1080x1080) | Each line enters from the left with staggered slide and exits to the right. | `size`, `tone`, `density` |
| `vfx-liquid-background` | **Liquid Background** | 12s (1920x1080) | Organic liquid simulation with vertex displacement on a subdivided plane. HTML content ... | - |
| `liquid-metal` | **Liquid Metal** | 2s (1920x1080) | A chrome sphere ripples and flows like molten metal on black. A WebGPU shader from the ... | - |
| `logo-brand-close` | **Logo Brand Close** | - (1080x1080) | A display-scale wordmark cascades letter by letter into a centered lockup, the accent b... | `wordmark`, `tagline`, `url` |
| `yt-logo-intro` | **Logo Intro Sequence** | 6s (1920x1080) | Logo stamp pops on a lined board, a kicker line gives way to the title with an accent a... | - |
| `logo-outro` | **Logo Outro** | 6s (1920x1080) | Cinematic logo reveal with piece-by-piece assembly, glow bloom, tagline fade-in, and UR... | - |
| `logo-sting` | **Logo Sting** | - (1080x1080) | A wordmark slams into its final scale, fires one accent ring and one white impact frame... | `wordmark`, `accent` |
| `lottie-character-walk` | **Lottie Character Walk** | 7.5s (1920x1080) | A jointed flat character walks in on planted feet, stops and points at a card; the body... | `title`, `body` |
| `lt-accent-underline` | **Lower Third — Accent Underline** | 4.8s (1920x1080) | Cardless lower third for footage overlay: name rises, an accent rule draws left-to-righ... | - |
| `lower-third-bild` | **Lower Third — BILD Style** | 8s (1920x1080) | News-style lower third with tight-fit text boxes: white headline bar with red drop-shad... | `TXT_MAIN_1_Line`, `TXT_SUB` |
| `lt-bold-block` | **Lower Third — Bold Block** | 4.8s (1920x1080) | High-energy podcast lower third: solid dark block wipes in, uppercase name slams up, ac... | - |
| `lt-clean-bar` | **Lower Third — Clean Bar** | 4.8s (1920x1080) | Minimal white-card lower third for podcasts/interviews: accent tab, name + role, clip-w... | - |
| `lt-color-block` | **Lower Third — Color Block** | 4.8s (1920x1080) | High-energy lower third: bold accent-color block slides in with overshoot, condensed na... | - |
| `lt-dark-card` | **Lower Third — Dark Card** | 4.8s (1920x1080) | Charcoal card lower third for bright footage: name, drawn accent underline, role; slide... | - |
| `lt-kicker-name` | **Lower Third — Kicker Name** | 4.8s (1920x1080) | Cardless lower third with an accent eyebrow/kicker tag, heavy name, and a drawn baselin... | - |
| `lt-side-rule` | **Lower Third — Side Rule** | 4.8s (1920x1080) | Cardless lower third with a vertical accent bar; condensed display name + mono role, te... | - |
| `lt-soft-pill` | **Lower Third — Soft Pill** | 4.8s (1920x1080) | Rounded white pill lower third for podcasts/interviews: status dot, name + role, scale-... | - |
| `lt-stack-bars` | **Lower Third — Stack Bars** | 4.8s (1920x1080) | Two stacked bars: a dark name bar wipes from the left, an accent role bar wipes from th... | - |
| `macos-notification` | **macOS Notification** | 5s (1920x1080) | Animated macOS-style notification banner with app icon and message | - |
| `vfx-magnetic` | **Magnetic** | 15s (1920x1080) | VFX composition block | - |
| `marker-checklist-card` | **Marker Checklist Card** | - (1080x1080) | A hand-lettered paper card: marker headline with an underline and a drawn ellipse aroun... | `top`, `mid`, `circled` |
| `marker-highlight` | **Marker Highlight** | - (1080x1080) | Display text settles in, then one hand-drawn marker stroke (highlight, circle, underlin... | `text`, `emphasis_word`, `style` |
| `menu-morph` | **Menu Morph** | - (1080x1080) | A transitions.dev-inspired hamburger and plus-menu morph primitive for compact action m... | `actions`, `tone`, `size` |
| `mesh-gradient` | **Mesh Gradient** | 2s (1920x1080) | Soft coral, orange and violet fields blend and drift in a mesh gradient. A WebGPU shade... | - |
| `mesh-gradient-bg` | **Mesh Gradient Background** | - (1080x1080) | A render-safe mesh gradient using animated radial layers. | - |
| `mk-background` | **Minimal Gradient Background** | 10s (1920x1080) | Procedural soft-blob gradient backdrop in a minimalist presentation style: two radial b... | - |
| `modal-morph` | **Modal Morph** | - (1080x1080) | A small card expands into a full panel, shared-element style: both layouts measured onc... | `from_scale`, `expand_at`, `register` |
| `motion-blur` | **Motion Blur** | - (1080x1080) | After Effects-style motion blur — integrates each element over a shutter window (shutte... | - |
| `multi-device-splay` | **Multi Device Splay** | - (1080x1080) | Phone, tablet, and desktop product mockups fan from a centered stack into a proud splay... | `accent` |
| `native-notification-pop` | **Native Notification Pop** | - (1080x1080) | One system-faithful notification banner (iOS or macOS) drops in over any scene on an ac... | `title`, `body`, `app_label` |
| `nebula` | **Nebula** | 2s (1920x1080) | A small world of pink and blue gas swirls inside a sphere on black. A WebGPU shader fro... | - |
| `lt-neon-border` | **Neon Border** | 4.8s (1920x1080) | Two arcs of light travel the edge of a rounded panel and snap corner to corner, trailin... | `name`, `role`, `accent` |
| `news-ticker` | **News Ticker** | 7s (1920x1080) | Premium broadcast-style lower-third ticker with live label, headline ribbon, and scroll... | - |
| `notification-pileup` | **Notification Pileup** | - (1080x1080) | Mobile notification cards arrive faster and faster, each new alert pushing the existing... | `count`, `speed`, `showBadges` |
| `notification-stack` | **Notification Stack** | - (1080x1080) | 1 to 5 token notification cards slide-settle into a vertical stack on cues, newest on t... | `titles`, `bodies`, `expand` |
| `number-pop-in` | **Number Pop In** | - (1080x1080) | A transitions.dev-inspired digit pop-in with blur, lift, and staggered value reveal | `value`, `unit`, `lift` |
| `nyt-graph` | **NYT Graph** | 15s (1920x1080) | Animated data chart in print editorial style | - |
| `offset-path-traveler` | **Offset Path Traveler** | - (1080x1080) | A slotted traveler follows an authored path with tangent rotation, curved entry, and cu... | `path`, `traveler_label`, `accent` |
| `onboarding-stepper-flow` | **Onboarding Stepper Flow** | - (1080x1080) | A composed onboarding flow with milestone rail, active step card, and next-action button | - |
| `outline-draw` | **Outline Draw** | - (1080x1080) | A rounded outline that proves a callout by drawing clockwise as a hollow conic-gradient... | `progress`, `thickness`, `radius` |
| `overwhelm-surround` | **Overwhelm Surround** | - (1080x1080) | Tasks, tabs, pings, and notification bubbles accelerate inward around a calm central su... | `count`, `centerLabel`, `intensity` |
| `page-slide` | **Page Slide** | - (1080x1080) | A transitions.dev-inspired page slide primitive with outgoing and incoming panels | `label_a`, `label_b`, `accent` |
| `pendulum-swing` | **Pendulum Swing** | - (1080x1080) | Content hangs from a fixed pivot and swings into rest with gravity-damped oscillation, ... | `pivot`, `amplitude`, `direction` |
| `perspective-marquee` | **Perspective Marquee** | - (1080x1080) | A 3D tilted marquee with depth feel as items roll toward the horizon. | `tilt`, `travel`, `tone` |
| `physical-exit` | **Physical Exit** | - (1080x1080) | A card exits with physical momentum in toss, drop, or slide mode, carrying acceleration... | `mode`, `text`, `accent` |
| `plastic` | **Plastic** | 2s (1920x1080) | A glossy white plastic orb with soft studio reflections, on black. A WebGPU shader from... | - |
| `play-mode` | **Play Mode** | 10s (1920x1080) | Playful elastic animations | - |
| `vfx-portal` | **Portal** | 10s (1920x1080) | VFX composition block | - |
| `prism` | **Prism** | 2s (1920x1080) | A white beam of light splits into a slowly turning rainbow. A WebGPU shader from the Sh... | - |
| `product-promo` | **Product Promo** | 20s (1920x1080) | Multi-scene product showcase with SVG assets | - |
| `product-turntable` | **Product Turntable** | 6s (1920x1080) | A product turns a full revolution on a studio plinth in a seamless loop. Drop in a GLB ... | - |
| `radial-surround` | **Radial Surround** | - (1080x1080) | Labeled hairline chips assemble around a centered subject on an elliptical ring, then o... | `center_label`, `chips`, `close_in` |
| `reddit-post` | **Reddit Post Card** | 5s (1920x1080) | Animated Reddit post card overlay with upvotes and comments | - |
| `mk-placeholder-grid` | **Rounded Media Grid** | 8s (1920x1080) | N-up rounded-corner media grid (2-up, 3-up, 4-up, 3x2, hero plus two): per-cell inside-... | - |
| `scan-band` | **Scan Band** | - (1080x1080) | A diagonal distortion band sweeps once across a clean wordmark, revealing clipped red a... | `wordmark`, `band_angle` |
| `hw-callout-circle` | **Scribble Callout Circle** | - (1080x1080) | Wobbled ellipse draws around a target with optional scribble fill and curved connector;... | - |
| `segmentation-flood` | **Segmentation Flood** | - (1080x1080) | Machine-vision read of a slotted subject: translucent accent segmentation masks flood o... | `regions`, `flood_at`, `flicker` |
| `separator` | **Separator** | - (1080x1080) | A one-pixel structural separator with horizontal and vertical variants plus a seek-safe... | `orientation`, `thickness`, `tone` |
| `settings-toggle-flow` | **Settings Toggle Flow** | - (1080x1080) | A composed settings flow with preference rows, toggle switches, and active-state feedback | - |
| `shared-axis-y` | **Shared Axis Y** | - (1080x1080) | Per-word vertical shared-axis transition for sharp editorial swaps. | `direction`, `distance`, `tone` |
| `shared-axis-z` | **Shared Axis Z** | - (1080x1080) | Scale-based shared-axis transition for focus shifts and context depth. | `direction`, `depth`, `tone` |
| `vfx-shatter` | **Shatter** | 12s (1920x1080) | VFX composition block | - |
| `shutter-slam` | **Shutter Slam** | - (1080x1080) | One word thrown through six single-property beats under integrated shutter blur — two t... | - |
| `signup-flow` | **Signup Flow** | - (1080x1080) | A composed signup flow with social action, email field, password field, and submit button | - |
| `sine-wave` | **Sine Wave** | 2s (1920x1080) | A glowing white sine wave travels across a black frame. A WebGPU shader from the Shader... | - |
| `hw-frame` | **Sketched Frame** | 8s (1920x1080) | Media in a hand-drawn border with corner doodles and a handwritten caption; the unit ti... | - |
| `slot-machine-roll` | **Slot Machine Roll** | - (1080x1080) | A vertical reel scrolls characters from one value to another. | `result`, `direction`, `size` |
| `snow` | **Snow** | 6s (1920x1080) | Seek-safe falling-snow overlay: sparse or dense flakes drift down with size, speed and ... | `density`, `speed` |
| `social-proof-card` | **Social Proof Card** | - (1080x1080) | The app-store close as one mountable scene: wordmark, five stars, a proof line, three f... | `brand`, `proof`, `cta` |
| `mk-specs-list` | **Specs Checklist** | 8s (1920x1080) | Left-aligned specs/traits checklist over footage or a board: rows slide in staggered wi... | - |
| `spiral` | **Spiral** | 2s (1920x1080) | A bold black and white spiral turns in the frame. A WebGPU shader from the Shaders libr... | - |
| `split-tilt-cards` | **Split Tilt Cards** | - (1080x1080) | Two equal-weight cards arrive from opposite wings with mirrored rotateY book-open tilts... | `label_a`, `label_b`, `badge_a` |
| `spotify-card` | **Spotify Now Playing** | 5s (1080x1920) | Animated Spotify now-playing card with album art and progress bar | - |
| `spotlight-card` | **Spotlight Card** | - (1080x1080) | A card with a scripted cursor spotlight and lit border. | - |
| `spring-pop` | **Spring Pop** | - (1080x1080) | A badge pops in from a visible near-rest scale, overshoots full size once, and settles ... | `overshoot`, `fromScale`, `text` |
| `spring-stack-shuffle` | **Spring Stack Shuffle** | - (1080x1080) | A stack of 3 to 5 slotted cards reshuffles on cues: the back card throws over the top a... | `cards`, `cues`, `accent` |
| `hw-underline` | **Squiggle Marks** | - (1080x1080) | Hand-drawn squiggle underline, double-pass strikethrough, and bracket marks that draw on | - |
| `stagger-cascade` | **Stagger Cascade** | - (1080x1080) | A responsive grid of tile cards that fades and travels into place with an evenly spaced... | `itemCount`, `stagger`, `direction` |
| `stagger-lattice` | **Stagger Lattice** | - (1080x1080) | A staggered grid reveal inspired by Anime.js v4 stagger utilities, implemented with GSA... | - |
| `staggered-fade-up` | **Staggered Fade Up** | - (1080x1080) | Words fade in and slide up one after another with configurable delay. | `direction`, `distance`, `tone` |
| `starfield` | **Starfield** | 6s (1920x1080) | Seek-safe night-sky overlay: sparse or dense stars in three size tiers that twinkle and... | `density`, `tone`, `speed` |
| `sticky-mock-swap` | **Sticky Mock Swap** | - (1080x1080) | A pinned product mock cross-fades through accent-tinted feature states while matching c... | `captions`, `accent` |
| `stop-motion-cadence` | **Stop Motion Cadence** | - (1080x1080) | The stepped-time law as a demo primitive: one driver quantizes timeline time to floor(t... | `fps`, `boil`, `accent` |
| `store-badge-lockup` | **Store Badge Lockup** | - (1080x1080) | Settles a short headline above equal-size App Store and Google Play badges as a token-d... | `headline`, `showApple`, `showGoogle` |
| `strands` | **Strands** | 2s (1920x1080) | Thin ribbons of pink and blue light weave across a black field. A WebGPU shader from th... | - |
| `strikethrough-replace` | **Strikethrough Replace** | - (1080x1080) | Draw a strike line across old text, then reveal the replacement. | `origin`, `thickness`, `tint` |
| `stripes` | **Stripes** | 2s (1920x1080) | Bold black and white diagonal stripes slide across the frame. A WebGPU shader from the ... | - |
| `success-check` | **Success Check** | - (1080x1080) | A success check primitive with ring pop, path draw, and subtle rotate blur | `tint`, `size`, `ring` |
| `sun-burst` | **Sun Burst** | 2s (1920x1080) | Cream and black rays fan out from the centre and slowly turn. A WebGPU shader from the ... | - |
| `svg-line-draw-loader` | **SVG Line Draw Loader** | - (1080x1080) | An Anime.js-style path drawing loader implemented as a seekable GSAP stroke timeline. | - |
| `svg-stroke-trace` | **SVG Stroke Trace** | - (1080x1080) | An authored SVG path draws from its measured length, holds with subtle drift, and optio... | `path`, `stroke_width`, `accent` |
| `swirl` | **Swirl** | 2s (1920x1080) | Orange and blue color fields swirl and flow into each other across the whole frame. A W... | - |
| `swiss-grid` | **Swiss Grid** | 10s (1920x1080) | Structured grid layout | - |
| `tabs-slide-indicator` | **Tabs Slide Indicator** | - (1080x1080) | A pill indicator transition that slides between active tabs | `accent`, `width`, `shape` |
| `telemetry-hud` | **Telemetry HUD** | - (1080x1080) | Quiet mono debug-HUD readouts frame a slotted subject: corner brackets draw on, label:v... | `readouts`, `emphasize`, `cues` |
| `testimonial-card` | **Testimonial Card** | - (1080x1080) | Reveals a customer quote at reading pace, then settles its avatar, author name, and han... | `quote`, `author`, `handle` |
| `testimonial-proof-card` | **Testimonial Proof Card** | - (1080x1080) | A quote card whose testimonial reveals per-line through a soft mask, with an avatar dis... | `quote`, `name`, `role` |
| `thin-film` | **Thin Film** | 2s (1920x1080) | An orb's rim shimmers with soap-bubble iridescence on black. A WebGPU shader from the S... | - |
| `thread-message-stack` | **Thread Message Stack** | 8s (1920x1080) | A source-owned editable conversation stack with arbitrary incoming and outgoing messages | - |
| `ticker-takeover` | **Ticker Takeover** | - (1080x1080) | A mono ticker rolls through options, locks on a final word with an accent flash, and pr... | `options`, `final_word`, `accent` |
| `tiktok-follow` | **TikTok Follow** | 4.5s (1080x1920) | Animated TikTok follow overlay with profile card and follow button | - |
| `tilt-card` | **Tilt Card** | - (1080x1080) | A transitions.dev-inspired tilt card primitive with depth layers and hover-style parallax | `eyebrow`, `headline`, `glow` |
| `titlecard-calm` | **Titlecard Calm** | - (1080x1080) | A restrained title card where a mono kicker and generous grotesque headline fade upward... | `headline`, `kicker` |
| `titlecard-lockup` | **Titlecard Lockup** | - (1080x1080) | The calm breather titlecard: an optional mono kicker fades up, the wordmark settles dea... | `wordmark`, `label`, `kicker` |
| `toggle-flip` | **Toggle Flip** | - (1080x1080) | An oversized UI toggle switch that flips with real physicality: thumb overshoot, track ... | `direction`, `label`, `size` |
| `top-down-letters` | **Top-Down Letters** | - (1080x1080) | Letters descend from above in a pronounced staircase with zero blur. | `text`, `distance`, `tone` |
| `tracing-beam` | **Tracing Beam** | - (1080x1080) | A glowing dash follows one SVG path through three UI elements, lifting and brightening ... | `labels`, `accent` |
| `trust-strip` | **Trust Strip** | - (1080x1080) | A monochrome trust row of wide-tracked mono wordmarks that fade in with an opacity-only... | `marks`, `tone`, `cues` |
| `typed-prompt` | **Typed Prompt** | - (1080x1080) | A prompt line types itself in chunked human cadence behind a deterministic blinking car... | `text`, `prompt_glyph`, `cadence` |
| `typewriter` | **Typewriter** | - (1080x1080) | Character-by-character text reveal with a deterministic blinking cursor. | `text`, `tone`, `caret` |
| `variable-axis-type` | **Variable Axis Type** | - (1080x1080) | A locked one-line headline whose weight or width axis morphs into a decisive emphasis b... | `text`, `axis`, `fromValue` |
| `vector-editor-rig` | **Vector Editor Rig** | - (1080x1080) | A dark design-tool app chrome with a live vector pen path, sequential anchor points, be... | `tool`, `pathLabel` |
| `velocity-throw-snap` | **Velocity Throw Snap** | - (1080x1080) | A five-shot rail whips past on a fast decaying curve, then overshoots and snaps the sel... | `hero_index`, `accent`, `card_label_prefix` |
| `yt-vertical-fill` | **Vertical Media Filler** | 8s (1920x1080) | Portrait media filling a widescreen frame via blurred-scale, mirror, or copy side fills... | - |
| `vignelli` | **Vignelli** | 10s (1080x1920) | Bold typography with red accents | - |
| `vignette` | **Vignette** | - (1080x1080) | Cinematic radial vignette overlay using a pure-CSS gradient — darkens the edges to pull... | - |
| `voronoi` | **Voronoi** | 2s (1920x1080) | Magenta cells with glowing blue centres shift and reshape across the frame. A WebGPU sh... | - |
| `vox-annotate` | **Vox Annotate** | - (1080x1080) | The Vox-style annotate gesture: a keyword in a held sentence gets a hand-drawn marker w... | `text`, `keyword`, `note` |
| `water` | **Water** | 2s (1920x1080) | A sphere of wind-rippled water reflecting a blue sky, on black. A WebGPU shader from th... | - |
| `waveform` | **Waveform** | 2s (1920x1080) | Equalizer bars in a blue to pink gradient pulse across the middle of the frame, like an... | - |
| `whiteboard-ink` | **Whiteboard Ink** | - (1080x1080) | A whiteboard sketch draws one measured stroke at a time while a pen nib follows the act... | `sketch`, `caption`, `pen` |
| `wireframe-portal-title` | **Wireframe Portal Title** | 8s (1920x1080) | A wireframe portal bursts open, the title comes through, then its letters swap into a s... | - |
| `mk-callout-highlight` | **Word-Sweep Highlight** | 8s (1920x1080) | A sentence whose word-by-word emphasis is driven by a single scalar — tween it to sync ... | - |
| `x-follow-card` | **X Follow Card** | - (1080x1080) | A social follow card with avatar, handle, and follower motion. | - |
| `x-post` | **X Post Card** | 5s (1920x1080) | Animated X/Twitter post card overlay with engagement metrics | - |
| `yt-lower-third` | **YouTube Lower Third** | 4.5s (1920x1080) | Animated YouTube subscribe lower third with avatar and channel info | - |

## Scenes, App Showcases & Demos (20)

| Item Name (`add`) | Title | Duration / Canvas | Description | Key Variables |
|---|---|---|---|---|
| `ai-answer-rank` | **AI Answer Rank** | 9s (1080x1080) | Is your brand in the AI answer? A question types into a chat card, the assistant answer... | `prompt`, `lead`, `rowA` |
| `vfx-anamorphic-flare` | **Anamorphic Streak Flare** | 10s (1920x1080) | A drifting field of bright points, each one throwing the long horizontal blue-violet st... | `intensity`, `threshold`, `streakLength` |
| `apple-money-count` | **Apple Money Count** | 5s (1920x1080) | Apple-style finance counter that counts from $0 to $10,000, flashes green, and bursts m... | - |
| `blue-sweater-intro-video` | **Blue Sweater Intro Video** | 12s (1920x1080) | Warm AI creator intro sequence that resolves into an X follow card for @_blue_sweater_. | - |
| `chat-message` | **Chat Message** | - (1080x1080) | One message arrives on the measured entry - scale 0.75, 0.12s, growing from its sender'... | `type`, `text`, `cardTitle` |
| `chat-thread` | **Chat Thread** | - (1080x1080) | The measured conversation as one mountable scene at full fidelity: status bar, back bad... | `contact`, `unread`, `messages` |
| `chatgpt-exchange` | **ChatGPT Exchange** | 14.9s (1080x1920) | A portrait ChatGPT-style exchange types and sends a prompt, streams an answer, assemble... | - |
| `claude-exchange` | **Claude Exchange** | 21.4s (1080x1920) | A portrait Claude-style exchange types a prompt, works through search and reasoning ste... | - |
| `heygen-avatar-promo-card` | **HeyGen Avatar Promo Card** | 10s (1080x1920) | A portrait HeyGen offer card pairs a moving avatar mosaic with bold promotional typogra... | - |
| `input-feedback` | **Input Feedback** | - (1080x1080) | A transitions.dev-inspired input feedback primitive with shake, clear affordance, and s... | `status`, `value`, `hint` |
| `north-korea-locked-down` | **North Korea Locked Down** | 7s (1920x1080) | Realistic map zoom into North Korea with a red scribble circle, locked-down pop-up labe... | - |
| `notes-typing` | **Notes Typing** | - (1080x1080) | The notes-app confession as a mountable scene: a bold title, then body lines typed char... | `title`, `lines`, `speed` |
| `notification-cascade` | **Notification Cascade** | 14s (1080x1920) | Phone notifications land one after another and stack up the screen, each banner pushing... | `notifTitle`, `message1`, `message2` |
| `nyc-paris-flight` | **NYC Paris Flight** | 6s (1920x1080) | Apple-style realistic map animation with a plane flying from New York to Paris, marker ... | - |
| `rack-focus` | **Rack Focus** | 6s (1920x1080) | A focus pull with real aperture bokeh: the focal plane travels from a near subject to a... | `nearfocus`, `farfocus`, `focallength` |
| `scroll-feed` | **Scroll Feed** | - (1080x1080) | A loop-friendly column of varied skeleton post cards scrolls upward with subtle motion ... | `speed`, `card_count`, `cues` |
| `sheet-spring-up` | **Sheet Spring-Up** | - (1080x1080) | A bottom sheet rushes up from below the frame on a real spring sampled frame by frame f... | `width`, `radius`, `tone` |
| `slack-notification-ad` | **Slack Notification Ad** | 12s (1080x1920) | A portrait lock screen fills with escalating Slack video requests before HeyGen deliver... | - |
| `typing-indicator` | **Typing Indicator** | - (1080x1080) | The three-dot chat bubble that says someone is writing: it pops in at the thread's edge... | `size`, `tone`, `tail` |
| `vpn-youtube-spot` | **VPN YouTube Spot** | 7s (1920x1080) | Snappy Apple-style YouTube insert showing a phone finding and installing a friendly VPN... | - |

## Surfaces, Glass & Textures (21)

| Item Name (`add`) | Title | Duration / Canvas | Description | Key Variables |
|---|---|---|---|---|
| `ascii-render-pass` | **ASCII Render Pass** | - (1080x1080) | A slotted scene renders as live ASCII: a canvas samples the source's luminance grid (ra... | `charset`, `grid`, `resolve_at` |
| `falling-lines` | **Falling Lines** | 2s (1920x1080) | White lines fall down the frame at varied speeds, each fading into a trail. A WebGPU sh... | - |
| `fractal-noise` | **Fractal Noise** | 2s (1920x1080) | Soft grey fractal noise drifts across the frame like slow clouds. A WebGPU shader from ... | - |
| `gabor-noise` | **Gabor Noise** | 2s (1920x1080) | Grey streaky noise drifts across the frame like a moving fingerprint. A WebGPU shader f... | - |
| `glass-hero` | **Glass Hero** | 5s (1920x1080) | A solid glass object rises in front of a giant headline and keeps turning, so the type ... | - |
| `glass-shard-title` | **Glass Shard Title** | 12.16s (1920x1080) | Glass shards fly in through fog and tile themselves into the headline. | - |
| `grain-field` | **Grain Field** | - (1080x1080) | A clearly visible accent-tinted dot field drifts over a subtle luminance gradient in an... | `density`, `accent` |
| `grain-overlay` | **Grain Overlay** | - (1080x1080) | Animated film grain texture overlay using CSS keyframes — adds warmth and analog charac... | - |
| `halftone-field` | **Halftone Field** | 10s (1920x1080) | A full-bleed halftone light field: a grid of dots whose size and colour track a slow fl... | `frequency`, `speed`, `cellSize` |
| `vfx-liquid-glass` | **Liquid Glass** | 20s (1920x1080) | VFX composition block | - |
| `liquid-glass-notification` | **Liquid Glass Notification** | 8s (1920x1080) | Frosted glass notification cards floating over an aurora shader background | - |
| `liquid-glass-widgets` | **Liquid Glass Widgets** | 8s (1920x1080) | Frosted glass stat cards, showcase panel and pill chips over an aurora shader background | - |
| `marble` | **Marble** | 2s (1920x1080) | Ink-dark veins wind through white in a marbled pattern that slowly shifts. A WebGPU sha... | - |
| `obsidian` | **Obsidian** | 2s (1920x1080) | A dark glass orb catches pink and cyan iridescent light on black. A WebGPU shader from ... | - |
| `yt-screen-warp` | **On-Screen Display Effect** | - (1080x1080) | Grid, scanline, vignette, and sheen overlay plus a 3D-warp wrapper class that makes foo... | - |
| `plasma` | **Plasma** | 2s (1920x1080) | Deep violet plasma folds and churns across the whole frame. A WebGPU shader from the Sh... | - |
| `ripples` | **Ripples** | 2s (1920x1080) | Concentric rings ripple outward from the centre, white on black. A WebGPU shader from t... | - |
| `yt-lcd-background` | **Scanline Board Background** | 10s (1920x1080) | Textured paper board: scanlines with slow drift, optional pixel grid, static grain, and... | - |
| `soft-blob-touch` | **Soft Blob Touch** | - (1080x1080) | A granular soft blob idles with slow internal drift; a scripted touch dot decel-arrives... | `touch_x`, `touch_y`, `touch_at` |
| `warm-grain` | **Warm Grain** | 10s (1920x1080) | Cream aesthetic with grain texture | - |
| `worley-noise` | **Worley Noise** | 2s (1920x1080) | A field of drifting cells, light at their centres and dark at their edges. A WebGPU sha... | - |

## Text, Captions & Typography (45)

| Item Name (`add`) | Title | Duration / Canvas | Description | Key Variables |
|---|---|---|---|---|
| `caption-blend-difference` | **Blend Difference** | - (1080x1080) | Auto-inverting text using mix-blend-mode: difference — flips between white and black pe... | - |
| `bottom-up-letters` | **Bottom Up Letters** | - (1080x1080) | Splits text into letters and reveals each glyph from below with deterministic staggered... | `unit`, `direction`, `travel` |
| `caption-camera-follow` | **Camera Follow Captions** | - (1080x1080) | One sentence written across a world far larger than the frame. Each word is sized again... | `accent`, `framing`, `smear` |
| `caption-clip-wipe` | **Clip Wipe** | - (1080x1080) | Left-to-right clip-path wipe reveal per word | - |
| `colorama-wipe` | **Colorama Wipe** | - (1080x1080) | Headline reveal through a feathered, leaning wipe front that is blurred and colour-mapp... | - |
| `cursor-context-menu` | **Context Menu Cursor** | - (1080x1080) | A cursor right-clicks a file, a context menu blooms from its tip, the hover highlight t... | `items`, `pick`, `tone` |
| `caption-editorial-emphasis` | **Editorial Emphasis** | - (1080x1080) | Dual-font system with dramatic size contrast for emphasis words | - |
| `caption-emoji-pop` | **Emoji Pop** | - (1080x1080) | Emoji integration with stroked text and horizontal squeeze entrance | - |
| `extended-keyframe` | **Extended Keyframe** | - (1080x1080) | The never-fully-lands arrival: an element covers most of its move in the first fifth of... | - |
| `extruded-logo` | **Extruded Logo** | 5s (1920x1080) | Beveled 3D letters flip up one by one, the word swings so light runs across the bevels,... | - |
| `caption-glitch-rgb` | **Glitch RGB** | - (1080x1080) | RGB chromatic aberration with CRT scanline overlay | - |
| `caption-gradient-fill` | **Gradient Fill** | - (1080x1080) | Gradient-clipped text with elastic bounce entrance | - |
| `caption-highlight` | **Highlight** | - (1080x1080) | Red background sweep behind each active word, TikTok-style | - |
| `inline-highlight` | **Inline Highlight** | - (1080x1080) | A clean marker-style inline highlight that animates behind text using a CSS scale variable | `tint`, `thickness`, `origin` |
| `caption-kinetic-slam` | **Kinetic Slam** | - (1080x1080) | Full-screen single-word display with alternating entrance directions | - |
| `caption-matrix-decode` | **Matrix Decode** | - (1080x1080) | Character scramble animation before text reveal | - |
| `morph-text` | **Morph Text** | - (1080x1080) | Gooey text morph — cycles through an editable word list using SVG threshold + GSAP-driv... | - |
| `caption-neon-accent` | **Neon Accent** | - (1080x1080) | Multi-color neon glow accents with wiggle drift animation | - |
| `caption-neon-glow` | **Neon Glow** | - (1080x1080) | Cyan and magenta neon glow with keyword accent colors | - |
| `caption-particle-burst` | **Particle Burst** | - (1080x1080) | Keyword words trigger colored particle explosions | - |
| `particle-text-dissolve` | **Particle Text Dissolve** | - (1080x1080) | Text assembles from a seeded particle cloud (or dissolves into it): per-particle target... | `text`, `direction`, `density` |
| `per-word-rise` | **Per Word Rise** | - (1080x1080) | Words or characters rise into place in a controlled blur-to-sharp cascade, settle softl... | `text`, `split`, `cues` |
| `per-word-crossfade` | **Per-Word Crossfade** | - (1080x1080) | Words gently fade into place with a short vertical drift for calm keynote rhythm. | `text`, `drift`, `blur` |
| `caption-pill-karaoke` | **Pill Karaoke** | - (1080x1080) | Pill-shaped container with per-word karaoke color highlight | - |
| `rgb-glitch-text` | **RGB Glitch Text** | - (1080x1080) | RGB-offset text copies jitter briefly for a controlled glitch window. | `text`, `intensity`, `tone` |
| `shimmer-sweep` | **Shimmer Sweep** | - (1080x1080) | Animated light sweep across text or elements using a CSS gradient mask — ideal for AI a... | - |
| `soft-blur-in` | **Soft Blur In** | - (1080x1080) | A soft opacity, blur, and lift reveal for headlines, captions, and product UI callouts | `distance`, `direction`, `blur` |
| `hw-text-cloud` | **Speech Bubble** | 6s (1920x1080) | Hand-drawn speech bubble with a positionable tail: outline draws on, paper fill fades i... | - |
| `split-flap-board` | **Split-Flap Board** | 3.5s (1920x1080) | Solari-style departure board: every cell walks its drum forward through the intervening... | `boardText`, `flapAlphabet`, `flipDuration` |
| `stitched-text-draw` | **Stitched Text Draw** | - (1080x1080) | Text drawn as thread stitches: a single-stroke display alphabet draws via attribute-dri... | `text`, `stitch`, `accent` |
| `streaming-text` | **Streaming Text** | - (1080x1080) | Words arrive the way an AI answer streams - in uneven bursts on a measured token rhythm... | `size`, `tone` |
| `hw-path-text` | **Text Along a Path** | 6s (1920x1080) | Handwriting flowing along any SVG path with a per-character reveal; the path is the onl... | - |
| `text-match-cut` | **Text Match Cut** | - (1080x1080) | One line of text becomes another mid-move: both ride a single 85 % easy-ease curve and ... | `text_a`, `text_b`, `mode` |
| `cursor-text-select` | **Text Select Cursor** | - (1080x1080) | An arrow turns into an I-beam over a document, drags a selection across a phrase charac... | `title`, `text`, `phrase` |
| `text-shimmer` | **Text Shimmer** | - (1080x1080) | A static headline receives one clean specular gradient sweep through its glyphs, then r... | `text`, `accent`, `sweep_at` |
| `text-stagger` | **Text Stagger** | - (1080x1080) | A transitions.dev-inspired text stagger primitive with enter, shimmer, and exit-ready w... | `text`, `size`, `tone` |
| `text-state-swap` | **Text State Swap** | - (1080x1080) | A text state swap primitive with outgoing blur and incoming lift | `from-text`, `to-text`, `distance` |
| `caption-texture` | **Texture** | - (1080x1080) | Flowing texture mask over large uppercase text — ships with 6 textures (lava, marble, m... | `texture` |
| `texture-mask-text` | **Texture Mask Text** | - (1080x1080) | CSS luminance masks that cut holes through letterforms - 66 pre-built texture masks fro... | - |
| `tracking-in` | **Tracking In** | - (1080x1080) | A precise letter-spacing reveal for premium headings and interface labels | `tracking`, `rise`, `tone` |
| `variable-font-flex` | **Variable Font Flex** | - (1080x1080) | A word lands while its variable-font weight and width axes flex from hairline-condensed... | `text`, `axis`, `stagger` |
| `vfx-text-cursor` | **VFX Text Cursor** | 8s (1920x1080) | Dramatic text reveal with cursor glow, chromatic shadow rays, and directional lighting ... | - |
| `caption-weight-shift` | **Weight Shift** | - (1080x1080) | Elegant font-weight transition between caption lines | - |
| `weight-wave` | **Weight Wave** | 6s (1920x1080) | A crest of thickness travels along a headline: each character swells from light to blac... | `text`, `color`, `background` |
| `wordmark-tiles` | **Wordmark Tiles** | - (1080x1080) | A wordmark resolves from deterministic color noise into correctly cropped glyph tiles t... | `text`, `columns`, `waveStagger` |

## Transitions & Wipes (69)

| Item Name (`add`) | Title | Duration / Canvas | Description | Key Variables |
|---|---|---|---|---|
| `transitions-3d` | **3D Transitions** | 11s (1920x1080) | Showcase of 3D perspective flip and rotate transitions | - |
| `ai-chat-reveal` | **AI Chat Reveal** | 19.3333s (1080x1920) | A question is typed on a rising keyboard, sent, and answered by an AI that streams its ... | `botName`, `userMessage`, `answer1` |
| `ascii-trail-reveal` | **ASCII Trail Reveal** | - (1080x1080) | An authored S-curve sweeps through a deterministic ASCII grid, flipping cells away to r... | `label`, `accent`, `trail_width` |
| `beat-freeze-cut` | **Beat Freeze Cut** | 6s (1920x1080) | A beat-driven speed ramp, freeze-frame hit, and hard-cut sequence for music-led promos ... | - |
| `before-after-wipe` | **Before After Wipe** | - (1080x1080) | Two full-bleed content slots compare before and after states as a persistent divider wi... | `label_a`, `label_b`, `rest_split` |
| `transitions-blur` | **Blur Transitions** | 20s (1920x1080) | Showcase of blur-based transitions between scenes | - |
| `chromatic-aberration-wipe` | **Chromatic Aberration Wipe** | - (1080x1080) | A fast slide wipe with RGB channel split on peak frames. | `direction`, `accent`, `aberration` |
| `chromatic-radial-split` | **Chromatic Radial Split** | 4s (1920x1080) | Shader transition with chromatic aberration radial split | - |
| `cinematic-zoom` | **Cinematic Zoom** | 4s (1920x1080) | Shader transition with dramatic zoom blur | - |
| `transitions-cover` | **Cover Transitions** | 21s (1920x1080) | Showcase of cover/uncover slide transitions | - |
| `cross-warp-morph` | **Cross Warp Morph** | 4s (1920x1080) | Shader transition with cross-warped morphing | - |
| `curtain-reveal` | **Curtain Reveal** | - (1080x1080) | Two pleated stage curtains gather outward from center, the way real velvet bunches at t... | `tone`, `pelmet`, `spotlight` |
| `cut-the-curve` | **Cut the Curve** | - (1080x1080) | A velocity-matched directional hard cut: the outgoing subject accelerates with power4.i... | `subject`, `direction`, `cutFraction` |
| `transitions-destruction` | **Destruction Transitions** | 14s (1920x1080) | Showcase of destructive break-apart transitions | - |
| `directional-wipe` | **Directional Wipe** | - (1080x1080) | A directional scene push that slides one panel over another. | `palette`, `corner` |
| `transitions-dissolve` | **Dissolve Transitions** | 24s (1920x1080) | Showcase of dissolve and fade transitions | - |
| `transitions-distortion` | **Distortion Transitions** | 21s (1920x1080) | Showcase of warp and distortion transitions | - |
| `domain-warp-dissolve` | **Domain Warp Dissolve** | 4s (1920x1080) | Shader transition with fractal noise domain warping | - |
| `editorial-flash-overlay` | **Editorial Flash Overlay** | 4s (1920x1080) | Finite neutral-warm light layers for a seek-safe camera-flash cut or social reveal | - |
| `fade-through` | **Fade Through** | - (1080x1080) | A calm transition primitive that fades one layer out, passes through a wash, and reveal... | `wash`, `strength`, `shape` |
| `flash-through-white` | **Flash Through White** | 4s (1920x1080) | Shader transition with white flash crossfade | - |
| `glitch` | **Glitch** | 4s (1920x1080) | Shader transition with digital glitch artifacts | - |
| `grade-split-reveal` | **Grade Split Reveal** | - (1080x1080) | The same picture twice, one flat and one finished, with a hard edge sweeping between th... | `look`, `split`, `edge` |
| `gravitational-lens` | **Gravitational Lens** | 4s (1920x1080) | Shader transition with gravitational lensing distortion | - |
| `grid-pixelate-wipe` | **Grid Pixelate Wipe** | - (1080x1080) | Transition effect where the screen dissolves into a grid of squares that fade out with ... | - |
| `transitions-grid` | **Grid Transitions** | 11s (1920x1080) | Showcase of grid-based tile transitions | - |
| `halftone-dissolve` | **Halftone Dissolve** | - (1080x1080) | Scene A dissolves into scene B through a growing halftone dot field: accent ink dots po... | `dot_size`, `direction`, `dissolve_at` |
| `ink-bleed-reveal` | **Ink Bleed Reveal** | - (1080x1080) | Liquid ink blooms through paper under a gooey blur-plus-threshold filter, merges, then ... | `blobs`, `accent`, `exit` |
| `iris-reveal` | **Iris Reveal** | - (1080x1080) | A circle clip-path opens from an authored origin revealing state B over state A in one ... | `iris_x`, `iris_y`, `open_at` |
| `light-leak` | **Light Leak** | 4s (1920x1080) | Shader transition with cinematic light leak overlay | - |
| `transitions-light` | **Light Transitions** | 21s (1920x1080) | Showcase of light-based glow and flash transitions | - |
| `lt-mask-reveal` | **Lower Third — Mask Reveal** | 4.8s (1920x1080) | Cardless lower third: an accent sweep crosses and clip-path-reveals a heavy name, role ... | - |
| `match-cut` | **Match Cut** | - (1080x1080) | A circle accelerates into a hard single-frame scene swap, matches the incoming circle e... | `accent`, `label_a`, `label_b` |
| `transitions-mechanical` | **Mechanical Transitions** | 15s (1920x1080) | Showcase of mechanical shutter and iris transitions | - |
| `message-thread-reveal` | **Message Thread Reveal** | 25.7667s (1080x1920) | A full text conversation plays out on a phone - bubbles popping in, typing indicators, ... | `contactName`, `questionMessage`, `teaserMessage` |
| `micro-transitions` | **Micro Transitions** | - (1080x1080) | A transitions.dev-inspired pack of badge, dropdown, modal, tabs, tooltip, and success-c... | `badge`, `tooltip`, `tone` |
| `morph-swap` | **Morph Swap** | - (1080x1080) | Two slotted siblings stacked at one shared center: A holds, then condenses or reshapes ... | `swap_at`, `register`, `accent` |
| `notes-reveal` | **Notes Reveal** | 24.85s (1080x1920) | A personal note is typed character by character in a notes app - caret riding every let... | `titleL1`, `titleL2`, `noteLine1` |
| `ordered-dither-pass` | **Ordered Dither Pass** | - (1080x1080) | Bayer-matrix ordered dithering quantizes a slotted scene (rasterized once at mount): th... | `matrix`, `direction`, `levels` |
| `organic-light-leak-overlay` | **Organic Light Leak Overlay** | 4s (1920x1080) | Finite CSS light-leak overlay for memory beats and motivated transitions | - |
| `transitions-other` | **Other Transitions** | 20s (1920x1080) | Showcase of miscellaneous creative transitions | - |
| `panel-reveal` | **Panel Reveal** | - (1080x1080) | A panel reveal primitive with height expansion and content fade | `title`, `width`, `tone` |
| `paper-collage-reveal` | **Paper Collage Reveal** | - (1080x1080) | A scrapbook patchwork of torn paper scraps, each with its own texture and tilt, flutter... | `panels`, `tone`, `spread` |
| `parallax-device-dive` | **Parallax Device Dive** | - (1080x1080) | A canonical phone rises into view before the camera pushes through its screen and layer... | `accent`, `app_title` |
| `parallax-unzoom` | **Parallax Unzoom** | - (1080x1080) | Reveal transition — focus card scales down from full frame as siblings parallax in to f... | - |
| `parallax-zoom` | **Parallax Zoom** | - (1080x1080) | Center card scales up to fill the frame while siblings parallax outward — inspired by t... | - |
| `particle-image-reveal` | **Particle Image Reveal** | - (1080x1080) | A seeded deterministic particle field converges and settles while a slotted image revea... | `density`, `direction`, `accent` |
| `pull-back-reveal` | **Pull Back Reveal** | - (1080x1080) | A tight stat detail holds, then one decelerating camera pull-back reveals the headline ... | `detail_text`, `headline`, `accent` |
| `transitions-push` | **Push Transitions** | 24s (1920x1080) | Showcase of push and slide transitions | - |
| `transitions-radial` | **Radial Transitions** | 20s (1920x1080) | Showcase of radial wipe and reveal transitions | - |
| `ridged-burn` | **Ridged Burn** | 4s (1920x1080) | Shader transition with ridged turbulence burn effect | - |
| `ripple-waves` | **Ripple Waves** | 4s (1920x1080) | Shader transition with concentric ripple wave distortion | - |
| `rubber-band-bumper` | **Rubber Band Bumper** | - (1080x1080) | An outgoing panel pulls against increasing resistance, holds at tension, then snaps pas... | `direction`, `accent` |
| `transitions-scale` | **Scale Transitions** | 15s (1920x1080) | Showcase of scale and zoom transitions | - |
| `scramble-reveal` | **Scramble Reveal** | - (1080x1080) | A deterministic hacker-style text reveal that cycles fixed glyph rows and locks the tar... | `text`, `accent`, `style` |
| `hw-scribble-transition` | **Scribble Transition** | 2.2s (1920x1080) | Overlay transition: scribble bands accumulate to cover the frame with a solid backstop,... | - |
| `sdf-iris` | **SDF Iris** | 4s (1920x1080) | Shader transition with signed distance field iris reveal | - |
| `skeleton-reveal` | **Skeleton Reveal** | - (1080x1080) | A skeleton loader transition that pulses, then cross-fades into content | `name`, `detail`, `tone` |
| `slit-scan-reveal` | **Slit Scan Reveal** | - (1080x1080) | The frame's rows sample an authored subject at offset times: a canvas painter draws row... | `axis`, `spread`, `resolve_at` |
| `svg-mask-reveal` | **SVG Mask Reveal** | - (1080x1080) | A soft token-colored sweep reveals media only through an editable SVG wordmark mask. | `text`, `revealProgress`, `featherPx` |
| `swipe-rail` | **Swipe Rail** | - (1080x1080) | A contact circle leads a horizontal card rail through a fast drag, momentum carry, and ... | `card_count`, `accent`, `card_label_prefix` |
| `swirl-vortex` | **Swirl Vortex** | 4s (1920x1080) | Shader transition with swirling vortex distortion | - |
| `mk-clone-wall-transition` | **Text Clone Wall Transition** | 2.4s (1920x1080) | Overlay transition: a tiled word wall covers the frame, inverts via difference blending... | - |
| `thermal-distortion` | **Thermal Distortion** | 4s (1920x1080) | Shader transition with heat haze thermal distortion | - |
| `torn-paper-rip` | **Torn Paper Rip** | - (1080x1080) | A fibrous paper tear runs across the frame: the torn sheet shows its white paper core a... | `direction`, `tone`, `roughness` |
| `type-match-cut` | **Type Match Cut** | - (1080x1080) | A headline splits vertically around an incoming panel, which grows from the negative sp... | `text`, `accent` |
| `whip-pan` | **Whip Pan** | 4s (1920x1080) | Shader transition simulating a fast camera whip pan | - |
| `whip-pan-cut` | **Whip Pan Cut** | - (1080x1080) | A full-frame whip pan: scene A whips off laterally with capped directional motion blur ... | `direction`, `whip_at`, `accent` |
| `zoom-through-transition` | **Zoom Through Transition** | - (1080x1080) | A transition that zooms through a focal card into the next scene. | `from-label`, `to-label`, `depth` |


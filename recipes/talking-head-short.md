# Talking-head Short

Use when the source is a person speaking to camera and the clip needs a clear
hook, one payoff and a clean CTA.

## Read

- `vendor/herk-edit-kit/.agents/skills/short-form-edit/SKILL.md`
- `vendor/herk-edit-kit/docs/EDITING-PLAYBOOK.md`
- `vendor/herk-edit-kit/MOTION_PHILOSOPHY.md`

## Build

1. Probe the source; ensure dense 1s GOP keyframes (`-g 30 -keyint_min 30`) to avoid Chrome seek stalls (`D-010`). Copy to `STUDIO/source/` and reference it from the project.
2. Transcribe using `node STUDIO/scripts/transcribe-clip.mjs <slug>`. Keep the transcript and source-to-cut mapping.
3. Cut silences and reviewed mistakes. Render the clean audio cut first.
4. Normalize speech to EBU R128 (-16 LUFS) and prepare ducked music bed + procedural SFX (`D-013`).
5. If raw domestic footage has uncurated lighting/backgrounds, run the Fast MediaPipe edge-blurred subject matte pipeline (360x640 inference, `(15,15)` blur) to composite the speaker onto a styled `#0A0E17` virtual set (`D-012`).
6. Choose **three beats**: hook, evidence/payoff, CTA. Do not add a fourth idea.
7. Create a portrait project:
   `STUDIO/scripts/new-clip.sh <slug> --channel <name> --duration <n>`
8. Wire layers according to the **standard 12-track plan** (`D-008`):
   - Track 0: background (`ambient-bg` or virtual studio canvas)
   - Track 1: footage / presenter video layer
   - Track 2: content / graphic overlays
   - Track 5: style-library cards (`add-card.sh ... --portrait`)
   - Track 6: captions (`kinetic-captions` component)
   - Track 7: components (`hook`, `payoff`, `cta`)
   - Track 8: source dialogue (normalized)
   - Track 9: music bed (ducked to 0.02–0.06 under voice)
   - Track 10: procedural SFX hits
9. Adhere to the **Three-Tier Y-Axis Hierarchy** (`D-011`):
   - Tier 1: Face Sanctuary (Y=150–850px) — keep free of cards and badges.
   - Tier 2: Golden Graphic Desk (Y=980–1250px) — mount overlay cards here to avoid chin collisions during 1.2x punch-ins.
   - Tier 3: Caption Anchor (Y=1320–1460px) — Poppins 900 kinetic captions, clearing bottom mobile UI (>1650px).
10. `check-clip.sh` → draft render → extract frames → review → final render.

## Timing & Styling

- Hook: 0.0–0.3s first entrance; by 3.0s the viewer knows the premise and promise.
- Payoff: at least 1.0s hold, ideally 1.5s.
- Ending: cut to punchline resolution with 0.3s–0.5s audio tail; never cut on a mid-reaction question (`D-014`).
- Captions: Poppins Black 900, all-caps, 74px, 10px black stroke, drop shadow, neon highlight tags (`#39FF14`, `#FFE600`, `#FF3366`).
- Audio: dialogue -16 LUFS, background music 0.06 (ducked to 0.02 under speech, swelling to 0.14+ on payoff hits).

## Avoid

- Overlays between Y=150px and Y=850px that block speaker faces.
- Floating cards at Y=900px that collide with chins during camera punch-ins.
- Sparse source video keyframes that freeze Chromium during rendering.
- Ending the clip abruptly on an unresolved reaction or question.
- Loud background music that drowns out spoken dialogue.
- Cutting every natural breath; keep rhythm around sentence boundaries.

# Verify — {{SLUG}}

Run this after the draft render and again before the final render.

## Automated

- [ ] `npx hyperframes lint` — 0 errors
- [ ] `npx hyperframes render --quality draft --low-memory-mode -w 1`
- [ ] `ffprobe` confirms duration, resolution, fps and audio
- [ ] No black frames at the start or end

## Human review
 
 - [ ] First frame works muted
 - [ ] First three seconds give a reason to stay
 - [ ] Hook is truthful to the source
 - [ ] Payoff is earned and visible
 - [ ] Subject Face Sanctuary verified (Y: 150px–850px face/chin/eyes 100% clean of overlay graphics)
 - [ ] Pre-built registry blocks or cards sourced via `find-visual.sh` (no raw AI-slop web boxes)
 - [ ] Frame review verified via `./STUDIO/scripts/ai-preview.sh <slug>` before full render
 - [ ] Captions match the spoken words and appear on time (Poppins Bold creator style)
 - [ ] Text is inside the phone-safe zone
 - [ ] Cuts preserve natural breath and emphasis
 - [ ] Music/SFX do not bury speech
 - [ ] Rights and provenance recorded in `BRIEF.md`
 - [ ] No upload or publish without explicit approval

## Result

- **Draft path:** UNKNOWN
- **Final path:** UNKNOWN
- **Known limitations:** UNKNOWN
- **Reviewed by:** UNKNOWN
- **Date:** {{DATE}}

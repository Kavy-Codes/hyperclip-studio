# Design — {{SLUG}}

## Direction

A dark, quiet canvas with one warm-white idea and pale green progress. The
composition is built for a phone first: large type, one attention target per
beat, and a payoff that can be understood with sound off.

- Canvas: 1080x1920, 30fps.
- Safe zone: x=90..930, y=200..1600. Keep captions and key text out of the
  right edge and bottom 320px where social UI sits.
- Palette: `#080c12` background, `#f4f1ea` primary text, `#ffe600` keyword accent,
  `#b9c2bd` secondary text.
- Type: Poppins Bold / Inter Tight for display & captions; JetBrains Mono for data/numbers only when justified. No wobbly italic serif fonts like Instrument Serif Italic in captions.
- Motion: one purposeful reveal per beat. No flashing, no constant idle motion.
- Face Sanctuary: Y: 150px–850px is sacred. Never place overlay text or graphic cards across the speaker's eyes, nose, mouth, chin, or beard. Anchor body cards and beats at Y >= 920px. Captions anchored at Y >= 1520px–1560px (bottom: 340px) to clear foreground microphones and bottom platform UI.

## Visual Asset Sourcing

Before hand-crafting raw HTML divs or web-like cards, search the registry:
`./STUDIO/scripts/find-visual.sh "<concept>"`
- HyperFrames Registry: 456 visual blocks (`REGISTRY.md`)
- Herk Style Library: 406 cards (`CATALOG.md`)
- Studio Components: 8 reusable blocks (`COMPONENTS.md`)

## Beats

| Time | Beat | Visual Sourced (Registry/Card) | Spoken anchor |
|---|---|---|---|
| 0.0–2.0 | Hook | E.g. registry block or styled kicker + headline | UNKNOWN |
| 2.0–5.0 | Context | Sub-line / card | UNKNOWN |
| 5.0–10.0 | Payoff | Evidence card / comparison | UNKNOWN |
| 10.0–13.0 | Caption | Exact spoken words (Poppins Bold) | UNKNOWN |
| 13.0–{{DURATION}} | Hold / CTA | Footer / minimal signoff | UNKNOWN |

## Checks

- Subject Face Sanctuary: Y: 150px–850px completely clear of overlay graphics.
- First frame is meaningful without context.
- Pre-built registry blocks or cards sourced via `find-visual.sh` before coding custom HTML.
- Text stays inside the safe zone at phone size.
- Captions use Poppins Bold uppercase with dark outline and pop on spoken timing.
- Caption wording matches the speaker exactly.
- No third restatement of the same idea.
- Every transition has an editorial reason.
- The payoff is visible, not only described.

## Guides

In the browser preview console, run:

```js
document.body.classList.add('show-guides')
```

Remove the guides before the final render or leave them hidden.

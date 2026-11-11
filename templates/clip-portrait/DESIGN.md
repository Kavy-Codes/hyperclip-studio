# Design — {{SLUG}}

## Direction

A dark, quiet canvas with one warm-white idea and pale green progress. The
composition is built for a phone first: large type, one attention target per
beat, and a payoff that can be understood with sound off.

- Canvas: 1080x1920, 30fps.
- Safe zone: x=90..930, y=200..1600. Keep captions and key text out of the
  right edge and bottom 320px where social UI sits.
- Palette: `#080c12` background, `#f4f1ea` primary text, `#b9f27c` accent,
  `#b9c2bd` secondary text.
- Type: Inter/Arial for speech and headings; Courier New for labels.
- Motion: one purposeful reveal per beat. No flashing, no constant idle motion.

## Beats

| Time | Beat | Visual | Spoken anchor |
|---|---|---|---|
| 0.0–2.0 | Hook | Kicker + headline | UNKNOWN |
| 2.0–5.0 | Context | Sub-line | UNKNOWN |
| 5.0–10.0 | Payoff | Evidence card | UNKNOWN |
| 10.0–13.0 | Caption | Exact spoken words | UNKNOWN |
| 13.0–{{DURATION}} | Hold / CTA | Footer + progress | UNKNOWN |

## Checks

- First frame is meaningful without context.
- Text stays inside the safe zone at phone size.
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

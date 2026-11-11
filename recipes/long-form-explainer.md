# Long-form explainer

Use for a 5–15 minute explainer, documentary segment or edited interview. The
short-form recipes are for the derivative clips.

## Build

1. Lock the audio story first: transcript, silence/mistake pass, chapter beats.
2. Write a one-page beat sheet: hook, promise, 3–5 chapters, payoff, CTA.
3. Create a landscape project:
   `STUDIO/scripts/new-clip.sh <slug> --format landscape --duration 480`
4. Build the base with `ambient-bg` (or the `dark-graph-paper-template` scene).
5. Use `hook` for the first 20–30s, `lower-third` for guests, `stat` for one
   number per evidence beat, `payoff` for the conclusion, `cta` for the end.
6. Use style-library cards for evidence and transitions. Add with:
   `STUDIO/scripts/add-card.sh <slug> <card-id>`
7. Keep B-roll and graphics subordinate to the argument. One idea per beat.
8. `check` → draft → chapter-level frame review → final.

## Structure

- 0:00–0:30 — hook and promise.
- 0:30–2:00 — context and stakes.
- 2:00–8:00 — chapters, each with evidence and a consequence.
- 8:00–10:00 — payoff and limits.
- 10:00–end — CTA and next step.

## Avoid

- A 60-second intro before the promise.
- A new card every 2 seconds with no argument.
- Reusing the same B-roll scene under a new crop.
- A conclusion that only restates the intro.

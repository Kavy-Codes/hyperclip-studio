# Music performance Short

Use when the source is a performance, rehearsal, reaction to a song, or a
music-discovery moment. The performance is the evidence; do not bury it under
graphics.

## Build

1. Find the **best 2–3 seconds of performance** first. That is the hook.
2. Confirm rights: who owns the footage, the song, the lyrics and the venue.
   If any is `UNKNOWN`, do not publish.
3. Create a portrait project:
   `STUDIO/scripts/new-clip.sh <slug> --channel Song-Central --duration 18`
4. Add `ambient-bg` at track 0 and the performance video at track 1.
5. Use `hook` for the first 2–3s with one truthful line, not a vague tease.
6. Use `caption` for the exact lyric or spoken reaction. Do not paraphrase a
   lyric and present it as the lyric.
7. Use `payoff` for the moment the performance lands. Hold at least 1.5s.
8. Add `cta` only after the payoff.
9. If a style card helps, use `add-card.sh` with a Kallaway stat/quote card and
   the portrait adapter. Keep the performance visible around the panel.
10. `check` → draft → frame review → final.

## Sound

- Keep the performance vocal/lead above music.
- If you add a sound effect, align the audible impact with the visual landing
  within two frames.
- Do not add a music bed that fights the actual song.

## Avoid

- A generic “wait for it” hook that delays the performance.
- Lyrics that do not match the audio.
- A full-screen card that hides the performance during the payoff.
- Using a song or footage without a recorded rights answer.

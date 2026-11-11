# Interview Short

Use when a longer interview contains one answer, admission, story or concrete
result that stands alone.

## Build

1. Find the **answer**, not the question. The clip starts on the strongest line
   or on the reaction to it.
2. Ensure source video has 1s dense keyframes (`-g 30 -keyint_min 30`) to avoid Chrome render seek stalls (`D-010`).
3. Inspect source frames for baked-in lower-thirds or PiP graphics; use per-segment crop coordinates (`crop_x`) so speaker framing never captures sliced graphic edges (`L-019`).
4. Confirm the speaker's name, role and permission to use the footage.
5. Create a portrait project:
   `STUDIO/scripts/new-clip.sh <slug> --channel Clipworthy --duration 25`
6. Standard 12-track layout:
   - Track 0: `ambient-bg`
   - Track 1: interview video layer (re-framed 9:16)
   - Track 2: content / stat badges (Golden Graphic Desk, Y=910–980px)
   - Track 6: `kinetic-captions` (anchored at Y=1340px)
   - Track 7: `lower-third` / `hook` / `payoff`
   - Track 8: source vocal dialogue (normalized to -16 LUFS)
   - Track 9: music bed (ducked under speech)
   - Track 10: procedural SFX hits
7. Add `hook` with a specific, truthful line from the answer.
8. Add `lower-third` for name and role; keep it up for 3–4s, not the whole clip. Keep clear of the mouth.
9. Follow the **Narrative Jump-Cut Ending Protocol** (`L-017`, `D-014`): never end on a question or mid-reaction cutoff. Cut to the punchline/resolution and leave 0.3s–0.5s audio tail with a gradual music fade-out.
10. `check-clip.sh` → draft → frame review → final.

## Editorial

- Preserve qualifications that change the meaning.
- Do not create a Frankenstein answer from unrelated sentences.
- Keep the speaker's exact words for the payoff.
- If the answer needs context, give it in one line before the clip, not a
  paragraph inside the clip.

## Avoid

- Starting with a question card and no answer.
- Ending clip on an unresolved question or abrupt reaction cutoff.
- Sliced slivers of embedded interview graphics next to the speaker.
- Overlays that cover the speaker's face or chin.
- A caption that paraphrases a legal, medical or financial claim.
- Publishing without the speaker's permission.

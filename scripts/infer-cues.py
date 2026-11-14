#!/usr/bin/env python3
"""
Intelligent SFX Cue Inferrer for Creator Studio
Analyzes transcript, captions, and index.html to generate frame-exact SFX cues:
- Whooshes / Swipes on major sentence openings and card entrances
- Hits / Pops on numerical punchlines, currency ($), percentages (%), and shock words
- Subtle clicks on badge reveals
"""

import sys
import os
import json
import re
import argparse

def clean_word(w):
    return re.sub(r'^[^\w$€£]+|[^\w$€£%]+$', '', w).lower()

def infer_cues(proj_dir, duration=None):
    cues = []
    
    # 1. Inspect index.html for card / graphic timestamps
    index_path = os.path.join(proj_dir, "index.html")
    if os.path.exists(index_path):
        with open(index_path, "r", encoding="utf-8") as f:
            html = f.read()
            
        # Match GSAP beat comments: // BEAT 1: HOOK (1.60s - 3.20s)
        beat_matches = re.finditer(r'//\s*BEAT\s*([0-9A-Za-z]+):\s*([^\n(]+)\(([\d.]+)s\s*-\s*([\d.]+)s\)', html, re.I)
        for m in beat_matches:
            b_num = m.group(1).strip()
            b_title = m.group(2).strip()
            b_start = float(m.group(3))
            cues.append({
                "t": round(b_start, 2),
                "cue": "whoosh",
                "fx": f"beat_{b_num}_{b_title[:15]}"
            })
            
        # Match tl.to / tl.fromTo card entrances: e.g. '#desk-card', 5.0
        card_matches = re.finditer(r"tl\.(?:to|fromTo)\(['\"]#([^'\"]+(?:card|group|step|stat|desk)[^'\"]*)['\"],\s*\{[^}]+\}(?:,\s*\{[^}]+\})?,\s*([\d.]+)\)", html)
        for m in card_matches:
            elem_id = m.group(1)
            t_val = float(m.group(2))
            cues.append({
                "t": round(t_val, 2),
                "cue": "swipe",
                "fx": f"card_{elem_id[:12]}"
            })

    # 2. Inspect transcript for speech impacts & numbers
    words = []
    transcript_path = os.path.join(proj_dir, "assets", "transcript.json")
    if os.path.exists(transcript_path):
        try:
            with open(transcript_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                words = data.get("words", [])
        except Exception:
            pass

    if not words:
        # Check captions.json
        captions_path = os.path.join(proj_dir, "assets", "captions.json")
        if os.path.exists(captions_path):
            try:
                with open(captions_path, "r", encoding="utf-8") as f:
                    cdata = json.load(f)
                    for c in cdata.get("cues", []):
                        words.extend(c.get("words", []))
            except Exception:
                pass

    IMPACT_WORDS = {
        "million", "millions", "billion", "billions", "thousand", "thousands",
        "dollar", "dollars", "percent", "loophole", "secret", "hack", "trick",
        "money", "cash", "rich", "broke", "jail", "illegal", "free", "zero",
        "pissed", "crazy", "stupid", "danger", "loss", "profit", "win", "lost"
    }

    prev_end = 0.0
    for i, w in enumerate(words):
        raw_text = w.get("text", "")
        cw = clean_word(raw_text)
        start_t = float(w.get("start", 0.0))
        end_t = float(w.get("end", 0.0))
        gap = start_t - prev_end

        # Numerical punchline or currency ($25M, 2%, $0)
        has_number = bool(re.search(r'\d|[$€£%]', raw_text))
        is_impact = cw in IMPACT_WORDS

        if has_number or is_impact:
            cue_type = "hit" if has_number else "pop"
            cues.append({
                "t": round(start_t, 2),
                "cue": cue_type,
                "fx": f"word_{cw[:10]}"
            })
        elif gap > 0.65 and i > 0:
            # Sentence transition after long breath/pause
            cues.append({
                "t": round(max(0.0, start_t - 0.05), 2),
                "cue": "whoosh",
                "fx": "phrase_intro"
            })

        prev_end = end_t

    # 3. Sort by timestamp and de-duplicate (minimum 0.28s spacing to avoid muddy audio)
    cues.sort(key=lambda x: x["t"])
    filtered_cues = []
    last_t = -1.0
    for c in cues:
        t = c["t"]
        if duration is not None and t > duration:
            continue
        if t < 0.05:
            continue
        if t - last_t >= 0.28:
            filtered_cues.append(c)
            last_t = t

    return filtered_cues

def main():
    parser = argparse.ArgumentParser(description="Infer SFX cues for project")
    parser.add_argument("slug", help="Project slug")
    parser.add_argument("--dur", type=float, default=None, help="Clip duration")
    parser.add_argument("--force", action="store_true", help="Overwrite existing cues.json")
    args = parser.parse_args()

    studio_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    proj_dir = os.path.join(studio_dir, "projects", args.slug)
    if not os.path.exists(proj_dir):
        print(f"Error: project {proj_dir} not found", file=sys.stderr)
        sys.exit(1)

    cues_file = os.path.join(proj_dir, "assets", "cues.json")
    if os.path.exists(cues_file) and not args.force:
        try:
            with open(cues_file, "r") as f:
                existing = json.load(f)
                if len(existing) > 0:
                    print(f"cues.json already contains {len(existing)} cues. Use --force to overwrite.")
                    return
        except Exception:
            pass

    cues = infer_cues(proj_dir, args.dur)
    with open(cues_file, "w", encoding="utf-8") as f:
        json.dump(cues, f, indent=2)

    print(f"Generated {len(cues)} frame-exact SFX cues in {cues_file}")
    for c in cues[:8]:
        print(f"  {c['t']:5.2f}s | {c['cue']:7} | {c['fx']}")
    if len(cues) > 8:
        print(f"  ... and {len(cues) - 8} more cues.")

if __name__ == "__main__":
    main()

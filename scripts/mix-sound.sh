#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
EDIT_KIT="$ROOT/Edit-Kit"

SLUG="${1:-}"

if [[ -z "$SLUG" ]]; then
  echo "Usage: ./STUDIO/scripts/mix-sound.sh <project-slug> [--mood warm|tech|calm] [--sfx-db -17.0]"
  exit 1
fi

shift || true
MOOD="warm"
SFX_DB="-17.0"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --mood) MOOD="$2"; shift 2 ;;
    --sfx-db) SFX_DB="$2"; shift 2 ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

PROJ="$ROOT/projects/$SLUG"
[[ -d "$PROJ" ]] || { echo "Project directory not found: $PROJ" >&2; exit 1; }

AUDIO_DIR="$PROJ/assets/audio"
mkdir -p "$AUDIO_DIR"

# Detect project duration
DUR=$(node -e "
const fs = require('fs');
const html = fs.readFileSync('$PROJ/index.html', 'utf8');
const m = html.match(/data-duration=[\"']([\d.]+)[\"']/);
console.log(m ? m[1] : '20.0');
")

CUES_FILE="$PROJ/assets/cues.json"
if [[ ! -f "$CUES_FILE" || "$(cat "$CUES_FILE" 2>/dev/null | tr -d '[:space:]')" == "[]" ]]; then
  echo "Auto-inferring frame-exact SFX cues from narrative timeline and speech..."
  python3 "$ROOT/scripts/infer-cues.py" "$SLUG" --dur "$DUR" 2>/dev/null || echo "[]" > "$CUES_FILE"
fi

echo "=== Edit-Kit Audio Engine for '$SLUG' (Duration: ${DUR}s) ==="

# 1. Synthesize precision SFX and background music
echo "Generating frame-exact SFX and soft music bed..."
python3 "$EDIT_KIT/skills/sound/scripts/sfx_music.py" \
  --cues "$CUES_FILE" \
  --dur "$DUR" \
  --out "$AUDIO_DIR" \
  --mood "$MOOD" \
  --sfx-db "$SFX_DB"

VOICE_SRC="$PROJ/assets/working.mp4"
if [[ ! -f "$VOICE_SRC" ]]; then
  VOICE_SRC="$PROJ/assets/working.wav"
fi

# 2. Mix voice, ducked music, and SFX with broadcast loudness
echo "Mixing audio (Voice -14 LUFS, Music -38 LUFS sidechain-ducked, SFX -17 dBFS)..."
python3 "$EDIT_KIT/skills/sound/scripts/mix.py" \
  --voice "$VOICE_SRC" \
  --sfx "$AUDIO_DIR/sfx.wav" \
  --music "$AUDIO_DIR/music_raw.wav" \
  --dur "$DUR" \
  --clean \
  --out "$AUDIO_DIR/mix.wav"

echo "=== Audio mix complete: $AUDIO_DIR/mix.wav ==="

# 3. Wire broadcast master audio stem into index.html
if [[ -f "$PROJ/index.html" ]]; then
  node -e "
    const fs = require('fs');
    const p = '$PROJ/index.html';
    let html = fs.readFileSync(p, 'utf8');
    const startM = '<!-- AUDIO:START -->';
    const endM = '<!-- AUDIO:END -->';
    if (html.includes(startM) && html.includes(endM)) {
      const audioTag = '<audio id=\"mix-audio\" src=\"assets/audio/mix.wav\" data-track=\"8\"></audio>';
      const before = html.slice(0, html.indexOf(startM) + startM.length);
      const after = html.slice(html.indexOf(endM));
      html = before + '\n    ' + audioTag + '\n    ' + after;
      fs.writeFileSync(p, html);
      console.log('Wired mix-audio master stem into index.html');
    }
  "
fi

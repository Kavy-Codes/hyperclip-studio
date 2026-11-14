#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

SLUG="${1:-}"
SOURCE="${2:-}"
shift 2 || true

usage() {
  cat <<'EOF'
Usage:
  ./scripts/new-edit.sh <slug> <source-video> [options]

Options:
  --format portrait|landscape   Default: portrait
  --channel <name>              Clipworthy, Song-Central, or UNKNOWN
  --title <text>                Default: source filename
  --duration <seconds>          Default: source duration (rounded up)
  --fit cover|contain           Default: cover
  --import <path>               Import an existing .json/.srt/.vtt transcript
  --model <name>                Whisper model. Default: base.en
  --language <code>             Default: en
  --cut-silences                Trim dead air after transcription
  --gap <seconds>               Silence threshold. Default: 0.55
  --no-transcribe               Skip transcription and captions
  --no-captions                 Transcribe but do not generate captions

Examples:
  ./scripts/new-edit.sh mahalia-hook-01 ~/Videos/take-01.mp4 --channel Song-Central
  ./scripts/new-edit.sh demo-01 source/take.mp4 --cut-silences --import captions.srt
EOF
}

if [[ -z "$SLUG" || -z "$SOURCE" ]]; then
  usage >&2
  exit 1
fi

FORMAT="portrait"
CHANNEL="UNKNOWN"
TITLE=""
DURATION=""
FIT="cover"
IMPORT=""
MODEL="base.en"
LANGUAGE="en"
CUT_SILENCES=0
GAP="0.55"
TRANSCRIBE=1
CAPTIONS=1

while [[ $# -gt 0 ]]; do
  case "$1" in
    --format) FORMAT="$2"; shift 2 ;;
    --channel) CHANNEL="$2"; shift 2 ;;
    --title) TITLE="$2"; shift 2 ;;
    --duration) DURATION="$2"; shift 2 ;;
    --fit) FIT="$2"; shift 2 ;;
    --import) IMPORT="$2"; shift 2 ;;
    --model) MODEL="$2"; shift 2 ;;
    --language) LANGUAGE="$2"; shift 2 ;;
    --cut-silences) CUT_SILENCES=1; shift ;;
    --gap) GAP="$2"; shift 2 ;;
    --no-transcribe) TRANSCRIBE=0; shift ;;
    --no-captions) CAPTIONS=0; shift ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

[[ -f "$SOURCE" ]] || { echo "Source not found: $SOURCE" >&2; exit 1; }
[[ -n "$TITLE" ]] || TITLE="$(basename "$SOURCE")"

if [[ -z "$DURATION" ]]; then
  DURATION="$(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$SOURCE" | awk '{printf "%d\n", ($1 == int($1) ? $1 : int($1)+1)}')"
fi
[[ "$DURATION" =~ ^[0-9]+$ ]] || { echo "Could not determine source duration; pass --duration." >&2; exit 1; }

"$ROOT/scripts/new-clip.sh" "$SLUG" \
  --format "$FORMAT" \
  --channel "$CHANNEL" \
  --source "$SOURCE" \
  --title "$TITLE" \
  --duration "$DURATION"

node "$ROOT/scripts/import-footage.mjs" "$SLUG" "$SOURCE" --fit "$FIT" --source-url "$SOURCE"

if [[ "$TRANSCRIBE" -eq 1 ]]; then
  if [[ -n "$IMPORT" ]]; then
    node "$ROOT/scripts/transcribe-clip.mjs" "$SLUG" --import "$IMPORT" --language "$LANGUAGE"
  else
    node "$ROOT/scripts/transcribe-clip.mjs" "$SLUG" --model "$MODEL" --language "$LANGUAGE"
  fi
fi

if [[ "$CUT_SILENCES" -eq 1 && "$TRANSCRIBE" -eq 1 ]]; then
  "$ROOT/scripts/cut-silences.sh" "$SLUG" --gap "$GAP" --apply
fi

if [[ "$CAPTIONS" -eq 1 && "$TRANSCRIBE" -eq 1 ]]; then
  node "$ROOT/scripts/make-captions.mjs" "$SLUG"
fi

if [[ -x "$ROOT/scripts/mix-sound.sh" ]]; then
  echo "Generating broadcast audio mix (Edit-Kit Sound Engine)..."
  "$ROOT/scripts/mix-sound.sh" "$SLUG" || echo "[WARN] Auto sound mix skipped."
fi

echo
echo "Project ready: $ROOT/projects/$SLUG"
echo "Preview:"
echo "  ./scripts/preview-clip.sh $SLUG --port 3002"
echo "Check:"
echo "  ./scripts/check-clip.sh $SLUG"
echo "Render:"
echo "  ./scripts/render-clip.sh $SLUG --final"

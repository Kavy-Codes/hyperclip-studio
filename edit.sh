#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
STUDIO="$ROOT"
INBOX="$STUDIO/INBOX"

usage() {
  cat <<'HELP'
HyperClip Studio — Fast-path video clipping & editing runner

Usage:
  ./edit.sh [source-video] [options]

Examples:
  ./edit.sh ~/Videos/interview.mp4
  ./edit.sh "inbox-video.mp4" --format portrait
  ./edit.sh --format portrait --cut-silences

Options:
  --format portrait|landscape   Video aspect ratio (default: portrait 1080x1920)
  --title <text>                Clip title in metadata
  --duration <seconds>          Target clip duration cap
  --import <transcript.srt>     Import existing transcript instead of running Whisper
  --model <whisper-model>       Whisper model (default: base.en, or tiny, small, medium)
  --language <code>             Speech language (default: en)
  --cut-silences                Automatically detect and cut silences
  --gap <seconds>               Silence threshold in seconds (default: 0.4)
  --no-cut                      Do not cut silences
  --no-transcribe               Skip speech recognition
  --no-captions                 Do not auto-generate captions

With no source argument, picks the newest video in INBOX/.
HELP
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage
  exit 0
fi

SOURCE=""
PASSTHRU=()

if [[ $# -gt 0 && "${1:-}" != -* ]]; then
  SOURCE="$1"
  shift
fi
PASSTHRU=("$@")

if [[ -z "$SOURCE" ]]; then
  [[ -d "$INBOX" ]] || { echo "INBOX missing: $INBOX" >&2; exit 1; }
  SOURCE="$(find "$INBOX" -maxdepth 1 -type f \
    \( -iname '*.mp4' -o -iname '*.mov' -o -iname '*.mkv' -o -iname '*.webm' \
       -o -iname '*.avi' -o -iname '*.m4v' -o -iname '*.mts' -o -iname '*.m2ts' \) \
    -printf '%T@ %p\n' 2>/dev/null | sort -nr | head -n 1 | cut -d' ' -f2- || true)"
  [[ -n "$SOURCE" ]] || {
    echo "No video found in $INBOX. Drop a file into INBOX/ or pass a path: ./edit.sh /path/to/video.mp4" >&2
    exit 1
  }
fi

[[ -f "$SOURCE" ]] || { echo "Source not found: $SOURCE" >&2; exit 1; }
SOURCE="$(realpath "$SOURCE")"

if ! ffprobe -v error -select_streams v:0 -show_entries stream=codec_type -of csv=p=0 "$SOURCE" | grep -q '^video$'; then
  echo "Error: no video stream found in $SOURCE" >&2
  exit 2
fi

DURATION_SECONDS="$(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$SOURCE" | awk '{printf "%.3f", $1}')"
if awk -v d="$DURATION_SECONDS" 'BEGIN { exit !(d > 3600) }'; then
  echo "Error: source is ${DURATION_SECONDS}s; maximum clip intake is 3600s (60 min)." >&2
  exit 3
fi

HAS_AUDIO="$(ffprobe -v error -select_streams a:0 -show_entries stream=codec_type -of csv=p=0 "$SOURCE" | head -n 1 || true)"
HAS_NO_TRANSCRIBE=0
NO_CUT=0
CLEAN_PASSTHRU=()

for arg in "${PASSTHRU[@]}"; do
  if [[ "$arg" == "--no-transcribe" ]]; then
    HAS_NO_TRANSCRIBE=1
    CLEAN_PASSTHRU+=("$arg")
  elif [[ "$arg" == "--no-cut" ]]; then
    NO_CUT=1
  else
    CLEAN_PASSTHRU+=("$arg")
  fi
done
PASSTHRU=("${CLEAN_PASSTHRU[@]}")

if [[ -z "$HAS_AUDIO" && "$HAS_NO_TRANSCRIBE" -eq 0 ]]; then
  echo "No audio stream found; skipping transcription and captions."
  PASSTHRU+=("--no-transcribe")
  HAS_NO_TRANSCRIBE=1
fi

if [[ "$HAS_NO_TRANSCRIBE" -eq 0 && "$NO_CUT" -eq 0 ]]; then
  PASSTHRU+=("--cut-silences")
fi

BASE="$(basename "$SOURCE")"
BASE="${BASE%.*}"
SLUG="$(printf '%s' "$BASE" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+//; s/-+$//')"
[[ -n "$SLUG" ]] || SLUG="clip"
SLUG="${SLUG:0:40}"
SLUG="${SLUG%-}"
SLUG="${SLUG}-$(date +%Y%m%d-%H%M%S)"

FORMAT_SHOWN="portrait"
if [[ ${#PASSTHRU[@]} -gt 0 ]]; then
  for ((i = 0; i < ${#PASSTHRU[@]}; i++)); do
    if [[ "${PASSTHRU[$i]}" == "--format" && $((i + 1)) -lt ${#PASSTHRU[@]} ]]; then
      FORMAT_SHOWN="${PASSTHRU[$((i + 1))]}"
    fi
  done
fi

echo "================================================="
echo " HyperClip Studio — Starting Edit"
echo "================================================="
echo "Source: $SOURCE"
echo "Slug:   $SLUG"
echo "Format: $FORMAT_SHOWN"
echo "-------------------------------------------------"

if [[ ${#PASSTHRU[@]} -gt 0 ]]; then
  "$STUDIO/scripts/quick-edit.sh" "$SLUG" "$SOURCE" "${PASSTHRU[@]}"
else
  "$STUDIO/scripts/quick-edit.sh" "$SLUG" "$SOURCE"
fi

echo
echo "================================================="
echo " Edit Ready!"
echo " Project: $STUDIO/projects/$SLUG"
echo " Review Render: $STUDIO/exports/${SLUG}-*.mp4"
echo "================================================="

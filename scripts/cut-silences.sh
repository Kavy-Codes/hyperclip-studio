#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
KIT="$ROOT/vendor/herk-edit-kit"
SLUG="${1:-}"
shift || true

if [[ -z "$SLUG" ]]; then
  cat >&2 <<'EOF'
Usage:
  ./scripts/cut-silences.sh <project-slug> [options]

Options:
  --gap <seconds>       Minimum pause to trim. Default: 0.55
  --head-pad <seconds>  Silence kept before first word. Default: 0.22
  --tail-pad <seconds>  Silence kept after last word. Default: 0.34
  --transcript <path>   Default: assets/transcript.json
  --video <path>        Default: assets/current.mp4 if present, else assets/working.mp4
  --output <path>       Default: assets/edited-silenced.mp4
  --apply               Render the cut and repoint the composition at it

Without --apply this writes the EDL, decisions and retimed transcript only.
EOF
  exit 1
fi

PROJECT="$ROOT/projects/$SLUG"
[[ -d "$PROJECT" ]] || { echo "Project not found: $PROJECT" >&2; exit 1; }

TRANSCRIPT="$PROJECT/assets/transcript.json"
if [[ -f "$PROJECT/assets/current.mp4" ]]; then
  VIDEO="$PROJECT/assets/current.mp4"
else
  VIDEO="$PROJECT/assets/working.mp4"
fi
OUTPUT="$PROJECT/assets/edited-silenced.mp4"
GAP="0.55"
HEAD_PAD="0.22"
TAIL_PAD="0.34"
APPLY=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --gap) GAP="$2"; shift 2 ;;
    --head-pad) HEAD_PAD="$2"; shift 2 ;;
    --tail-pad) TAIL_PAD="$2"; shift 2 ;;
    --transcript) TRANSCRIPT="$2"; shift 2 ;;
    --video) VIDEO="$2"; shift 2 ;;
    --output) OUTPUT="$2"; shift 2 ;;
    --apply) APPLY=1; shift ;;
    -h|--help) exec "$0" ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

[[ -f "$TRANSCRIPT" ]] || { echo "Transcript not found: $TRANSCRIPT" >&2; exit 1; }
[[ -f "$VIDEO" ]] || { echo "Video not found: $VIDEO" >&2; exit 1; }

ARGS=(
  "$TRANSCRIPT"
  --video "$VIDEO"
  --out-dir "$PROJECT/assets"
  --output "$OUTPUT"
  --gap "$GAP"
  --head-pad "$HEAD_PAD"
  --tail-pad "$TAIL_PAD"
)
if [[ "$APPLY" -eq 1 ]]; then
  ARGS+=(--apply)
fi

node "$KIT/.claude/skills/cut-silences/scripts/cut-silences.mjs" "${ARGS[@]}"

if [[ "$APPLY" -eq 1 ]]; then
  NEW_TRANSCRIPT="$(ls -t "$PROJECT/assets"/*.silence-transcript.json 2>/dev/null | head -n 1 || true)"
  [[ -n "$NEW_TRANSCRIPT" ]] || { echo "No silence transcript produced." >&2; exit 1; }
  node "$ROOT/scripts/use-cut.mjs" "$SLUG" "$OUTPUT" --transcript "$NEW_TRANSCRIPT"
  echo
  echo "Silence cut applied. Regenerate captions:"
  echo "  ./scripts/make-captions.sh $SLUG"
fi

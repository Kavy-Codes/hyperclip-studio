#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
KIT="$ROOT/vendor/herk-edit-kit"
SLUG="${1:-}"
shift || true

if [[ -z "$SLUG" ]]; then
  cat >&2 <<'EOF'
Usage:
  ./scripts/apply-mistakes.sh <project-slug> [options]

Options:
  --transcript <path>   Default: assets/transcript.json
  --video <path>        Default: assets/current.mp4 if present, else assets/working.mp4
  --cuts <path>         Default: assets/approved-cuts.json
  --output <path>       Default: assets/edited-clean.mp4
  --dry-run             Write the EDL/transcript but do not render

The cuts file shape is:
  { "cuts": [ { "start": 1.2, "end": 1.5, "reason": "stutter" } ] }
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
CUTS="$PROJECT/assets/approved-cuts.json"
OUTPUT="$PROJECT/assets/edited-clean.mp4"
DRY=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --transcript) TRANSCRIPT="$2"; shift 2 ;;
    --video) VIDEO="$2"; shift 2 ;;
    --cuts) CUTS="$2"; shift 2 ;;
    --output) OUTPUT="$2"; shift 2 ;;
    --dry-run) DRY=1; shift ;;
    -h|--help) exec "$0" ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

[[ -f "$TRANSCRIPT" ]] || { echo "Transcript not found: $TRANSCRIPT" >&2; exit 1; }
[[ -f "$VIDEO" ]] || { echo "Video not found: $VIDEO" >&2; exit 1; }
[[ -f "$CUTS" ]] || { echo "Approved cuts not found: $CUTS" >&2; exit 1; }

ARGS=(
  "$TRANSCRIPT"
  --cuts "$CUTS"
  --video "$VIDEO"
  --out-dir "$PROJECT/assets"
  --output "$OUTPUT"
)
if [[ "$DRY" -eq 0 ]]; then
  ARGS+=(--apply)
fi

node "$KIT/.claude/skills/cut-mistakes/scripts/apply-cuts.mjs" "${ARGS[@]}"

if [[ "$DRY" -eq 0 ]]; then
  NEW_TRANSCRIPT="$(ls -t "$PROJECT/assets"/*.mistakes-transcript.json 2>/dev/null | head -n 1 || true)"
  [[ -n "$NEW_TRANSCRIPT" ]] || { echo "No mistakes transcript produced." >&2; exit 1; }
  node "$ROOT/scripts/use-cut.mjs" "$SLUG" "$OUTPUT" --transcript "$NEW_TRANSCRIPT"
  echo
  echo "Mistake cuts applied. Regenerate captions:"
  echo "  ./scripts/make-captions.sh $SLUG"
fi

#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SLUG="${1:-}"
shift || true

if [[ -z "$SLUG" ]]; then
  echo "Usage: ./scripts/render-clip.sh <slug> [--final|--high] [render options]" >&2
  exit 1
fi

PROJECT="$ROOT/projects/$SLUG"
[[ -d "$PROJECT" ]] || { echo "Project not found: $PROJECT" >&2; exit 1; }

QUALITY="draft"
EXTRA=()
for arg in "$@"; do
  case "$arg" in
    --final) QUALITY="standard" ;;
    --high) QUALITY="high" ;;
    *) EXTRA+=("$arg") ;;
  esac
done

node "$ROOT/vendor/herk-edit-kit/scripts/preflight.mjs" "$PROJECT"
cd "$PROJECT"
node "$ROOT/scripts/lint-clip.mjs" "$PROJECT"
npx hyperframes render \
  --quality "$QUALITY" \
  --low-memory-mode \
  -w 1 \
  "${EXTRA[@]}"

LATEST="$(ls -t renders/*.mp4 2>/dev/null | head -n 1 || true)"
if [[ -z "$LATEST" ]]; then
  echo "Render finished but no MP4 was found in $PROJECT/renders" >&2
  exit 1
fi

mkdir -p "$ROOT/exports"
OUT="$ROOT/exports/${SLUG}-$(date +%F-%H%M).mp4"
cp "$LATEST" "$OUT"

echo
echo "Rendered: $LATEST"
echo "Copied:   $OUT"

#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SLUG="${1:-}"

usage() {
  cat <<'EOF'
Usage:
  ./scripts/quick-edit.sh <slug> <source-video> [new-edit options]

Creates the project, ingests footage, transcribes/captions, checks it and
renders a draft. Use new-edit options such as:
  --format portrait|landscape
  --channel <name>
  --cut-silences
  --import <transcript.srt>
  --no-transcribe

Example:
  ./scripts/quick-edit.sh my-clip source.mp4 --channel Song-Central --cut-silences
EOF
}

if [[ -z "$SLUG" || $# -lt 2 ]]; then
  usage >&2
  exit 1
fi

"$ROOT/scripts/new-edit.sh" "$@"
"$ROOT/scripts/check-clip.sh" "$SLUG"
"$ROOT/scripts/render-clip.sh" "$SLUG"

echo
echo "Draft ready: $ROOT/projects/$SLUG/renders/"
echo "Review the full draft, then:"
echo "  ./scripts/render-clip.sh $SLUG --final"

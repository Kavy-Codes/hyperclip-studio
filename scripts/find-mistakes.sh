#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
KIT="$ROOT/vendor/herk-edit-kit"
SLUG="${1:-}"
shift || true

if [[ -z "$SLUG" ]]; then
  cat >&2 <<'EOF'
Usage:
  ./scripts/find-mistakes.sh <project-slug> [--transcript <path>]

Finds stutters, repeated words, false starts and retakes. This is review-gated:
read assets/*.cut-candidates.md, then write approved-cuts.json and run
./scripts/apply-mistakes.sh.
EOF
  exit 1
fi

PROJECT="$ROOT/projects/$SLUG"
[[ -d "$PROJECT" ]] || { echo "Project not found: $PROJECT" >&2; exit 1; }
TRANSCRIPT="$PROJECT/assets/transcript.json"
if [[ "${1:-}" == "--transcript" ]]; then
  TRANSCRIPT="$2"
fi
[[ -f "$TRANSCRIPT" ]] || { echo "Transcript not found: $TRANSCRIPT" >&2; exit 1; }

node "$KIT/.claude/skills/cut-mistakes/scripts/find-cut-candidates.mjs" \
  "$TRANSCRIPT" --out-dir "$PROJECT/assets"

echo
echo "Review the candidates before cutting:"
echo "  $PROJECT/assets/*.cut-candidates.md"
echo
echo "Write approved cuts to $PROJECT/assets/approved-cuts.json, then run:"
echo "  ./scripts/apply-mistakes.sh $SLUG"

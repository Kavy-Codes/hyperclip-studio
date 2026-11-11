#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SLUG="${1:-}"
shift || true

if [[ -z "$SLUG" ]]; then
  echo "Usage: ./scripts/check-clip.sh <slug> [hyperframes check options]" >&2
  exit 1
fi

PROJECT="$ROOT/projects/$SLUG"
[[ -d "$PROJECT" ]] || { echo "Project not found: $PROJECT" >&2; exit 1; }

node "$ROOT/vendor/herk-edit-kit/scripts/preflight.mjs" "$PROJECT"
cd "$PROJECT"
node "$ROOT/scripts/lint-clip.mjs" "$PROJECT"
node "$ROOT/scripts/check-json.mjs" "$PROJECT" --timeout 10000 "$@"

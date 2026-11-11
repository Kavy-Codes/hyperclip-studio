#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SLUG="${1:-}"
shift || true

if [[ -z "$SLUG" ]]; then
  echo "Usage: ./scripts/preview-clip.sh <slug> [hyperframes preview options]" >&2
  echo "Example: ./scripts/preview-clip.sh mahalia-hook-01 --port 3002" >&2
  exit 1
fi

PROJECT="$ROOT/projects/$SLUG"
[[ -d "$PROJECT" ]] || { echo "Project not found: $PROJECT" >&2; exit 1; }

cd "$PROJECT"
exec npx hyperframes preview . "$@"

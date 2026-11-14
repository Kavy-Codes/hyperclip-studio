#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [[ $# -lt 1 || "$1" == "--help" || "$1" == "-h" ]]; then
  echo "Usage: ./STUDIO/scripts/roto-text.sh <slug> --text \"\$25M\" --start <sec> --end <sec> [options]"
  echo
  echo "Options:"
  echo "  --x <int>           Left X position (default: 435)"
  echo "  --y <int>           Top Y position (default: 95)"
  echo "  --size <int>        Font size in pt (default: 230)"
  echo "  --color <name>      Color: gold | green | red | white (default: gold)"
  echo "  --font <path>       Custom TTF font path"
  echo "  --model <name>      rembg model (default: u2netp)"
  exit 0
fi

SLUG="$1"
shift

exec python3 "$ROOT/scripts/roto-text.py" "$SLUG" "$@"

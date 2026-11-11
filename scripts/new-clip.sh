#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
KIT="$ROOT/vendor/herk-edit-kit"

FORMAT="portrait"
CHANNEL="UNKNOWN"
SOURCE="UNKNOWN"
TITLE=""
DURATION="15"
SLUG=""

usage() {
  cat <<'EOF'
Usage:
  ./scripts/new-clip.sh <slug> [options]

Options:
  --format portrait|landscape   Default: portrait (1080x1920)
  --channel <name>              Clipworthy, Song-Central, or UNKNOWN
  --source <url-or-path>        Source reference recorded in BRIEF.md
  --title <text>                Human title for the project
  --duration <seconds>          Default: 15

Example:
  ./scripts/new-clip.sh mahalia-hook-01 --channel Song-Central \
    --source "https://youtube.com/watch?v=..." --duration 18
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --format)
      [[ $# -ge 2 ]] || { echo "Missing value for --format" >&2; exit 1; }
      FORMAT="$2"; shift 2 ;;
    --channel)
      [[ $# -ge 2 ]] || { echo "Missing value for --channel" >&2; exit 1; }
      CHANNEL="$2"; shift 2 ;;
    --source)
      [[ $# -ge 2 ]] || { echo "Missing value for --source" >&2; exit 1; }
      SOURCE="$2"; shift 2 ;;
    --title)
      [[ $# -ge 2 ]] || { echo "Missing value for --title" >&2; exit 1; }
      TITLE="$2"; shift 2 ;;
    --duration)
      [[ $# -ge 2 ]] || { echo "Missing value for --duration" >&2; exit 1; }
      DURATION="$2"; shift 2 ;;
    -h|--help)
      usage; exit 0 ;;
    -*)
      echo "Unknown option: $1" >&2; usage >&2; exit 1 ;;
    *)
      [[ -z "$SLUG" ]] || { echo "Only one slug is allowed." >&2; exit 1; }
      SLUG="$1"; shift ;;
  esac
done

[[ -n "$SLUG" ]] || { usage >&2; exit 1; }
[[ "$SLUG" =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]] || {
  echo "Slug must be lowercase kebab-case, e.g. mahalia-hook-01" >&2
  exit 1
}
[[ "$FORMAT" == "portrait" || "$FORMAT" == "landscape" ]] || {
  echo "--format must be portrait or landscape" >&2
  exit 1
}
case "$CHANNEL" in
  Clipworthy|Song-Central|UNKNOWN) ;;
  *) echo "--channel must be Clipworthy, Song-Central, or UNKNOWN" >&2; exit 1 ;;
esac
[[ "$DURATION" =~ ^[0-9]+$ ]] || { echo "--duration must be an integer" >&2; exit 1; }
(( DURATION >= 1 && DURATION <= 3600 )) || {
  echo "--duration must be between 1 and 3600 seconds" >&2
  exit 1
}

DEST="$ROOT/projects/$SLUG"
TEMPLATE="$ROOT/templates/clip-$FORMAT"

[[ -d "$TEMPLATE" ]] || { echo "Missing template: $TEMPLATE" >&2; exit 1; }
[[ ! -e "$DEST" ]] || { echo "Project already exists: $DEST" >&2; exit 1; }
[[ -f "$KIT/node_modules/gsap/dist/gsap.min.js" ]] || {
  echo "GSAP is missing. Run: cd \"$KIT\" && npm ci" >&2
  exit 1
}

cp -R "$TEMPLATE/." "$DEST"
mkdir -p "$DEST/assets" "$DEST/compositions" "$DEST/renders"
cp "$KIT/node_modules/gsap/dist/gsap.min.js" "$DEST/assets/gsap.min.js"

if [[ "$FORMAT" == "portrait" ]]; then
  WIDTH=1080; HEIGHT=1920
else
  WIDTH=1920; HEIGHT=1080
fi

[[ -n "$TITLE" ]] || TITLE="$SLUG"
export SLUG TITLE CHANNEL SOURCE FORMAT WIDTH HEIGHT DURATION
export SOURCE_LABEL="Source: $SOURCE"
export DATE="$(date +%F)"

node "$ROOT/scripts/fill-template.mjs" \
  "$DEST/BRIEF.md" \
  "$DEST/DESIGN.md" \
  "$DEST/VERIFY.md" \
  "$DEST/index.html" \
  "$DEST/meta.json"

cat <<EOF
Created $DEST

Next:
  cd "$DEST"
  npx hyperframes preview
  npx hyperframes lint
  npx hyperframes render --quality draft --low-memory-mode -w 1

Keep the original source in $ROOT/source/ and record its rights in BRIEF.md.
EOF

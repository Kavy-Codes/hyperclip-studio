#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
KIT="$ROOT/vendor/herk-edit-kit"
MANIFEST="$ROOT/components/manifest.json"

SLUG="${1:-}"
COMPONENT_ID="${2:-}"
shift 2 || true

if [[ -z "$SLUG" || -z "$COMPONENT_ID" ]]; then
  cat >&2 <<'EOF'
Usage:
  ./scripts/add-component.sh <project-slug> <component-id> [options]

Options:
  --start <seconds>     Default: 0
  --duration <seconds>  Default: component's own duration
  --track <number>      Default: 7

Example:
  ./scripts/add-component.sh my-clip hook --start 0 --duration 4 --track 4
EOF
  exit 1
fi

PROJECT="$ROOT/projects/$SLUG"
[[ -d "$PROJECT" ]] || { echo "Project not found: $PROJECT" >&2; exit 1; }

START="0"
DURATION=""
TRACK="7"
while [[ $# -gt 0 ]]; do
  case "$1" in
    --start)
      [[ $# -ge 2 ]] || { echo "Missing value for --start" >&2; exit 1; }
      START="$2"; shift 2 ;;
    --duration)
      [[ $# -ge 2 ]] || { echo "Missing value for --duration" >&2; exit 1; }
      DURATION="$2"; shift 2 ;;
    --track)
      [[ $# -ge 2 ]] || { echo "Missing value for --track" >&2; exit 1; }
      TRACK="$2"; shift 2 ;;
    -h|--help)
      exit 0 ;;
    *)
      echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

readarray -t META < <(node -e '
const fs = require("fs");
const m = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
const c = (m.components || []).find((x) => x.id === process.argv[2]);
if (!c) process.exit(2);
console.log(c.file);
console.log(c.width);
console.log(c.height);
console.log(c.duration);
console.log(c.type);
' "$MANIFEST" "$COMPONENT_ID")

FILE="${META[0]:-}"
WIDTH="${META[1]:-}"
HEIGHT="${META[2]:-}"
COMP_DURATION="${META[3]:-8}"
TYPE="${META[4]:-block}"

[[ -n "$FILE" ]] || { echo "Unknown component: $COMPONENT_ID" >&2; exit 1; }
[[ "$TYPE" != "adapter" ]] || {
  echo "Use add-card.sh for the portrait card adapter." >&2
  exit 1
}

[[ -n "$DURATION" ]] || DURATION="$COMP_DURATION"
mkdir -p "$PROJECT/compositions" "$PROJECT/assets"

SRC="$ROOT/components/$FILE"
DEST="$PROJECT/compositions/$COMPONENT_ID.html"
cp "$SRC" "$DEST"

sed -i 's#https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js#assets/gsap.min.js#g' "$DEST"

if [[ ! -f "$PROJECT/assets/gsap.min.js" ]]; then
  cp "$KIT/node_modules/gsap/dist/gsap.min.js" "$PROJECT/assets/gsap.min.js"
fi

SNIPPET="<div id=\"$COMPONENT_ID-mount\" data-composition-id=\"$COMPONENT_ID\" data-composition-src=\"compositions/$COMPONENT_ID.html\" data-start=\"$START\" data-duration=\"$DURATION\" data-track-index=\"$TRACK\" data-width=\"$WIDTH\" data-height=\"$HEIGHT\"></div>"

if grep -q '<!-- LAYERS:START -->' "$PROJECT/index.html"; then
  node "$ROOT/scripts/wire-layer.mjs" "$SLUG"     --id "$COMPONENT_ID"     --src "compositions/$COMPONENT_ID.html"     --start "$START" --duration "$DURATION" --track "$TRACK"     --width "$WIDTH" --height "$HEIGHT" >/dev/null
  WIRED="Wired into index.html on track $TRACK."
else
  WIRED="Paste this into index.html inside the root composition:"
fi

cat <<EOF
Added component: $COMPONENT_ID
File: $DEST

$WIRED

$SNIPPET

Then fill these slots:
$(node -e '
const fs = require("fs");
const m = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
const c = (m.components || []).find((x) => x.id === process.argv[2]);
console.log((c.slots || []).map((s) => "  data-slot=\"" + s + "\"").join("\n") || "  (no text slots)");
' "$MANIFEST" "$COMPONENT_ID")

EOF

{
  echo "## $COMPONENT_ID"
  echo
  echo '```html'
  echo "$SNIPPET"
  echo '```'
  echo
} >> "$PROJECT/WIRING.md"

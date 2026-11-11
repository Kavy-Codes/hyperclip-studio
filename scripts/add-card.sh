#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
KIT="$ROOT/vendor/herk-edit-kit"
REGISTRY="$KIT/style-library/registry.json"

SLUG="${1:-}"
CARD_ID="${2:-}"
shift 2 || true

if [[ -z "$SLUG" || -z "$CARD_ID" ]]; then
  cat >&2 <<'EOF'
Usage:
  ./scripts/add-card.sh <project-slug> <card-id> [options]

Options:
  --start <seconds>     Default: 0
  --duration <seconds>  Default: card's max duration, else 8
  --track <number>      Default: 5
  --portrait            Wrap the 1920x1080 card in a 1080x1920 adapter

Examples:
  ./scripts/add-card.sh my-clip kallaway.t2.stat.hero --portrait --start 4 --duration 5
  ./scripts/add-card.sh my-clip vox-explainer.t1.section.circle --start 2 --duration 6
EOF
  exit 1
fi

PROJECT="$ROOT/projects/$SLUG"
[[ -d "$PROJECT" ]] || { echo "Project not found: $PROJECT" >&2; exit 1; }

START="0"
DURATION=""
TRACK="5"
PORTRAIT=0
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
    --portrait)
      PORTRAIT=1; shift ;;
    -h|--help)
      exit 0 ;;
    *)
      echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

CARD_JSON="$(jq -c --arg id "$CARD_ID" '
  .styles[] as $s
  | $s.cards[]
  | select(.id == $id)
  | {card: ., styleId: $s.id, styleFolder: $s.folder, styleName: $s.name}
' "$REGISTRY")"

[[ -n "$CARD_JSON" && "$CARD_JSON" != "null" ]] || {
  echo "Card not found: $CARD_ID" >&2
  echo "Search with: node \"$ROOT/scripts/catalog.mjs\" --search <term>" >&2
  exit 1
}

CARD_FILE="$(jq -r '.card.file' <<<"$CARD_JSON")"
STYLE_ID="$(jq -r '.styleId' <<<"$CARD_JSON")"
STYLE_FOLDER="$(jq -r '.styleFolder' <<<"$CARD_JSON")"
CARD_SLOTS="$(jq -r '.card.slots | join(", ")' <<<"$CARD_JSON")"
CARD_DURATION="$(jq -r '.card.duration | if type == "object" then (.max // .min // 8) elif type == "number" then . else 8 end' <<<"$CARD_JSON")"
[[ -n "$DURATION" ]] || DURATION="$CARD_DURATION"

SRC="$KIT/style-library/$CARD_FILE"
[[ -f "$SRC" ]] || { echo "Card file missing: $SRC" >&2; exit 1; }

SAFE_ID="$(echo "$CARD_ID" | tr '.' '-')"
DEST="$PROJECT/compositions/$SAFE_ID.html"
mkdir -p "$PROJECT/compositions" "$PROJECT/assets"
cp "$SRC" "$DEST"

COMP_ID="$(grep -o 'data-composition-id="[^"]*"' "$DEST" | head -n 1 | sed 's/.*="//;s/"$//')"
[[ -n "$COMP_ID" ]] || { echo "Could not read the card's internal composition ID." >&2; exit 1; }

TOKENS_SRC="$KIT/style-library/$STYLE_FOLDER/tokens.css"
TOKENS_DEST="$PROJECT/assets/${STYLE_ID}-tokens.css"
if [[ -f "$TOKENS_SRC" ]]; then
  cp "$TOKENS_SRC" "$TOKENS_DEST"
  sed -i -E "s#href=\"(\.\./)+tokens\.css\"#href=\"assets/${STYLE_ID}-tokens.css\"#g" "$DEST"
else
  echo "Warning: tokens.css missing for style $STYLE_ID" >&2
fi

sed -i 's#https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js#assets/gsap.min.js#g' "$DEST"

if [[ ! -f "$PROJECT/assets/gsap.min.js" ]]; then
  cp "$KIT/node_modules/gsap/dist/gsap.min.js" "$PROJECT/assets/gsap.min.js"
fi

if grep -q 'url(' "$DEST" && grep 'url(' "$DEST" | grep -vq 'data:'; then
  echo "Warning: the card contains non-data URL references. Inspect and localize them before rendering." >&2
fi

if [[ "$PORTRAIT" -eq 1 ]]; then
  ADAPTER_ID="${SAFE_ID}-portrait"
  ADAPTER_DEST="$PROJECT/compositions/$ADAPTER_ID.html"
  cp "$ROOT/components/adapters/card-16x9-in-9x16.html" "$ADAPTER_DEST"

  CARD_ID="$COMP_ID" \
  CARD_FILE="$(basename "$DEST")" \
  CARD_TITLE="$CARD_ID" \
  ADAPTER_ID="$ADAPTER_ID" \
  DURATION="$DURATION" \
  node "$ROOT/scripts/fill-template.mjs" "$ADAPTER_DEST" >/dev/null

  sed -i 's#https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js#assets/gsap.min.js#g' "$ADAPTER_DEST"

  SNIPPET="<div id=\"$ADAPTER_ID-mount\" data-composition-id=\"$ADAPTER_ID\" data-composition-src=\"compositions/$ADAPTER_ID.html\" data-start=\"$START\" data-duration=\"$DURATION\" data-track-index=\"$TRACK\" data-width=\"1080\" data-height=\"1920\"></div>"
  TARGET="$ADAPTER_DEST"
else
  SNIPPET="<div id=\"$SAFE_ID-mount\" data-composition-id=\"$COMP_ID\" data-composition-src=\"compositions/$(basename "$DEST")\" data-start=\"$START\" data-duration=\"$DURATION\" data-track-index=\"$TRACK\" data-width=\"1920\" data-height=\"1080\"></div>"
  TARGET="$DEST"
fi

if grep -q '<!-- LAYERS:START -->' "$PROJECT/index.html"; then
  if [[ "$PORTRAIT" -eq 1 ]]; then
    WIDTH=1080; HEIGHT=1920
  else
    WIDTH=1920; HEIGHT=1080
  fi
  node "$ROOT/scripts/wire-layer.mjs" "$SLUG"     --id "$( [[ "$PORTRAIT" -eq 1 ]] && echo "$ADAPTER_ID-mount" || echo "$SAFE_ID-mount" )"     --src "compositions/$( [[ "$PORTRAIT" -eq 1 ]] && echo "$ADAPTER_ID.html" || basename "$DEST" )"     --start "$START" --duration "$DURATION" --track "$TRACK"     --width "$WIDTH" --height "$HEIGHT" >/dev/null
  WIRED="Wired into index.html on track $TRACK."
else
  WIRED="Paste this into index.html inside the root composition:"
fi

cat <<EOF
Added card: $CARD_ID
Style: $STYLE_ID
File: $TARGET
Slots: ${CARD_SLOTS:-none}

$WIRED

$SNIPPET

Note: track $TRACK is reserved for cards in the current template.
If you changed the track plan, update it in STUDIO/BEST-PRACTICES.md.

Fill the card's data-slot values, then lint and render.
EOF

{
  echo "## Card: $CARD_ID"
  echo
  echo "- Style: \`$STYLE_ID\`"
  echo "- Slots: ${CARD_SLOTS:-none}"
  echo "- Target: \`$TARGET\`"
  echo
  echo '```html'
  echo "$SNIPPET"
  echo '```'
  echo
} >> "$PROJECT/WIRING.md"

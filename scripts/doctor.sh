#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
KIT="$ROOT/vendor/herk-edit-kit"

echo "=== HyperFrames Studio Doctor ==="
echo

if [[ ! -d "$KIT" ]]; then
  echo "[FAIL] Herk Edit Kit is missing. Extract it into STUDIO/vendor/herk-edit-kit." >&2
  exit 1
fi

echo "--- 1. HyperFrames Core Health ---"
cd "$KIT"
npx hyperframes doctor
echo

echo "--- 2. Studio Visual Asset Registries ---"
if [[ -f "$ROOT/registry.json" ]]; then
  REG_COUNT=$(node -e "const d=require('$ROOT/registry.json'); console.log(Array.isArray(d)?d.length:Object.keys(d.items||d).length)" 2>/dev/null || echo "ok")
  echo "[OK] HyperFrames Online Registry indexed: $REG_COUNT items ($ROOT/registry.json)"
else
  echo "[WARN] HyperFrames registry.json missing. Run registry sync."
fi

if [[ -f "$ROOT/catalog.json" ]]; then
  CAT_COUNT=$(node -e "const d=require('$ROOT/catalog.json'); console.log(Array.isArray(d)?d.length:Object.keys(d.cards||d).length)" 2>/dev/null || echo "ok")
  echo "[OK] Herk Style Catalog indexed: $CAT_COUNT cards ($ROOT/catalog.json)"
else
  echo "[WARN] Herk catalog.json missing."
fi

if [[ -x "$ROOT/scripts/find-visual.sh" ]]; then
  echo "[OK] Unified Visual Search Tool ready ($ROOT/scripts/find-visual.sh)"
else
  echo "[WARN] find-visual.sh missing or not executable."
fi
echo

echo "--- 3. Studio Typography & Design Assets ---"
FONT_DIR="$ROOT/assets/fonts"
if [[ -d "$FONT_DIR" && -f "$FONT_DIR/Poppins-Bold.ttf" ]]; then
  FONT_COUNT=$(find "$FONT_DIR" -name "*.ttf" | wc -l)
  echo "[OK] Creator Fonts ready ($FONT_COUNT fonts, Poppins-Bold active in $FONT_DIR)"
else
  echo "[WARN] Poppins-Bold.ttf missing in $FONT_DIR."
fi
echo

echo "--- 4. Local ASR (Whisper) ---"
WHISPER_BIN="$ROOT/tools/whisper.cpp/build/bin/whisper-cli"
MODEL_BIN="$ROOT/tools/whisper.cpp/models/ggml-base.en.bin"
if [[ -x "$WHISPER_BIN" && -f "$MODEL_BIN" ]]; then
  echo "[OK] Local Whisper ASR engine ready (base.en)"
elif [[ -x "$ROOT/tools/whisper.cpp/main" ]]; then
  echo "[OK] Local Whisper ASR engine ready"
else
  echo "[INFO] Local whisper engine not compiled. Run: STUDIO/scripts/setup-asr.sh base.en"
fi
echo "--- 5. Edit-Kit Suite & Sound Engine ---"
if [[ -d "$ROOT/Edit-Kit" ]]; then
  SKILL_COUNT=$(find "$ROOT/Edit-Kit/skills" -mindepth 1 -maxdepth 1 -type d | wc -l)
  echo "[OK] Edit-Kit suite ready ($SKILL_COUNT skills at $ROOT/Edit-Kit)"
  if [[ -x "$ROOT/scripts/mix-sound.sh" ]]; then
    echo "[OK] Broadcast sound mixing engine active ($ROOT/scripts/mix-sound.sh)"
  fi
else
  echo "[WARN] Edit-Kit missing at $ROOT/Edit-Kit"
fi
echo
echo "=== Doctor check complete ==="

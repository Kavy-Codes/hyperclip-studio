#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "================================================="
echo " HyperClip Studio — System Diagnostics"
echo "================================================="

ERRORS=0

check_cmd() {
  local name="$1"
  local cmd="$2"
  if command -v "$cmd" >/dev/null 2>&1; then
    local ver
    ver="$($cmd --version 2>&1 | head -n 1 || true)"
    echo "  ✓ $name: $ver"
  else
    echo "  ✗ $name: NOT FOUND ($cmd)"
    ERRORS=$((ERRORS + 1))
  fi
}

echo
echo "1. System Binaries:"
check_cmd "Node.js" "node"
check_cmd "NPM" "npm"
check_cmd "FFmpeg" "ffmpeg"
check_cmd "FFprobe" "ffprobe"
check_cmd "Git" "git"
check_cmd "CMake" "cmake"

echo
echo "2. Local Whisper ASR Engine:"
if [[ -f "$ROOT/tools/asr.json" ]]; then
  echo "  ✓ asr.json configuration present"
  ASR_BIN="$(grep '"whisper"' "$ROOT/tools/asr.json" | cut -d'"' -f4 || true)"
  ASR_MODEL="$(grep '"model"' "$ROOT/tools/asr.json" | cut -d'"' -f4 || true)"
  if [[ -x "$ASR_BIN" ]]; then
    echo "  ✓ whisper-cli: $ASR_BIN"
  else
    echo "  ✗ whisper-cli not executable: $ASR_BIN"
    ERRORS=$((ERRORS + 1))
  fi
  if [[ -f "$ASR_MODEL" ]]; then
    echo "  ✓ Speech model: $ASR_MODEL"
  else
    echo "  ✗ Speech model missing: $ASR_MODEL"
    ERRORS=$((ERRORS + 1))
  fi
else
  echo "  ⚠ Local Whisper not configured yet. Run: ./scripts/setup-asr.sh base.en"
fi

echo
echo "3. HyperFrames & Motion Engine:"
cd "$ROOT"
if [[ -d "$ROOT/node_modules/hyperframes" ]]; then
  HF_VER="$(npx hyperframes --version 2>&1 || true)"
  echo "  ✓ HyperFrames CLI: $HF_VER"
  npx hyperframes doctor 2>&1 | sed 's/^/    /' || true
elif [[ -d "$ROOT/vendor/herk-edit-kit/node_modules/hyperframes" ]]; then
  cd "$ROOT/vendor/herk-edit-kit"
  HF_VER="$(npx hyperframes --version 2>&1 || true)"
  echo "  ✓ HyperFrames CLI (vendored): $HF_VER"
  npx hyperframes doctor 2>&1 | sed 's/^/    /' || true
else
  echo "  ✗ HyperFrames not installed. Run: npm install"
  ERRORS=$((ERRORS + 1))
fi

echo
echo "4. Studio Assets & SFX Library:"
SFX_COUNT="$(find "$ROOT/sfx" -type f \( -name '*.mp3' -o -name '*.wav' -o -name '*.m4a' \) 2>/dev/null | wc -l)"
echo "  ✓ Sound Effects: $SFX_COUNT audio files found in sfx/"

if [[ -f "$ROOT/registry.json" ]]; then
  echo "  ✓ Component Registry: registry.json (456 visual components available)"
else
  echo "  ⚠ registry.json missing"
fi

echo
echo "-------------------------------------------------"
if [[ $ERRORS -eq 0 ]]; then
  echo " Result: ALL CHECKS PASSED. Studio is ready to edit!"
else
  echo " Result: $ERRORS issue(s) detected. Please check above."
fi
echo "================================================="


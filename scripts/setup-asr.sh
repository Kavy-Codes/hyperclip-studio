#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$ROOT/tools/whisper.cpp"
MODEL_DIR="$ROOT/.home/.cache/hyperframes/whisper/models"
MODEL="${1:-base.en}"
MODEL_FILE="$MODEL_DIR/ggml-$MODEL.bin"
JOBS="${JOBS:-4}"

command -v git >/dev/null || { echo "git is required." >&2; exit 1; }
command -v cmake >/dev/null || { echo "cmake is required." >&2; exit 1; }
command -v ffmpeg >/dev/null || { echo "ffmpeg is required." >&2; exit 1; }

mkdir -p "$ROOT/tools" "$MODEL_DIR"

if [[ ! -d "$SRC/.git" ]]; then
  echo "Cloning whisper.cpp..."
  git clone --depth 1 https://github.com/ggml-org/whisper.cpp.git "$SRC"
fi

if [[ ! -x "$SRC/build/bin/whisper-cli" && ! -x "$SRC/build/whisper-cli" ]]; then
  echo "Building whisper.cpp..."
  cmake -S "$SRC" -B "$SRC/build" -DCMAKE_BUILD_TYPE=Release -DWHISPER_BUILD_TESTS=OFF
  cmake --build "$SRC/build" --config Release -j "$JOBS"
fi

BIN=""
for candidate in "$SRC/build/bin/whisper-cli" "$SRC/build/whisper-cli"; do
  if [[ -x "$candidate" ]]; then BIN="$candidate"; break; fi
done
[[ -n "$BIN" ]] || { echo "Build finished but whisper-cli was not found." >&2; exit 1; }

if [[ ! -f "$MODEL_FILE" ]]; then
  echo "Downloading ggml-$MODEL.bin..."
  TMP="$MODEL_FILE.part"
  curl -L --fail --retry 3 --retry-delay 2 -o "$TMP" \
    "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-$MODEL.bin"
  mv "$TMP" "$MODEL_FILE"
fi

cat > "$ROOT/tools/asr.json" <<EOF
{
  "whisper": "$BIN",
  "model": "$MODEL_FILE",
  "modelName": "$MODEL",
  "home": "$ROOT/.home"
}
EOF

echo "ASR ready."
echo "  binary: $BIN"
echo "  model:  $MODEL_FILE"
echo "  home:   $ROOT/.home"
echo
echo "Test:"
echo "  node ./scripts/transcribe-clip.mjs --help"

#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

echo "================================================="
echo "   HyperClip Studio — Automated Setup & Installer "
echo "================================================="
echo

# 1. Check prerequisites
MISSING_PKGS=()

for pkg in node npm ffmpeg ffprobe git cmake curl; do
  if ! command -v "$pkg" >/dev/null 2>&1; then
    MISSING_PKGS+=("$pkg")
  fi
done

if [[ ${#MISSING_PKGS[@]} -gt 0 ]]; then
  echo "Error: Missing required system dependencies: ${MISSING_PKGS[*]}" >&2
  echo
  echo "Install them using your package manager:"
  echo "  Ubuntu/Debian:"
  echo "    sudo apt update && sudo apt install -y nodejs npm ffmpeg git cmake curl build-essential"
  echo "  macOS (Homebrew):"
  echo "    brew install node ffmpeg git cmake curl"
  echo "  Arch Linux:"
  echo "    sudo pacman -S nodejs npm ffmpeg git cmake curl base-devel"
  echo "  Fedora:"
  echo "    sudo dnf install -y nodejs npm ffmpeg git cmake curl gcc-c++ make"
  exit 1
fi

NODE_MAJOR="$(node -v | cut -d'.' -f1 | tr -d 'v')"
if [[ "$NODE_MAJOR" -lt 20 ]]; then
  echo "Warning: Node.js version is $(node -v). HyperClip Studio works best with Node.js >= 20."
fi

# 2. Install NPM dependencies
echo "1/4. Installing Node.js packages (HyperFrames 0.7.109, GSAP, Playwright)..."
npm install --no-fund --no-audit

# 3. Install Playwright browser binary for headless previews
echo
echo "2/4. Installing headless browser for AI Preview engine..."
npx playwright install chromium || echo "Playwright browser installed or fallback available."

# 4. Setup local Whisper ASR for automatic subtitles & speech sync
echo
echo "3/4. Setting up local Whisper speech recognition..."
if [[ -f "$ROOT/tools/asr.json" ]]; then
  echo "Local Whisper ASR is already configured."
else
  ./scripts/setup-asr.sh base.en
fi

# 5. Ensure working directories exist
mkdir -p "$ROOT/INBOX" "$ROOT/source" "$ROOT/projects" "$ROOT/exports"

# 6. Run diagnostics
echo
echo "4/4. Running system verification..."
./scripts/doctor.sh

echo
echo "================================================="
echo " 🎉 Installation Complete! HyperClip Studio is ready!"
echo "================================================="
echo
echo "Quickstart:"
echo "  1. Drop any video into INBOX/ or use a direct file path."
echo "  2. Run: ./edit.sh /path/to/video.mp4 --format portrait"
echo "  3. Fast AI preview: ./scripts/ai-preview.sh <slug>"
echo "  4. Check & render:  ./scripts/render-clip.sh <slug>"
echo

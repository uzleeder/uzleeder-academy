#!/usr/bin/env bash
# render-brand.sh — render-brand.ps1 ning macOS/Linux varianti.
# brand/ dagi HTML sahnalarni PNG'ga (headless Chrome) va cover videoni
# MP4'ga (kadrlar + ffmpeg) render qiladi.
# ---------------------------------------------------------------------------
# Ishga tushirish (loyiha papkasidan):
#     bash tools/render-brand.sh              # rasm + video
#     bash tools/render-brand.sh --no-video   # faqat rasmlar
#     bash tools/render-brand.sh --resume     # bor kadrlarni o'chirmasdan davom etish
#     JOBS=6 bash tools/render-brand.sh       # parallel Chrome soni (default 4)
#
# Chiqadi:
#     brand/out/cover-1920x1080.png
#     brand/out/thumb-1280x720.png
#     brand/out/cover-video-1920x1080.mp4   (8 s, 30 fps, H.264)
#
# Talab: Google Chrome (yoki Chromium / Edge). ffmpeg: PATH'da bo'lsa shu,
# bo'lmasa imageio-ffmpeg (binar bilan keladi) ~/.cache/uzleeder/venv ga
# o'zi o'rnatiladi — tizim Python'iga tegmaydi.
set -euo pipefail

NO_VIDEO=0; RESUME=0; FPS=30; SECONDS_=8
for a in "$@"; do case "$a" in
  --no-video) NO_VIDEO=1;; --resume) RESUME=1;;
  --fps=*) FPS="${a#*=}";; --seconds=*) SECONDS_="${a#*=}";;
  *) echo "noma'lum argument: $a" >&2; exit 2;;
esac; done
JOBS="${JOBS:-4}"

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BRAND="$ROOT/brand"; OUT="$BRAND/out"; FRAMES="$OUT/frames"
mkdir -p "$OUT"

# Chrome
CHROME=""
for c in "${CHROME_BIN:-}" \
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  "/Applications/Chromium.app/Contents/MacOS/Chromium" \
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge" \
  google-chrome chromium chromium-browser microsoft-edge; do
  [ -n "${c:-}" ] || continue
  if [ -x "$c" ]; then CHROME="$c"; break; fi
  if command -v "$c" >/dev/null 2>&1; then CHROME="$(command -v "$c")"; break; fi
done
[ -n "$CHROME" ] || { echo "Chrome/Chromium/Edge topilmadi (CHROME_BIN=... bilan ko'rsating)" >&2; exit 1; }

TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT

# Shot html w h png [#t=…] — har chaqiruv o'z profilida (parallel ishlash uchun)
shot() {
  local html="$1" w="$2" h="$3" png="$4" q="${5:-}"
  local prof; prof="$(mktemp -d "$TMP/prof.XXXXXX")"
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --virtual-time-budget=6000 --no-first-run --disable-sync --user-data-dir="$prof" \
    --window-size="$w,$h" --screenshot="$png" "file://$html$q" >/dev/null 2>&1
  rm -rf "$prof"
}

echo 'cover 1920x1080 ...'
shot "$BRAND/cover.html" 1920 1080 "$OUT/cover-1920x1080.png"
echo 'thumb 1280x720 ...'
shot "$BRAND/thumb.html" 1280 720 "$OUT/thumb-1280x720.png"

if [ "$NO_VIDEO" = 1 ]; then echo 'done (rasmlar)'; exit 0; fi

# ffmpeg
FFMPEG="$(command -v ffmpeg || true)"
if [ -z "$FFMPEG" ]; then
  VENV="${XDG_CACHE_HOME:-$HOME/.cache}/uzleeder/venv"
  if [ ! -x "$VENV/bin/python" ]; then
    echo "ffmpeg yo'q — imageio-ffmpeg o'rnatilmoqda ($VENV) ..."
    python3 -m venv "$VENV" && "$VENV/bin/pip" -q install imageio-ffmpeg
  fi
  FFMPEG="$("$VENV/bin/python" -c 'import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())')"
fi
[ -x "$FFMPEG" ] || { echo "ffmpeg topilmadi" >&2; exit 1; }

if [ "$RESUME" = 0 ]; then rm -rf "$FRAMES"; fi
mkdir -p "$FRAMES"
N=$(( SECONDS_ * FPS ))
echo "video: $N kadr ($FPS fps, $JOBS parallel) ..."

# Kadrlar ro'yxati: bor va to'liq (PNG, >0 bayt) bo'lganlarni tashlab ketamiz
todo=()
for ((i=0; i<N; i++)); do
  f="$FRAMES/$(printf 'f%04d.png' "$i")"
  if [ -s "$f" ]; then continue; fi
  todo+=("$i")
done
echo "  qolgan: ${#todo[@]} / $N"

export -f shot; export CHROME TMP FRAMES BRAND FPS
printf '%s\n' "${todo[@]}" | xargs -P "$JOBS" -I{} bash -c '
  i={}; t=$(python3 -c "print(round($i/$FPS,4))")
  shot "$BRAND/cover-video.html" 1920 1080 "$FRAMES/$(printf "f%04d.png" "$i")" "#t=$t"
  echo "  kadr $i (t=$t)"'

MP4="$OUT/cover-video-1920x1080.mp4"
"$FFMPEG" -y -loglevel error -framerate "$FPS" -i "$FRAMES/f%04d.png" \
  -c:v libx264 -pix_fmt yuv420p -crf 18 -preset slow -movflags +faststart "$MP4"
echo "done: $MP4"

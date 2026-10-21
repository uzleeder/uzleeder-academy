<#
  render-brand.ps1 — brand/ dagi HTML sahnalarni PNG'ga (headless Chrome) va
  cover videoni MP4'ga (kadrlar + ffmpeg) render qiladi.
  ---------------------------------------------------------------------------
  Ishga tushirish (loyiha papkasidan):
      powershell -ExecutionPolicy Bypass -File tools\render-brand.ps1            # rasm + video
      powershell -ExecutionPolicy Bypass -File tools\render-brand.ps1 -NoVideo   # faqat rasmlar

  Chiqadi:
      brand/out/cover-1920x1080.png
      brand/out/thumb-1280x720.png
      brand/out/cover-video-1920x1080.mp4   (8 s, 30 fps, H.264)  [-NoVideo bo'lmasa]

  Talab: Google Chrome (yoki Edge) o'rnatilgan; video uchun ffmpeg —
  `python -m pip install imageio-ffmpeg` (ffmpeg binar bilan keladi) yoki PATH'da ffmpeg.
#>
param([switch]$NoVideo, [int]$Fps = 30, [double]$Seconds = 8)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$brand = Join-Path $root 'brand'
$out = Join-Path $brand 'out'
New-Item -ItemType Directory -Force $out | Out-Null

$chrome = @('C:\Program Files\Google\Chrome\Application\chrome.exe', 'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe',
            'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe', 'C:\Program Files\Microsoft\Edge\Application\msedge.exe') | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $chrome) { throw 'Chrome/Edge topilmadi' }

$nul = Join-Path $env:TEMP 'uzla-chrome-err.txt'
function Shot([string]$html, [int]$w, [int]$h, [string]$png, [string]$query = '') {
  # Chrome stderr'ga yozadi ("N bytes written") — PowerShell 5.1 buni xato deb olmasin
  $url = 'file:///' + (($html -replace '\\', '/') -replace ' ', '%20') + $query
  # Yo'llarda bo'sh joy bor ("Max Miller") — argumentlar qo'shtirnoqda
  $args = @('--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', '--virtual-time-budget=6000', "--window-size=$w,$h", "--screenshot=`"$png`"", "`"$url`"")
  Start-Process -FilePath $chrome -ArgumentList $args -Wait -NoNewWindow -RedirectStandardError $nul
}

Write-Host 'cover 1920x1080 ...'
Shot (Join-Path $brand 'cover.html') 1920 1080 (Join-Path $out 'cover-1920x1080.png')
Write-Host 'thumb 1280x720 ...'
Shot (Join-Path $brand 'thumb.html') 1280 720 (Join-Path $out 'thumb-1280x720.png')

if ($NoVideo) { Write-Host 'done (rasmlar)'; exit 0 }

# ffmpeg
$ffmpeg = (Get-Command ffmpeg -ErrorAction SilentlyContinue).Source
if (-not $ffmpeg) { try { $ffmpeg = (python -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())" 2>$null).Trim() } catch {} }
if (-not $ffmpeg -or -not (Test-Path $ffmpeg)) { throw 'ffmpeg yo''q: python -m pip install imageio-ffmpeg' }

$frames = Join-Path $out 'frames'
if (Test-Path $frames) { Remove-Item $frames -Recurse -Force }
New-Item -ItemType Directory -Force $frames | Out-Null
$n = [int]($Seconds * $Fps)
$video = Join-Path $brand 'cover-video.html'
Write-Host "video: $n kadr ($Fps fps) ..."
for ($i = 0; $i -lt $n; $i++) {
  $t = [math]::Round($i / $Fps, 4)
  $png = Join-Path $frames ('f{0:D4}.png' -f $i)
  Shot $video 1920 1080 $png "#t=$t"
  if ($i % 30 -eq 0) { Write-Host ("  {0}/{1}" -f $i, $n) }
}
$mp4 = Join-Path $out 'cover-video-1920x1080.mp4'
Start-Process -FilePath $ffmpeg -ArgumentList @('-y', '-framerate', "$Fps", '-i', "`"$(Join-Path $frames 'f%04d.png')`"", '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'slow', '-movflags', '+faststart', "`"$mp4`"") -Wait -NoNewWindow -RedirectStandardError $nul
Write-Host "done: $mp4"

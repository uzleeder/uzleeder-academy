# UzLeeder Academy — brand assets

Personal Learning OS. Public LMS emas — "mening shaxsiy o'quv tizimim".
Uchala asset bitta identity'da: **UZLEEDER ACADEMY · Personal Learning OS ·
Learn → Practice → Master → Build · by UzLeeder**.

## Identity

| Token | Qiymat | Qayerda |
|---|---|---|
| Fon | `#070b14` (navy-qora), markazda `#0c1424` nurlanish | hamma asset |
| Aksent | `#4ec8d8` cyan, yorug'i `#8fe7f0` | belgi, "Leeder", nuqtalar, "by UzLeeder" |
| Matn | `#f2f7fb` oq, `#7f90aa` kumush | nom / ACADEMY, burchak yozuvlari |
| Shriftlar | Sora 800 (nom), Inter (matn), JetBrains Mono (HUD/oqim) | |
| Belgi | cyan gradient plita, qora o'sish chizig'i + nuqta | `logo-mark.svg`, `logo-lockup.svg` |
| Kayfiyat | dark · premium · minimal · HUD burchak qavslari · to'r · halqalar | "personal command center" |

Ranglar ilovadagi **Ocean** mavzusi bilan mos (`css/tokens.css`).

## Fayllar

| Fayl | Nima | O'lcham |
|---|---|---|
| `cover.html` → `out/cover-1920x1080.png` | Cover image — bosh sahifa / profil / prezentatsiya | 1920×1080 (16:9) |
| `thumb.html` → `out/thumb-1280x720.png` | Thumbnail — video va preview (kichikda ham o'qiladi: katta belgi, 2 qator) | 1280×720 (16:9) |
| `cover-video.html` → `out/cover-video-1920x1080.mp4` | Cover video — Academy ochilishi / prezentatsiya (8 s, 30 fps, H.264, ovozsiz) | 1920×1080 (16:9) |
| `logo-mark.svg`, `logo-lockup.svg` | Vektor logo (belgi; belgi + so'z) | istalgan |
| `brand.css` | Umumiy tokenlar va sahna uslublari | |

`cover-video.html` ni brauzerda ochsangiz — jonli ijro (loop). `#t=3.5` bilan — aynan o'sha soniyadagi kadr.

## Qayta render

Windows:
```
powershell -ExecutionPolicy Bypass -File tools\render-brand.ps1            # rasmlar + video
powershell -ExecutionPolicy Bypass -File tools\render-brand.ps1 -NoVideo   # faqat rasmlar
```
macOS / Linux:
```
bash tools/render-brand.sh              # rasmlar + video (4 ta Chrome parallel; JOBS=6 bilan ko'proq)
bash tools/render-brand.sh --no-video   # faqat rasmlar
bash tools/render-brand.sh --resume     # uzilib qolgan renderni bor kadrlardan davom ettirish
```

Talab: Chrome/Edge; video uchun ffmpeg (`python -m pip install imageio-ffmpeg` — binar bilan keladi;
Mac skripti ffmpeg topmasa buni `~/.cache/uzleeder/venv` ga o'zi o'rnatadi).
`brand/out/frames/` — oraliq kadrlar, deploy va repoga kirmaydi (`.vercelignore`, `.gitignore`).
Matn yoki rangni o'zgartirish — `brand.css` / HTML'da, keyin skriptni qayta ishga tushiring. Hech narsa qo'lda chizilmagan, hammasi koddan.

## Foydalanish

- YouTube: `thumb-1280x720.png` (thumbnail), `cover-video-1920x1080.mp4` (intro/outro).
- Prezentatsiya / sayt: `cover-1920x1080.png` (hero), `cover-video` (ochilish).
- Profil / social: `cover-1920x1080.png`; ikonka — `logo-mark.svg` (PNG kerak bo'lsa `img/icon-512.png`).

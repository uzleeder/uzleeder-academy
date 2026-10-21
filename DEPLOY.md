# UzLeeder Academy — deploy qo'llanmasi (2026-09-20)

Statik sayt + `api/` Vercel funksiyalari. Build yo'q. Node 24 (package.json `engines`).

## 1. Bir marta: asboblar
```bash
npm i -g vercel
vercel login
```

## 2. Sirlarni tayyorlash (parollar hech qayerda saqlanmaydi, faqat hash)
```bash
node tools/hash-password.js "OQUVCHI_PAROLI"      # → AUTH_PASSWORD_HASH
node tools/hash-password.js "NAZORATCHI_PAROLI"   # → CTRL_PASSWORD_HASH
node tools/hash-password.js "OQITUVCHI_PAROLI"    # → TEACHER_PASSWORD_HASH (ixtiyoriy rol)
node tools/hash-password.js "INGLIZ_OQITUVCHI"    # → ENG_PASSWORD_HASH (ixtiyoriy rol)
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"   # → SESSION_SECRET
```

## 3. Vercel → Settings → Environment Variables (Production + Preview)

| Nomi | Nima | Majburiy |
|---|---|---|
| `AUTH_USER` | o'quvchi logini (masalan `max`) | ha |
| `AUTH_PASSWORD_HASH` | `pbkdf2$210000$…` (2-qadam) | ha |
| `SESSION_SECRET` | base64 qator (2-qadam) | ha |
| Baza — bittasi: `DATABASE_URL`/`STORAGE_URL` (Neon Postgres, `postgres://…`) **yoki** `KV_REST_API_URL` + `KV_REST_API_TOKEN` (Upstash Redis) | progress, chat, nazorat holati | ha |
| `CTRL_USER` | nazoratchi logini (standart `controller`) | yo'q |
| `CTRL_PASSWORD_HASH` | nazoratchi paroli hash'i | nazoratchi roli uchun |
| `TEACHER_USER` / `TEACHER_PASSWORD_HASH` | o'qituvchi logini (standart `teacher`) va hash'i | o'qituvchi roli uchun |
| `ENG_USER` / `ENG_PASSWORD_HASH` | ingliz tili o'qituvchisi logini (standart `english`) va hash'i | english roli uchun |
| `SESSION_DAYS` / `STAFF_SESSION_DAYS` | sessiya muddati, kun (standart 90 / 30) | yo'q |
| `BLOB_READ_WRITE_TOKEN` | Vercel → Storage → **Blob** → Create → Connect (Production + Preview) | kino/video fayllari, ovoz yozuvlari, rasm havolalari **barcha qurilmada** bo'lishi uchun |

Baza: Vercel → Storage → Create Database → Neon (Postgres) yoki Upstash (Redis) → loyihaga ulang; kod o'zi aniqlaydi (`api/health` → `{ok, backend, db}`).

## 4. Deploy
```bash
cd uzleeder-academy
vercel          # birinchi marta: yangi loyiha, root ./, build sozlamalari o'zgartirilmaydi
vercel --prod   # production
```
Tekshirish: `https://<sayt>/api/health` → `ok: true`, `https://<sayt>/api/media` → `configured: true` (Blob bo'lsa).

## 5. Kirish
- BITTA login sahifasi: `https://<sayt>/login` — o'quvchi ham, xodimlar ham shu yerdan; rol serverdan aniqlanadi.
- O'quvchi: `AUTH_USER` + parol → ilova.
- Xodimlar: o'sha oyna → `controller` / `teacher` / `english` + o'z paroli → `/controller` paneli (rolga qarab tablar;
  `/staff`, `/teacher`, `/english` ham shu sahifa). Hash berilmagan rol mavjud emas — login 401.
- Parolni keyin ilova ichidan (Sozlamalar → Akkaunt) / panel ichidan almashtirsa bo'ladi — redeploy shart emas.

## 6. Keyingi o'zgarishlar
Faylni tahrirla → `index.html` va `controller.html` dagi `?v=…` versiyani oshir (kesh) → `vercel --prod`.

## Qayerda nima saqlanadi (halol)
| Ma'lumot | Joy |
|---|---|
| Progress, daftar matni, kino/loyiha metadata, sozlamalar, faollik jurnali | Baza (`uzla:state`), localStorage nusxa — barcha qurilmada |
| Chat, sessiyalar, topshiriqlar, feedback, writing/speaking tekshiruvi, bildirishnomalar, xodim eslatmalari | Faqat baza (`uzla:ctrl:*`, `uzla:chat:*`, `uzla:staff:*`) — mahalliy nusxada yo'q |
| Kino fayllari, thumbnail, loyiha/profil rasmlari, **ovoz yozuvlari** | Blob (token bo'lsa) — barcha qurilmada; token bo'lmasa IndexedDB — faqat shu qurilma |
| Sertifikat rasmlari (fayl) | Holat ichida (≤ 900 KB jami) — barcha qurilmada; havola bo'lsa — havoladan |

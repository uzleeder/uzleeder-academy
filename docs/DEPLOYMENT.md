# Deployment, environment, health checks and rollback

**Updated:** 25 November 2026 · Personal OS rebuild
**Applies to:** branch `academy-personal-os-revolution`

---

## 1. Which platform is authoritative?

The repository is wired for **both** Netlify and Vercel, and `npm run build`
produces one identical `dist/` for either. That is deliberate and it works — but
the brief asks for one authoritative strategy, so here is the evidence and the
recommendation.

| Evidence | Netlify | Vercel |
|---|---|---|
| Config in repo | `netlify.toml` (build, functions, edge gate, headers, `/staff` redirect) | `vercel.json` (build, cleanUrls, headers, `/staff` rewrite) |
| Auth gate | `netlify/edge-functions/auth.js` + `gate-source.js` | `middleware.js` |
| Serverless functions | `netlify/functions/gateway.mjs` routes into `api/**` | `api/*.js` routed natively |
| Local link state | `.netlify/` contains **built** edge functions, `functions-internal`, `v1/` — a real build has run | `.vercel/` contains only `project.json` (a link, no build output) |
| Site link in the footer | `uzleeder.netlify.app` | — |
| Media backend | `netlify/functions/media-store.mjs` (Netlify Blobs) | `api/media.js` (Vercel Blob) |
| Database selector | `ACADEMY_DATABASE=netlify` branch exists in `api/_lib.js` | generic `*_URL` discovery |

**Recommendation: Netlify is the production platform.** The local build output,
the dedicated `ACADEMY_DATABASE=netlify` code path and the footer domain all
point there; the Vercel link looks like a parallel deployment kept alive.

**Confirm it in one step before acting on this.** Run both and see which one
answers as the live site:

```powershell
curl.exe -s https://uzleeder.netlify.app/api/health; curl.exe -s https://uzleeder-academy.vercel.app/api/health
```

`/api/health` returns `{ ok, backend, db }`. The deployment that returns a
configured backend with your real database is the live one.

**Do not remove the second platform's config until that check is done.** Both
configurations are small, both are tested (`tools/middleware-test.mjs` and
`tools/netlify-test.mjs`), and keeping the loser as a cold standby costs
nothing. If you do decommission one:

- Netlify out: delete `netlify.toml`, `netlify/`, drop `netlify-test` from `npm test`.
- Vercel out: delete `vercel.json`, `middleware.js`, `.vercelignore`, `api/` stays (Netlify's gateway imports it), drop `middleware-test` from `npm test`.

---

## 2. Build

```powershell
npm run build
```

`build/site.cjs` copies an **explicit allowlist** into `dist/`:
`index.html`, `login.html`, `controller.html`, `404.html`, `error.html`,
`manifest.json`, `sw.js`, `css/`, `js/`, `img/`, `brand/` — with dotfiles and
`brand/out/frames`, `brand/out/tour` filtered out.

Everything else never reaches the browser: `api/`, `netlify/`, `server/`,
`middleware.js`, `tools/`, `docs/`, `.env*`.

Verified by `npm test` (`netlify-test` asserts the allowlist).

---

## 3. Environment variables

Secrets are read **only** from the environment. Nothing is committed; `.gitignore`
covers `.env*` and the audit confirmed zero `.env` files are tracked.

### Required

| Name | What | Notes |
|---|---|---|
| `AUTH_USER` | learner login name | e.g. `max` |
| `AUTH_PASSWORD_HASH` | `pbkdf2$210000$<salt b64>$<hash b64>` | generate with `node tools/hash-password.js "<password>"` |
| `SESSION_SECRET` | 32+ random bytes, base64 | `node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"` |
| **One** database | `DATABASE_URL` / `STORAGE_URL` / `POSTGRES_URL` / `NEON_DATABASE_URL` (a `postgres://` value) **or** `KV_REST_API_URL` + `KV_REST_API_TOKEN` | holds the password hash, the login name and the (now optional) cloud state copy |

On Netlify, set `ACADEMY_DATABASE=netlify` to pin the database to Netlify's own
`NETLIFY_DB_URL` and stop `api/_lib.js` falling back to any other Postgres
address it finds in the environment.

### Optional

| Name | What | Default |
|---|---|---|
| `SESSION_DAYS` | learner session lifetime, days | 90 |
| `STAFF_SESSION_DAYS` | controller session lifetime | 30 |
| `CTRL_USER` / `CTRL_PASSWORD_HASH` | controller panel login | controller panel disabled without it |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob, for the legacy media path | not needed if you run the self-hosted server |
| `MEDIA_ORIGIN` | your site's origin, for the self-hosted media server's CORS | — |

### Self-hosted media server (separate process, see `docs/MEDIA-SERVER.md`)

| Name | What |
|---|---|
| `MEDIA_OWNER` | owner key — upload, delete, backup |
| `MEDIA_READER` | reader key — streaming only |
| `MEDIA_ROOT` | storage directory (default `./media-data`) |
| `MEDIA_PORT` | port (default 8787) |
| `MEDIA_QUOTA` | byte ceiling (default 50 GB) |

The server refuses to start if `MEDIA_OWNER` or `MEDIA_READER` is missing, or if
the two are equal.

---

## 4. Deploy

### Netlify

```powershell
npm i -g netlify-cli; netlify deploy --build --prod
```

Environment variables: Site configuration → Environment variables → set the
required table above for **Production** and **Deploy previews**.

### Vercel

```powershell
npm i -g vercel; vercel --prod
```

Environment variables: Project → Settings → Environment Variables → Production
and Preview.

---

## 5. Production health checks

Run these after every deploy. They need no credentials except where noted.

```powershell
curl.exe -s https://<your-domain>/api/health
```

Expect `{ "ok": true, "backend": "<postgres|redis>", "db": true }`. A `500` with
`{"error":"env","missing":[...]}` names the variables that are not set.

```powershell
curl.exe -s -o NUL -w "%{http_code}`n" https://<your-domain>/
```

Expect **302** to `/login` when you are not signed in — that is the edge gate
doing its job. A **200** here would mean the site is serving content without a
session, which is a security failure.

```powershell
curl.exe -s -o NUL -w "%{http_code}`n" https://<your-domain>/js/store.js
```

Expect **401**. Static assets are gated too; a 200 means the gate is bypassed.

```powershell
curl.exe -s -o NUL -w "%{http_code}`n" https://<your-domain>/login
```

Expect **200** — the login page is on the open allowlist by necessity.

In the browser, signed in, open DevTools → Network and use the app normally for
a minute. **There must be no request to `/api/state`.** That is the local-first
guarantee, and `tools/no-upload-test.cjs` asserts it in CI.

---

## 6. Rollback

### The deployment

Both platforms keep immutable previous deploys.

- **Netlify:** Deploys → pick the last good deploy → *Publish deploy*.
- **Vercel:** Deployments → pick the last good one → *Promote to Production*.

Rolling back the deployment does **not** touch learner data: personal records
live in the browser, not in the bundle.

### The code

```powershell
git revert <commit>
```

The rebuild is additive. Reverting the Personal OS commits restores the old
16-entry navigation and the old theme, because:

- no page module was deleted — `js/pages/*.js` are all still there and still routed;
- `renderNav()` keeps the original sidebar code and uses it when `OS.shell` is absent;
- `index.html` only *adds* `css/os.css` and `js/os/*`;
- schema v10 changed appearance only, so progress survives either direction.

### The data

Three independent restore paths, strongest first:

1. **ZIP or JSON backup** — Vault → Backup → import, which validates, previews,
   detects duplicates, merges and rolls back on failure.
2. **Automatic local snapshots** — every schema migration and every IndexedDB
   migration writes `uzla.state.backup.*` into localStorage first. Vault → Backup
   lists them.
3. **Cloud copy** — if the account ever synced, `Sync.importOnce()` (Vault →
   Security → *Import the cloud copy once*) pulls it down and **merges**; it
   never overwrites silently, and it is a `GET` only.

### The IndexedDB migration

`OS.migrate.run()` never deletes the localStorage state. If verification fails it
reports the mismatches and writes nothing to the app. To undo a completed
migration: `OS.migrate.rollback('<backup key>')` clears the object stores and
restores the snapshot.

---

## 7. Backup strategy

| What | Where it lives | How it is backed up | Who does it |
|---|---|---|---|
| Personal learning records | the learner's browser (localStorage now, IndexedDB after migration) | Vault → Backup → **JSON** (structured) or **ZIP** (structured + manifest + files + CRC32) | the learner, on a schedule they choose |
| Large personal files | OPFS / IndexedDB on the device | included in the ZIP export | the learner |
| Shared course material | the self-hosted media server's `MEDIA_ROOT` | copy the directory; verify with `GET /backup/verify` | the owner |
| Credentials | environment variables only | your password manager | the owner |
| Content and code | this git repository | git | — |

**Browser storage is not permanent.** Vault → Data offers
`navigator.storage.persist()` and shows the current usage and quota. Take a
backup before any browser cleanup, profile reset or device change.

Recommended cadence: a JSON export weekly, a ZIP export before each mission
phase boundary (30 Nov, 31 Jan, 19 Feb) and before the exam.

---

## 8. What the test suite covers

`npm test` runs 15 suites, 611 assertions, exit 0 required:

`os-test` · `no-upload-test` · `media-server-test` · `api-test` · `storage-test` ·
`middleware-test` · `netlify-test` · `mission-test` · `pyai-engine-test` ·
`jobready-test` · `pyai-test` · `audit-english` · `schedule-migration-test` ·
`validate-schedule` · `validator-negative-test`

The three added by this rebuild:

- **`os-test`** — the central calendar (dates, 86-day window, 19-day final
  phase, target 7.5, no guarantee), the 8-destination IA, every legacy redirect,
  every deep route that must stay put, the migration plan with record counts,
  ids and timestamps, and the backup format including CRC32 and ZIP headers.
- **`no-upload-test`** — loads the real `js/sync.js`, spies on `fetch`, performs
  seven kinds of learning activity, waits past the old 1.5 s push delay, fires
  `visibilitychange`, `pagehide` and `online`, and asserts **zero** network
  requests. It then enables sync deliberately and asserts a request *does* go
  out, so the test cannot pass by accident.
- **`media-server-test`** — starts the real server, exercises auth, permissions,
  upload, type rejection, quota, streaming, four Range forms, 416 handling,
  backup manifest, corruption detection and deletion, and asserts there is no
  endpoint that accepts learning progress.

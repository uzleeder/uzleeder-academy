# Self-hosted resource server

**File:** `server/media-server.mjs` · **Test:** `tools/media-server-test.mjs`
**Dependencies:** none — Node standard library only.

---

## Why it exists

Shared course material (videos, book PDFs, audio) has to be available on every
device. Personal learning records must not be. Putting both in the same place is
what the audit flagged as the core privacy problem, so they are separated:

- **Shared material** → this server, which you own and run.
- **Personal records** → the learner's device (IndexedDB / OPFS).

**This server has no endpoint that accepts learning progress.** Not one. The
test suite asserts that `POST /state`, `/api/state`, `/progress`, `/sync`,
`/learner` and `/records` all return 404, and that the source contains no
learning-state handling.

---

## Setup

### 1. Generate two keys

```powershell
node -e "const c=require('crypto');console.log('MEDIA_OWNER=' +c.randomBytes(24).toString('hex'));console.log('MEDIA_READER='+c.randomBytes(24).toString('hex'))"
```

The owner key uploads, deletes and backs up. The reader key only streams. They
must differ — the server refuses to start otherwise, and it refuses to start
with either key missing. An open media server is worse than no media server.

### 2. Run it

```powershell
$env:MEDIA_OWNER="<owner key>"; $env:MEDIA_READER="<reader key>"; $env:MEDIA_ROOT="D:\academy-media"; npm run media
```

It prints the address, the storage directory and the quota.

### 3. Put it behind TLS

The server speaks plain HTTP and binds whatever interface Node gives it. **Do
not expose it directly.** Terminate TLS in front of it — Caddy is two lines:

```
media.example.com {
    reverse_proxy 127.0.0.1:8787
}
```

nginx equivalent: `proxy_pass http://127.0.0.1:8787;` plus
`proxy_set_header Range $http_range;` and `proxy_buffering off;` so range
requests and streaming pass through untouched.

### 4. Let the site reach it

Set `MEDIA_ORIGIN` to your site's origin so the server sends the matching CORS
headers:

```powershell
$env:MEDIA_ORIGIN="https://uzleeder.netlify.app"
```

With `MEDIA_ORIGIN` unset no CORS headers are sent at all, which is the right
default for a server you only call from the same host.

---

## API

Every route except `/health` requires `Authorization: Bearer <key>`.

| Route | Method | Role | What |
|---|---|---|---|
| `/health` | GET | none | liveness only — no data, no counts |
| `/list[?folder=]` | GET | reader | file metadata; a reader never sees files marked `shared: false` |
| `/usage` | GET | reader | files, bytes, quota, free, per-folder breakdown |
| `/upload` | POST | **owner** | streaming upload; headers `X-File-Name`, `X-File-Type`, optional `X-Folder`, optional `X-Shared: false` |
| `/file/<id>` | GET / HEAD | reader | streaming with Range support |
| `/file/<id>` | DELETE | **owner** | removes the file and its metadata |
| `/backup/manifest` | GET | **owner** | id, name, folder, size, SHA-256 for every file |
| `/backup/verify` | GET | **owner** | re-hashes every file and reports mismatches |

### Upload example

```powershell
curl.exe -X POST "https://media.example.com/upload" -H "Authorization: Bearer $env:MEDIA_OWNER" -H "X-File-Name: Reading Explorer 4.pdf" -H "X-File-Type: application/pdf" --data-binary "@D:\books\re4.pdf"
```

Returns `{ id, name, type, folder, size, sha256, shared, at }`.

### Streaming

`GET /file/<id>` supports all four Range forms and is what makes video seeking
work:

| Request | Response |
|---|---|
| no Range | `200`, `Content-Length`, `Accept-Ranges: bytes` |
| `bytes=10-19` | `206`, `Content-Range: bytes 10-19/<size>` |
| `bytes=100-` | `206` to end of file |
| `bytes=-500` | `206`, last 500 bytes |
| out of range | `416` with `Content-Range: bytes */<size>` |

Responses carry `Cache-Control: private`, `X-Content-Type-Options: nosniff`, a
weak `ETag` from the content hash and `Content-Disposition: inline`.

---

## Organisation, limits and permissions

- Files are sorted into `video`, `audio`, `pdf`, `image`, `other` by content
  type, or by an explicit `X-Folder` header.
- Only a fixed allowlist of content types is accepted; anything else is `415`.
  There is no executable type on that list.
- `MEDIA_QUOTA` caps total storage. An upload that would exceed it is aborted
  mid-stream and the partial file is deleted, so a rejected upload leaves
  nothing behind (`507`).
- `X-Shared: false` marks a file owner-only: a reader gets `403` on the file and
  does not see it in `/list` at all.
- Keys are compared with `crypto.timingSafeEqual`.
- Ids are 128 random bits and are validated against `^[0-9a-f]{32}$` before any
  path is built, so a request can never escape the storage directory.

---

## Backup and restore

**Backup** is a directory copy. `MEDIA_ROOT` holds everything:

```
MEDIA_ROOT/
  files/<folder>/<id>      the bytes
  meta/<id>.json           name, type, folder, size, sha256, shared, at
```

```powershell
robocopy D:\academy-media E:\backup\academy-media /MIR
```

**Verify** before you trust a backup, and after any restore:

```powershell
curl.exe -s "https://media.example.com/backup/verify" -H "Authorization: Bearer $env:MEDIA_OWNER"
```

Returns `{ ok, checked, problems }`. Every file is re-hashed and compared with
its recorded SHA-256; a corrupted or missing file is named, not glossed over.
The test suite proves this by deliberately corrupting a file and asserting it is
caught.

**Restore** is the reverse copy plus a restart. Ids, names, folders and checksums
all live in `meta/`, so nothing else needs to be rebuilt.

**Monitor** with `/usage` — it reports bytes used, the quota, free space and the
per-folder split.

---

## What this server deliberately does not do

- It does not store, accept or forward learning progress.
- It does not authenticate against the Academy's session cookie — it has its own
  keys, so a stolen site session cannot reach your media library and vice versa.
- It does not transcode, resize or index content.
- It does not log request bodies.
- It does not call out to any third party.

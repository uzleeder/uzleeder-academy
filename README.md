# UzLeeder Academy — Personal OS

Personal learning operating system for the IELTS Academic mission ending
**19 February 2027** (exam **20 February 2027**, target **7.5 overall**) and the
Python & AI Engineering pathway.

Static site, no framework, no build step beyond an allowlist copy. Personal
learning records belong to the learner's device.

## Run it

```powershell
python -m http.server 2000 --bind 127.0.0.1
```

Then open http://localhost:2000/ — or open `index.html` directly; it works from
`file://` too.

## Commands

| Command | What |
|---|---|
| `npm run build` | package `dist/` from the allowlist in `build/site.cjs` |
| `npm test` | 15 suites, 617 assertions |
| `npm run media` | start the self-hosted resource server (`server/media-server.mjs`) |

## The eight destinations

Command Center · Mission Planner · Learning Studios (IELTS + Coding) ·
Review Lab · Knowledge Library · Insights · Projects & Portfolio ·
Settings & Data Vault

Every legacy route still resolves: 36 redirect, 19 render in place, and
`#/classic/<route>` opens any original page directly.

## Documentation

| Document | What |
|---|---|
| [`docs/PERSONAL-OS.md`](docs/PERSONAL-OS.md) | architecture, what changed, definition of done |
| [`docs/PERSONAL-OS-AUDIT.md`](docs/PERSONAL-OS-AUDIT.md) | the Phase 0 audit this rebuild was based on |
| [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) | deployment, environment variables, health checks, rollback, backup strategy |
| [`docs/MEDIA-SERVER.md`](docs/MEDIA-SERVER.md) | the self-hosted resource server |
| [`docs/AI-POLICY.md`](docs/AI-POLICY.md) | AI is optional, local-first, and currently absent |

## Data ownership

- Automatic cloud sync is **off**. Learning activity sends nothing;
  `tools/no-upload-test.cjs` proves it, with a control case so it cannot pass by
  accident.
- Backups: JSON and ZIP from Settings & Data Vault, with checksums and a file
  manifest. Neither contains a password, cookie or session.
- Shared course material lives on a server you own, which has no endpoint that
  accepts learning progress.

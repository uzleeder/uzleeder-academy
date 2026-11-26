# Personal OS — Repository Audit (Phase 0)

**Repository:** uzleeder/uzleeder-academy
**Branch:** `academy-personal-os-revolution`
**Audit date:** 25 November 2026
**Baseline:** `npm test` passes (exit 0) on `main` at commit `1b7be1e`, clean tree, before any change.

This document records what exists **today**, measured from the source files — not from
documentation, comments or memory. Every count below was produced by loading the real data
files in Node in the same order `index.html` loads them. No feature, lesson count or score is
estimated.

---

## 1. Existing features

### 1.1 Application shell

| Piece | File | Notes |
|---|---|---|
| Hash router + shell | `js/app.js` (1095 lines) | `ROUTES` table + `parseRoute()` with ~40 hand-written sub-route patterns |
| Global state | `js/store.js` (817 lines) | Single localStorage key `uzla.state`, schema v9, versioned migrations |
| Cloud sync | `js/sync.js` (349 lines) | Automatic full-state push/pull against `/api/state` |
| Theming | `js/app.js` `App.THEMES` | 8 themes, `dark` (Bold Red) is the default identity |
| i18n | `js/i18n.js` (196 KB) + `js/i18n-2026.js` | UZ/EN, key-based `tr()` |
| Icons | `js/icons.js` | Inline SVG sprite object `IC` |
| Search / command palette | `js/search.js` | Ctrl-K overlay, already exists |
| Offline | `sw.js` + `manifest.json` | PWA install + service worker cache |
| Intro splash | inline in `index.html` | Real script-load progress, not a fake timer |

### 1.2 Learning engines (original, substantial, worth preserving)

| Engine | File | Size | What it does |
|---|---|---|---|
| IELTS Mission | `js/mission.js` | 82 KB | Phase/day planning, workload modes, skill routing |
| Mission runner | `js/pages/mission-run.js` | 82 KB | Day execution, block logging, evidence capture |
| Python & AI path | `js/pyai.js` + `js/pages/pyai.js` | 64 KB | Module/lesson engine, legacy id mapping |
| Job Ready | `js/jobready.js` | — | Evidence-based career readiness scoring |
| SRS | `js/srs2.js` | — | Spaced repetition scheduler |
| Quiz | `js/quiz.js` | — | Question rendering, scoring, mistake capture |
| Python runner | `js/pyrunner.js`, `js/playground.js` | — | In-browser Python execution |
| Generator | `js/gen.js` | 62 KB | Practice/question generation |
| Habit & schedule | `js/habit.js`, `js/data/habit.js` | — | Daily block schedule, 4 day templates, validator-backed |
| Prayer times | `js/prayer.js` | — | Computed prayer anchors (Hanafi, Tashkent defaults) |
| Certificate | `js/certificate.js` | — | Certificate rendering |
| Focus / session timer | `js/focus.js` | — | Measured study minutes |
| Goal / roadmap | `js/goal.js`, `js/goalmap.js` | — | Goal tracking, debt days |

### 1.3 Measured content volume (counted from source, 25 Nov 2026)

| Content | Real count |
|---|---|
| Python course days (`COURSE`) | **30** |
| Python quiz questions | **300** |
| English/IELTS day entries (`ENG_DAYS_1…6`) | **144** (`d` = 1…144) |
| …but `ENGLISH.meta.days` declares | **108** active days, 16 weeks |
| Grammar topics (`ENG_GRAMMAR`) | **44** |
| Vocabulary units (`ENG_VOCAB`) | **18** units, **182** words |
| Reading sets (`ENG_READING_1…4`) | 4 + 6 + 6 + 8, plus `ENG_READING_EXT` |
| Religious reading (`ENG_READ_REL_1/2`) | 6 + 18 |
| History reading (`ENG_READ_HIST_1/2`) | 6 + 18 |
| Listening sets (`ENG_LISTENING_1/2`) | 4 + 6 |
| Dictation tests (`ENG_DICT`) | 3 |
| Speaking 30 (`SPEAK30.days`) | **30** |
| Quick Repeat (`QUICK10.days`) | **10** |
| Python & AI (`PYAI`) | **10 modules, 46 lessons** |
| DataCamp (`DCTRACK`) | **4 courses, 13 chapters** |
| Practical projects (`PROJECTS.list`) | **6** |
| Deep-dive notes (`DEEP`) | 30 |
| Explanations (`EXPLAIN`) | 30 |
| Duas (`DUAS`) | 4 sets |

> **Finding 1 (content):** the 144-day English dataset and the 108-day active schedule
> disagree. Both are real; the 144 entries are the older full curriculum, the 108 is the
> current calendar window. Neither should be deleted — see §10.

### 1.4 Backend

| Endpoint | File | Purpose |
|---|---|---|
| `POST /api/login` | `api/login.js` | PBKDF2 verify, then signed session cookie |
| `POST /api/logout` | `api/logout.js` | Clears cookie |
| `POST /api/password` | `api/password.js` | Change password (verifies current) |
| `POST /api/username` | `api/username.js` | Change login name |
| `GET/PUT /api/state` | `api/state.js` | **Full personal state in the cloud** (rev-based optimistic lock) |
| `GET /api/health` | `api/health.js` | Health probe |
| `GET /api/bbc` | `api/bbc.js` | BBC resource proxy |
| `GET /api/media` | `api/media.js` | Media access |
| `/api/ctrl/*` | `api/ctrl/[fn].js` + `api/_ctrl-*.js` | Controller (staff) panel: login, state, io, password |
| Shared lib | `api/_lib.js` | PBKDF2, HMAC session, Postgres/Redis store abstraction |

Edge protection: `middleware.js` (Vercel) and `netlify/edge-functions/auth.js` +
`gate-source.js` (Netlify) gate the **entire** site behind the session cookie, with a small
open-path allowlist (`/login`, `/api/login`, `/api/health`, PWA icons, error pages,
controller, the login tour video).

### 1.5 Tests that exist today (all passing)

`npm test` runs 12 suites in sequence:
`api-test` · `storage-test` · `middleware-test` · `netlify-test` · `mission-test` ·
`pyai-engine-test` · `jobready-test` · `pyai-test` · `audit-english` ·
`schedule-migration-test` · `validate-schedule` · `validator-negative-test`.

The schedule validator alone checks 109 days against 16 rules, plus 21 negative tests.
**This suite is an asset and must keep passing.**

---

## 2. Existing routes

Parsed from `js/app.js` `ROUTES` + `parseRoute()`.

### 2.1 Table routes (simple `#/name`)

`dashboard` · `habit` · `course` · `python` · `placement` · `english` · `speaking` ·
`writing` · `books` · `datacamp` · `quick` · `jobready` · `career` · `settings` ·
`profile` · `today` · `dua` · `week` · `practice` · `projects` · `analytics` ·
`weekly` · `monthly` · `movies`

### 2.2 Parameterised / pattern routes

`lesson/:day` · `english/:day` (incl. `i1`…`i4`) · `habit/:date` · `writing/:week` ·
`bbc/:series` · `dua/:set` · `week/:from` · `copy/:kind` · `copy/free` · `copy/free/:id` ·
`datacamp/:n` · `quick/:n` · `quick/test` · `practice/:src` · `movies/:id` ·
`eng-skill/:key` · `books/reading|ebook|religious|history|listen|vocab|dest|ess4` ·
`books/dest/:num/:sec` · `books/dict/:t/:e` · `books/ra|s1[/read/:page]` ·
`books/v:n|r:n|d:n|t:n|l:n` · `cheatsheet[/grammar|vocab]` · `flash[/etch]` ·
`review[/mistakes]` · `notes[/saved|free]` · `roadmap[/goal|plan]` ·
`comm/:tab/:sub` · `mission/*` · `pyai/*`

### 2.3 Already-aliased legacy routes (the codebase has done this before — good precedent)

`eng-grammar`→`cheatsheet/grammar` · `eng-vocab`→`cheatsheet/vocab` · `etch`→`flash/etch` ·
`mistakes`→`review/mistakes` · `saved`→`notes/saved` · `goal`→`roadmap/goal` ·
`plan`→`roadmap/plan` · `chat`→`comm/messages` · `assignments`→`comm/assignments` ·
`notifications`→`comm/notifications`

### 2.4 Current sidebar navigation (6 groups, 16 entries)

- **HOME:** dashboard, today, week, dua, habit, comm
- **LEARN:** course, books, movies, notes
- **PRACTICE:** practice, review, flash, cheatsheet
- **DEV:** roadmap, analytics
- **CAREER:** projects, career

> **Finding 2 (navigation):** 16 primary entries over 6 groups, several of which open hubs
> that themselves contain tabs. The learner has to know the hierarchy to find anything.

### 2.5 Non-SPA pages

`login.html` · `controller.html` (staff, also at `/staff`) · `404.html` · `error.html` ·
`brand/cover.html`, `brand/cover-video.html`, `brand/thumb.html`

---

## 3. Existing data sources

### 3.1 Browser state — one localStorage key, `uzla.state` (schema v9)

Top-level groups: `lang` `theme` `name` `scores` `best` `notes` `mistakes` `activity`
`plan` `eng{done,tasks,scores,notes}` `habit` `habitLegacy` `scheduleVersion` `blockLog`
`speak` `bbc` `hours` `read` `profile{bio,title,certs,photo,projects}` `city` `movies`
`rdimg` `copy{vocab,english,coding,free}` `quiz` `review` `last` `bookmarks` `done`
`sessions` `events` `settings{…}` — plus `mission` and `pyai` sub-states added in 2026-10.

Separate key: `uzla.sync` (sync meta — deliberately outside the synced state).

### 3.2 Binary / large data

IndexedDB is **already used** (ad hoc) for movie files, reading-text images and notebook
audio. There is no single data-access layer for it.

### 3.3 Content data (read-only, shipped with the site)

52 files under `js/data/`, ~2.0 MB, loaded as classic scripts into globals
(`COURSE`, `ENGLISH`, `ENG_*`, `PYAI`, `DCTRACK`, `SPEAK30`, `QUICK10`, `MISSION_CFG`,
`PHASES`, `PROJECTS`, `ROADMAP`, `MASTERPLAN`, `HABIT`, `DUAS`, `DEEP`, `EXPLAIN`, …).

### 3.4 Server data

Key-value store behind `api/_lib.js` — Neon Postgres (HTTP SQL) **or** Upstash/Netlify Redis,
chosen by environment variables. Keys in use: `uzla:state`, `uzla:auth:hash`,
`uzla:auth:user`, plus controller keys.

---

## 4. Features to preserve (do not touch the logic)

1. **All 52 content data files.** Python 30 days / 300 questions, 144 English day entries,
   44 grammar topics, 182 vocabulary words, 46 PyAI lessons, 13 DataCamp chapters,
   30 Speaking days, 6 projects.
2. **Mission engine** (`js/mission.js`, `js/pages/mission-run.js`) — phases, workload modes,
   block logging with `done | partial | skipped`, evidence capture.
3. **Schedule engine and its validator** (`js/habit.js`, `js/data/habit.js`,
   `tools/validate-schedule.cjs`, `tools/validator-negative-test.cjs`). 16 rules, 21 negative
   tests. The "no punishment / debt accumulation" rule the brief asks for is **already**
   honoured here — `blockLog` is measurement, not penalty.
4. **SRS** (`js/srs2.js`) and the **Error Log** four-column structure
   (`Store.addMistake(day, qi, chosenText, correctText, questionText)` → module/test,
   my answer, correct answer, why).
5. **Authentication**: PBKDF2-SHA256 (210k iterations), HMAC-SHA256 signed session cookie,
   HttpOnly, configurable expiry (`SESSION_DAYS`, default 90), `timingSafeEqual` compare,
   rate limiting, edge gate on both platforms. **Audited as sound — keep.**
6. **Store migration machinery** — versioned, documented, with legacy-key import.
7. **PWA / offline** (`sw.js`, `manifest.json`).
8. **i18n UZ/EN** — the learner uses both.
9. **The existing 12-suite test run.**

---

## 5. Features to merge

| Merge into | From these existing destinations |
|---|---|
| **Command Center** | `dashboard` (plus the "continue" / `last` tracker, streak pill, progress ring) |
| **Mission Planner** | `today`, `week`, `habit`, `habit/:date`, `roadmap`, `roadmap/goal`, `roadmap/plan`, `dua` (as optional routine), Mission planning views |
| **Coding Studio** | `course` (coding half), `python`, `lesson/:day`, `datacamp`, `datacamp/:n`, `pyai/*`, `jobready`, `placement`, `quick`, `quick/:n` |
| **IELTS Studio** | `english`, `english/:day`, `eng-skill/:key`, `speaking`, `writing`, `writing/:week`, `bbc/:series`, Mission skill views |
| **Review Lab** | `practice`, `practice/:src`, `review`, `review/mistakes`, `mistakes`, `flash`, `flash/etch`, `etch`, `cheatsheet[/grammar|vocab]`, `eng-grammar`, `eng-vocab` |
| **Knowledge Library** | `books` and all `books/*`, `bbc`, `movies`, `movies/:id`, `notes`, `notes/saved`, `saved`, `copy/*` |
| **Insights** | `analytics`, `weekly`, `monthly` |
| **Projects & Portfolio** | `projects`, `career` |
| **Settings & Vault** | `settings`, `profile` |

---

## 6. Features to remove from active navigation (archive, do not delete)

1. **`comm` / `chat` / `assignments` / `notifications`** — the controller/communication
   system: `controller.html`, `api/ctrl/*`, `js/ctrl.js`, `js/staff.js` (54 KB).
   The audit finds **no evidence of an active second party**: there is one `AUTH_USER`,
   the brief describes a single learner, and the controller has its own separate login.
   → Remove from learner navigation, keep `/staff` reachable, keep the code.
2. **`dua`** — becomes an optional routine inside Mission Planner, not a primary destination.
3. **`career`** — folds into Projects & Portfolio as a secondary tab.
4. **`movies`** — folds into Knowledge Library as optional English media.
5. **`week`, `today`, `habit`** as separate entries — they are three views of one calendar.

---

## 7. Obsolete code candidates (evidence required before deletion)

| Candidate | Evidence | Recommendation |
|---|---|---|
| `js/pages/chat.js`, `js/staff.js`, `js/ctrl.js`, `controller.html`, `api/_ctrl-*.js`, `api/ctrl/[fn].js` | Single-user product; no second account configured | Archive from learner nav; keep deployable. **Do not delete** — `/staff` may be in use |
| `js/pages/etch.js` | Already aliased into `flash/etch` | Keep — it is the implementation |
| `js/pages/books2.js`, `books3.js` | Split of one page, 69 KB plus two more | Keep; candidate for later consolidation |
| `js/data/dual.js`, `masterplan.js`, `roadmap.js`, `plan.js` | Four overlapping planning datasets | Keep the data; unify at the **presentation** layer only |
| `api/bbc.js` | Proxy for BBC content | Verify at deploy time; keep |
| `brand/out/frames/*`, `brand/out/tour/*` | ~115 MB of intermediate render frames | Already git-ignored and build-excluded. Leave on disk |

**No file is deleted in this rebuild.** Superseded page modules stay on disk and stay
reachable through the legacy-route compatibility layer.

---

## 8. Security concerns

| # | Finding | Severity | Status |
|---|---|---|---|
| S1 | **`/api/state` receives the learner's entire personal record** — every quiz attempt, note, mistake, activity event, schedule log and profile field — automatically, 1.5 s after any change, again on every tab focus, and again on `pagehide` via a `keepalive` beacon. No consent, no indication, no opt-out. | **High (privacy)** | **To fix** — this is the core architectural change the brief demands |
| S2 | Third-party database: that state lands in Neon Postgres or Upstash/Netlify Redis depending on environment. Private learning history leaves the device by default. | **High (privacy)** | To fix with S1 |
| S3 | `Store.exportJSON()` serialises the **whole** state including settings and profile; `Store.importJSON()` does a raw replace with no validation, preview, duplicate detection or rollback. | Medium | To fix |
| S4 | Password hashing, session signing, cookie flags, rate limiting, timing-safe compare — **reviewed, correct.** `SESSION_DAYS` default 90 is reasonable. | — | Keep as is |
| S5 | Secrets are environment-only; `.gitignore` covers `.env*`; `build/site.cjs` ships an explicit allowlist so `api/`, `netlify/`, `middleware.js` and `tools/` never reach `dist/`. **Verified: 194 tracked files, zero `.env*`, zero `dist/`.** | — | Keep as is |
| S6 | Two auth gates (Vercel `middleware.js`, Netlify edge `auth.js`) share logic through `gate-source.js` but are maintained separately. Drift risk. | Low | Covered by `middleware-test` and `netlify-test` |
| S7 | `login.html` is 31 KB with inline logic; it is on the open allowlist by necessity. | Low | No action |

---

## 9. Storage architecture problems

| # | Problem | Impact |
|---|---|---|
| A1 | **Everything in one localStorage key.** The whole state is `JSON.parse`d on boot and `JSON.stringify`d on every write. `Store.bytes()` exists precisely because the author already felt the ~5 MB per-origin ceiling. | Hard growth ceiling; whole-state rewrite per keystroke |
| A2 | **No query capability.** "Which mistakes are due this week?" means loading and scanning the whole object. | Insights and Review Lab cannot scale |
| A3 | **Ad-hoc IndexedDB.** Movies, reading images and notebook audio already use IndexedDB, each with its own code path, outside `Store`. | No single data-access layer, no shared migration, no storage accounting |
| A4 | **Mixed concerns.** Device preferences (`lang`, `theme`, `settings`) live in the same blob as personal records — and `sync.js` has to special-case them out on every pull. The special-casing is the symptom. | Fragile |
| A5 | **No storage-permanence handling.** Browser storage can be evicted; there is no `navigator.storage.persist()` call and no backup reminder. | Silent total data loss is possible |
| A6 | **Dates are hard-coded in at least four places** — `js/data/mission.js` (`start 2026-10-25`, `finalReview 2027-02-10`, `days 109`, `target 8.0`), `js/data/phases.js` (`from`/`to`/`exam`/`sprint` plus 4 phase ranges), `js/data/english.js` (`start`, `week1`, `days 108`, `bufferTo`, `exam`), and `js/data/habit.js`. | Changing the mission date today means editing four files consistently — exactly what the brief forbids |
| A7 | `MISSION_CFG.target` is **8.0**; the brief specifies **7.5**. | Config drift |

---

## 10. Migration requirements

1. **Back up first.** Before any write, snapshot `localStorage['uzla.state']` to a
   timestamped key and offer a file download. Never destroy the original.
2. **Central calendar config.** One module owns: pre-launch 26–30 Nov 2026, main execution
   1 Dec 2026 – 31 Jan 2027, final consolidation 1–19 Feb 2027, exam 20 Feb 2027,
   target 7.5 overall. Every other module reads from it. The four existing date sources
   become derived values, not authorities.
3. **localStorage → IndexedDB.** Versioned, with record counts verified before and after,
   original ids and timestamps preserved, a written migration report, and rollback available
   until validation passes.
4. **Keep the 144-day English dataset.** Map it onto the new calendar as the content pool:
   the calendar decides what is scheduled, the dataset decides what exists. Do not renumber
   and do not discard.
5. **Keep legacy routes alive.** ~40 route patterns are in the learner's muscle memory, in
   bookmarks (`Store.bookmarksList()`) and in `Store.lastGet()` "continue" records. Every one
   must resolve after the IA change — redirect, never 404.
6. **Disable automatic cloud sync**, keeping a one-time explicit import path so any state
   already in the cloud can be pulled down deliberately, once, with the learner's consent.
7. **Do not delete the cloud copy** as part of this work. Removing the server-side record is
   the account owner's decision, made separately.
8. **Two backup formats:** JSON (structured) and ZIP (structured + manifest + binary files +
   checksums). Import must validate, preview, detect duplicates, merge safely, report
   conflicts and roll back on failure — and must never import credentials or sessions.

---

## 11. What this audit changed

Nothing. No file was modified, moved or deleted during Phase 0. The branch
`academy-personal-os-revolution` was created from `main` at `1b7be1e` with a clean tree, and
`npm test` was confirmed green beforehand.

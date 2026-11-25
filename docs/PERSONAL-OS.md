# UzLeeder Academy — Personal OS

**Branch:** `academy-personal-os-revolution` · **Date:** 25 November 2026
**Audit that preceded it:** [`PERSONAL-OS-AUDIT.md`](PERSONAL-OS-AUDIT.md)

One system. One source of truth. Complete ownership of personal learning data.

---

## 1. The five activities, one data system

| Activity | Destination | Where the data comes from |
|---|---|---|
| **Plan** — decide what matters | Mission Planner | `OS.CFG` calendar + `OS.tasks` + `HabitPlan` blocks |
| **Learn** — acquire knowledge | Learning Studios | the existing 52 content files, unchanged |
| **Execute** — complete tasks | Mission Planner / Command Center | `OS.tasks`, `Store.blockLog` |
| **Review** — strengthen memory | Review Lab | `Review` (SRS), `Store.mistakes` |
| **Measure** — understand progress | Insights | `OS.data`, measured sessions only |

Everything reads through **`js/os/data.js`**, a read model whose only rule is:
return what is actually stored, or nothing. No page computes its own totals, and
no page invents a number to fill a card.

---

## 2. Architecture

```
js/os/
  config.js     the mission calendar and targets — the single source of truth
  nav.js        8 destinations, the legacy redirect map, breadcrumb rules
  shell.js      sidebar, mobile tab bar, page primitives (head/tabs/stat/meter)
  data.js       read model: one place that answers "what is true today"
  tasks.js      planner tasks: date, time, duration, category, status
  db.js         IndexedDB repository over 19 stores + OPFS + storage accounting
  migrate.js    localStorage → IndexedDB with verification, report, rollback
  backup.js     JSON and ZIP export, validated import, safe merge
  pages/        center · planner · studio · lab · library · insights
                portfolio · vault
css/os.css      the Personal OS design system and shell
server/         the self-hosted shared-resource server
```

Nothing was rewritten in a framework. The site is still static files loaded as
classic scripts, which is why it still opens from `file://` and still installs
as a PWA. The audit found no reason to change that, and the brief forbids
changing it for fashion.

---

## 3. The calendar — one place, finally

`js/os/config.js` owns:

| | |
|---|---|
| Pre-launch | 26 – 30 November 2026 |
| Main execution | 1 December 2026 – 31 January 2027 |
| Final consolidation | 1 – 19 February 2027 |
| IELTS Academic | 20 February 2027 |
| Target | **7.5 overall**, per-skill targets editable in Vault |
| Mission window | 86 days |

Before this, those dates were written into `js/data/mission.js`,
`js/data/phases.js`, `js/data/english.js` and `js/data/habit.js` — four files
that had to agree, with a target of 8.0 in one of them. `tools/os-test.cjs`
asserts the new dates appear in **no** other module.

No score is promised anywhere. `CFG.target.guarantee` is `false` and the
interface says so where the target is shown.

---

## 4. Navigation: 16 entries → 8 destinations

| Destination | Absorbed |
|---|---|
| **Command Center** | dashboard |
| **Mission Planner** | today, week, habit, roadmap, goal, plan, dua (as optional routine) |
| **Learning Studios** | course, english, speaking, writing, quick · python, datacamp, pyai, jobready, placement |
| **Review Lab** | practice, review, mistakes, flash, etch, cheatsheet, eng-grammar, eng-vocab |
| **Knowledge Library** | books, bbc, movies, notes, saved, copy |
| **Insights** | analytics, weekly, monthly |
| **Projects & Portfolio** | projects, career |
| **Settings & Data Vault** | settings, profile |

The controller / communication system (`comm`, `chat`, `assignments`,
`notifications`) left the learner's navigation. It was not deleted: `/staff`
still works and the code is untouched. The audit found no evidence of an active
second party.

### Nothing 404s

- **36 legacy top-level routes redirect** to their new home.
- **19 deep routes render in place** (`lesson/7`, `english/12`, `books/v3`,
  `mission/*`, `pyai/*` …) with a breadcrumb back to the owning studio.
- **`classic/<route>`** opens any original page directly, bypassing the
  redirect. The studios and the library use it, so no course became unreachable,
  and the planner and Insights link to the original pages as "classic view".

All 55 are asserted in `tools/os-test.cjs` and were verified in a browser.

---

## 5. Design

New themes `os` (dark) and `os-light` on the existing token layer:

| Token | Value |
|---|---|
| background | `#0B1220` |
| secondary | `#101A2B` |
| card | `#152238` |
| action | `#477DFF` |
| accent | `#D6B56D` |
| text | `#F4F6FA` |
| secondary text | `#9AA9BF` |
| borders | `#1E2C44` |

Because every component already used `var(--…)` and never a raw hex, the whole
application changed appearance by adding two token blocks. Bold Red is still
selectable in Vault → Appearance, and certificates keep their own colours.

Desktop gets a collapsible rail, mobile gets a compact bottom bar, and both
share one vocabulary: `.os-card`, `.os-stat`, `.os-meter`, `.os-row`,
`.os-chip`, `.os-timeline`, `.os-cal`, `.os-table`, plus explicit loading,
empty, success and error states. No gradients, no glassmorphism, no decorative
charts.

Schema **v10** migrates appearance only: `dark → os`, `light → os-light`, any
deliberately chosen theme left alone. **Progress is not touched.**

---

## 6. Local-first data

### What changed

`js/sync.js` used to send the entire personal state to `/api/state` 1.5 seconds
after every change, pull on every tab focus, and fire a `keepalive` beacon on
`pagehide`. All three are now behind `settings.cloudSync`, which defaults to
**false**. Login still works — authentication is not progress.

`Sync.importOnce()` remains as the one deliberate path: a single `GET`, merged
into local state, triggered from Vault → Security. It never writes.

**`tools/no-upload-test.cjs`** loads the real `sync.js`, spies on `fetch`,
performs seven kinds of learning activity, waits past the old push delay, fires
`visibilitychange` / `pagehide` / `online`, and asserts **zero** requests — then
enables sync and asserts a request *does* go out, so the test cannot pass
vacuously.

A side effect worth naming: with no API calls during learning, the app is now
genuinely offline-capable. The service worker caches every versioned asset, and
`/api/*` is network-only — but nothing asks for it.

### IndexedDB

`js/os/db.js` provides the 19 stores the brief lists, with indexes for the
queries Insights and Review Lab actually make, plus OPFS for large files,
`navigator.storage.persist()` and usage reporting.

`js/os/migrate.js` copies localStorage into it and **verifies before it
confirms**: record counts per store, unique non-empty ids, lesson scores, quiz
totals, the Error Log's four columns and every timestamp. If anything differs it
reports the mismatches and the app keeps using localStorage. The original state
is never deleted, a snapshot is taken first, and `OS.migrate.rollback()` undoes
it.

**Current status, stated plainly:** IndexedDB is a verified second home, run
from Vault → Data. The application still reads and writes through `Store`
(localStorage) as its primary path. Switching the read path over is the next
piece of work, and doing it before the verified copy existed would have risked
the learner's records for no gain.

### Backup

| | |
|---|---|
| **JSON** | structured records, schema version, export timestamp, record counts, CRC32 |
| **ZIP** | `data.json` + `manifest.json` (per-file size and CRC32) + `files/` + `README.txt` |

The ZIP writer is 60 lines of standard store-method ZIP — no dependency was
added, and any archiver opens it.

Import **validates, previews, detects duplicates, merges safely, reports
conflicts and rolls back on failure**. The merge keeps the higher score, the
union of completed work, and never reopens a mistake that was resolved.

Credentials never travel in either direction: `stripSecrets` drops anything
matching password / token / session / cookie / secret / auth / hash on export,
and `findSecrets` names them on import so they are visibly refused rather than
silently dropped. **An exported profile cannot be used to sign in.**

---

## 7. Security

The audit reviewed the existing authentication and found it sound; it is
unchanged. PBKDF2-SHA256 at 210,000 iterations, HMAC-SHA256 signed HttpOnly
session cookie, `timingSafeEqual` comparison, configurable expiry, rate
limiting, and an edge gate on both platforms that closes the whole site —
static assets included.

What changed is what the session is *used for*: it authenticates, it no longer
carries personal progress.

---

## 8. Definition of done

| Requirement | Status |
|---|---|
| Coherent premium Personal OS design | **done** |
| Navigation simplified | **done** — 16 → 8 |
| Duplicate functionality merged | **done** — at navigation and hub level; originals retained as implementations |
| Existing learning content preserved | **done** — no file deleted, counts verified in the audit |
| Mission ends 19 February 2027 | **done** |
| Exam date 20 February 2027 | **done** |
| IELTS target 7.5 | **done** |
| Python, DataCamp, AI Engineering in one Coding Studio | **done** |
| IELTS skills in one IELTS Studio | **done** |
| Review Lab works across modules | **done** |
| Command Center shows real information | **done** — every card is backed by a stored record or is absent |
| Personal data stored locally | **done for the architecture; partial in practice** — IndexedDB layer and verified migration ship, the primary read path is still `Store` |
| No silent upload | **done** — off by default, proven by test with a control case |
| JSON and ZIP backups | **done** |
| Self-hosted resource server | **done** — 58 assertions including range requests and corruption detection |
| Authentication secure | **done** — audited, unchanged |
| Offline behaviour tested | **partial** — asserted statically (SW rules, versioned assets, no API dependency); no automated browser offline run |
| Migration verified | **done** — counts, ids, timestamps, four-column Error Log, with failure cases asserted |
| Critical tests pass | **done** — 15 suites, 617 assertions, exit 0 |
| Deployment and rollback documented | **done** — `DEPLOYMENT.md`, `MEDIA-SERVER.md`, `AI-POLICY.md` |

### What is honestly not finished

1. **IndexedDB is not yet the primary store.** The migration is written, tested
   and reversible, and the Vault runs it on demand. Pointing `Store` at it is a
   separate, carefully-tested change.
2. **Offline is not tested in a browser.** The rules are asserted statically.
   A real check means loading the app, going offline and navigating.
3. **The deployment question is open.** `DEPLOYMENT.md` names Netlify as the
   likely production platform and gives the one command that settles it. Nothing
   was removed from either platform until that is confirmed.
4. **The planner's views are new, not ports.** `PageToday`, `PageWeek` and
   `PageHabit` have behaviour the new tabs do not reproduce, which is why each
   tab links to the classic page rather than replacing it.

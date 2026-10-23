# UzLeeder Academy — October 2026 upgrade (audit → design → migration)

Covers two requests: **IELTS Mission System** (16 weeks, 25 Oct 2026 → 14 Feb 2027) and
**Python & AI Engineering Career Path**. The Python legacy mapping is in
[`PYTHON-LEGACY-MAP.md`](PYTHON-LEGACY-MAP.md).

---

## Stage 1 — Audit (real codebase, 22 Oct 2026)

### Architecture
| Layer | What exists |
|---|---|
| Client | One static SPA (`index.html`), classic `<script>` files, hash router (`js/app.js`), pages return HTML strings + `mount()` for events. No build step, no framework. |
| Content | Static data files in `js/data/*.js` (globals: `COURSE`, `ENG_DAYS_*`, `ENG_READING_*`, `ENG_LISTENING_*`, `ENG_DICT`, `ENG_DEST_B2`, `WRITING`, `SPEAK30`, `ENG_GRAMMAR(_EX)` …). |
| State | `localStorage["uzla.state"]` is the **primary** store (`js/store.js`, schema v8). The cloud is a copy (`/api/state`, optimistic `rev`, 1 MB cap). `js/sync.js` merges field-by-field on conflict. |
| Server | Vercel-style handlers in `api/`, run on Netlify through `netlify/functions/gateway.mjs`. One KV table (`uzla_kv`) on Netlify Database (Postgres). Media on Netlify Blobs. |
| Auth | Edge gate (`netlify/edge-functions/gate-source.js`) — whole site behind a signed `uzla_session` cookie. Staff use a second cookie `uzla_ctrl` carrying a `role`. PBKDF2 hashes from env or DB. |
| Code execution | `js/playground.js` loads Pyodide (CPython/WASM) from jsDelivr **on the main thread**; nothing executes on the server. |

### Roles (before)
| Role | Where defined | What it did |
|---|---|---|
| `learner` | `uzla_session` cookie | the student |
| `controller` | `api/_lib.js STAFF`, `CTRL_*` env | monitoring: sessions, activity, chat, private notes |
| `teacher` | `STAFF.teacher`, `TEACHER_*` env | assignments, feedback, writing/speaking review, projects, chat, full state |
| `english` ("English support teacher") | `STAFF.english`, `ENG_*` env | same as teacher, English only (`filterStateForRole`) |

Role-specific code found by search (`teacher|english|ENG_|TEACHER_`): `api/_lib.js` (STAFF, PERMS,
`filterStateForRole`), `api/_ctrl-io.js` (assignment/feedback/review flows, notify to teacher/english),
`api/login.js` (WORKSPACE), `api/_ctrl-state.js`, `api/_ctrl-login.js`, `api/password.js`,
`js/ctrl.js` (ROLES), `js/staff.js` (teacher/english tab sets + 7 role views), `js/pages/chat.js`
(teacher/english conversations, "send to the teacher" review block), `js/pages/writing.js`
(review submission), `js/pages/speaking.js`, `js/i18n.js` (role labels, review texts),
`netlify.toml` and `gate-source.js` (`/teacher`, `/english` rewrites), `sw.js`, `login.html`,
`controller.html`, `tools/api-test.cjs`, `tools/middleware-test.mjs`.

Live accounts (academy.uzleeder.uz, checked 22 Oct): env holds only the learner hash; no
`TEACHER_*`/`ENG_*`/`CTRL_*` hashes, so no live account belongs to a removed role. The DB is a
fresh Netlify Database (no historical teacher records). Code must still handle both cases safely
(other deployments, old cookies, old records).

### English content that really exists
* 140-day course (`ENG_DAYS_1…6`) + 4 intro lessons; weekly quizzes; grammar refs.
* **24 IELTS-format reading passages** written for the platform (themes of Reading Explorer 3),
  with keys + explanations; types: headings, TF/NG, Y/N/NG, MCQ, completion, summary, matching, short.
* **10 listening sections** written for the platform — transcript only, **no audio**.
* **Target Listening with Dictation, Practice Tests Book 1** (`ENG_DICT`): 12 tests, dictation scripts,
  **30-question answer keys per test** (A–E). Audio is in the student's own book (track numbers stored).
* **Destination B2** vocabulary: 14 units × 5 sections (≈2 570 items, word + Uzbek meaning).
* Grammar reference (25 topics) + 220 grammar exercises (free-text answers; ~1/4 not auto-checkable).
* Writing deep course (19 weeks, drafts/versions saved), Speaking 30 (30 days + question pool).
* SRS (`js/engine.js` Review: 1→3→7→14→30→60), mistake bank, Mastery %, Recommend list.

**Not in the codebase:** Reading Explorer 4, Reading Accelerator, full IELTS mock tests, any audio
for the platform's own listening sections, official band conversion tables. These are **not
fabricated** — see design.

### Python content that really exists
30 lessons (`COURSE`), 22 teaching + 8 review days, 10 MCQ per lesson with explanations
(`EXPLAIN`), analogies/notes (`DEEP`), text-only practice lists, Quick Repeat (10 days), DataCamp
plan, 6 projects (text). Completion = best quiz ≥ 7/10.

### Risks found
1. Staff tokens of removed roles would keep working until expiry unless `STAFF` drops them.
2. Writing/speaking "send to teacher" would queue work for nobody after removal.
3. Mastery % mixes completion and accuracy (e.g. vocab = words/600) — misleading for the mission.
4. Store merge (`sync.js`) only knows listed fields — a new field must be added or it is lost on 409.
5. State cap 1 MB — writing drafts can grow; needs caps.
6. Pyodide runs on the main thread — an infinite loop in student code freezes the tab.
7. Old `?v=` cache keys + service worker — changed files need new versions or users keep old JS.

---

## Stage 2 — Design

### Roles (after)
* Active: `learner`, `controller` (monitoring, sessions, chat, private notes). No admin role exists.
* `teacher`, `english` → **retired** (`L.RETIRED_ROLES`). Removed from `STAFF`, `PERMS`, login,
  password, state, chat routing, staff panel, navigation, rewrites.
* Revocation: login with a retired role's credentials fails (not in `STAFF`); an old `uzla_ctrl`
  cookie with a retired role → 401 everywhere (`staffSessionOf` rejects it).
* No silent conversion or deletion: retired hash keys/env vars are **left untouched**. The controller
  panel and `tools/retired-roles.cjs` list any configured retired account with the message
  "access revoked — converting needs an explicit owner decision".
* Historical records (assignments, feedback, reviews, chats with retired roles) stay readable by
  the student as an archive; records authored by a retired role render as "former teacher (retired role)".
* Teacher-dependent flows replaced: writing/speaking review → self-review in the Writing / Speaking
  Studio; assignments → the daily mission engine; learning questions are never routed to a
  non-existent role (chat = controller only).

### IELTS Mission (new: `js/data/mission.js`, `js/mission.js`, `js/pages/mission.js`)
* Calendar: start **2026-10-25**, final review **2027-02-14** (16 weeks + the final-review day = 113 days). Phases:
  W1 diagnostics · W2–5 foundation · W6–10 build · W11–14 exam skills · W15–16 mocks & final review.
* Daily engine: modes 60 / 90 / 120 / 195 / custom; default 195 = R45 L45 V30 GW30 S30 E15.
  Smaller budgets keep error review, then weight skills by evidence (weakest / unassessed first).
  Each task carries objective, activity, minutes, material (real route), completion criteria,
  short assessment, next step and **why** (the evidence that selected it).
* Missed days: nothing piles up — at most one unfinished task (the highest-priority one) carries
  over, review load is capped per day, and the plan says what was dropped.
* Tasks: start / pause / resume (split sessions), done, skip, move to another day; actual minutes
  recorded and shown as study time, never as proof of learning.
* Runners that record per-item evidence:
  * Reading — platform passages; answer before reveal; key check; evidence (paragraph) step for
    T/F/NG, Y/N/NG, headings, matching; accuracy per question type.
  * Listening — Target Listening 1 tests (book audio + real key, 30 Qs); platform sections read
    aloud by the browser's speech synthesis with the transcript locked until answers are checked;
    missed-answer reason (distractor, paraphrase, number/name/date, spelling, plural, connected
    speech, lost place); student-imported tests with their own key and local audio file.
  * Vocabulary — Destination B2 + own words: production recall (meaning → word), personal
    sentence, spaced revision.
  * Grammar — 220 exercises: auto-check where the key is a clean answer list, otherwise
    "self-check" (labelled); errors mapped to the 10 categories in the brief.
  * Book work — Reading Explorer 4 / Reading Accelerator / any book: student logs unit, pages,
    score against the book's own key, question types and misses. No textbook content is invented.
* Error intelligence: one store for every error (skill, source, date, response, correct, category,
  explanation, follow-up, status, attempts). Reviews 1/3/7/14 days (configurable); a repeated
  error comes back sooner; consecutive independent successes stretch the interval.
* Writing Studio: Task 1 / Task 2, timer, word count, autosave drafts, version history, revision
  diff, paragraph outline, self-annotations (category + note → error bank), criteria self-assessment
  (TA/TR, CC, LR, GRA). Estimates are labelled "self-estimate — not an examiner score".
* Speaking Studio: Parts 1/2/3 from the platform pool, prep timer, notes, recording + playback
  (MediaRecorder, kept in this browser's IndexedDB), reflection checklist, self-assessment.
  Pronunciation is only self-rated when a recording exists.
* Diagnostics & tests: reading, listening, grammar, writing, speaking diagnostics; timed practice;
  result log with four distinct kinds: practice score · self-estimate · verified conversion (from
  an official book's own table, entered by the student) · official result. No band from short quizzes.
* Profile: per skill — evidence count, accuracy, confidence (none / low / medium / high),
  strengths, weaknesses, next step. Seeded with the brief's preliminary indicators, labelled as such.

### Python & AI Engineering Career Path (new: `js/data/pyai-*.js`, `js/pyai.js`, `js/pages/pyai.js`)
* Modules 0–9 as in the brief; Module 1 re-uses the 30 legacy lessons (originals untouched) through
  an explicit `legacyMap` with improvements per lesson.
* Lesson schema: goal, prereqs, concept (uz + English terms), worked example, walkthrough, predict,
  guided, independent (hints ×2 → solution), debugging, knowledge check, real-world use, summary,
  exit check, review scheduling.
* Exercise engine: Pyodide in a **Web Worker** with a hard timeout (worker terminated), trusted test
  cases (function-call asserts, not string matching). Honest label: runs in your browser, not a
  security sandbox; no network inside exercises; nothing runs on the server.
* Metrics kept separate: viewed · attempted · passed · mastery (≥ 80 % + practical task) · projects
  submitted · projects auto-checked / self-assessed · review due · attempt history.
* Legacy progress: a legacy lesson passed (best ≥ 7/10) counts as **completed (legacy)** for its
  mapped lessons — never as mastery.

### Data (all additive; nothing existing is renamed or reset)
`state.mission` and `state.pyai` (new top-level keys), merged in `sync.js`, size-capped. Before the
first mission write the app saves a one-time local backup (`uzla.state.backup.mission-v1`).

# AI policy

**Status as of 25 November 2026: the Academy contains no AI integration, and
needs none to work.**

This document is the rule for if one is ever added.

---

## 1. The current state, verified

There is no call to any AI provider anywhere in the shipped code. There is no
API key in the frontend, because there is no AI client to hold one. The Python
runner (`js/pyrunner.js`, `js/playground.js`) executes code in the browser; the
question generator (`js/gen.js`) builds exercises from the local content files;
the spaced-repetition scheduler (`js/srs2.js`) is arithmetic. None of it is a
model call.

The only outbound requests the app can make are to its own origin:
`/api/login`, `/api/logout`, `/api/password`, `/api/username`, `/api/health`,
`/api/bbc`, `/api/media`, and — **only when the learner explicitly enables it** —
`/api/state`.

---

## 2. The rules

**AI functionality is optional.** The Personal OS must stay completely usable
with no AI provider configured. Not degraded-but-working: fully usable. Every
feature that exists today must keep working with no key present.

**No hidden calls.** A request to a model provider happens only as the direct
result of something the learner did, in a place where they can see that it is an
AI feature. No background enrichment, no "while you were away" processing, no
prefetching.

**No API keys in frontend code.** A key never reaches the browser — not in a
bundle, not in `localStorage`, not in a data attribute, not through a config
endpoint. A provider call is proxied by a serverless function that reads the key
from the environment, exactly as `api/_lib.js` already does for every other
secret.

**Explicit configuration.** The feature stays off until the owner sets the
environment variable and the learner turns it on in Vault. Two deliberate acts,
not one.

**State what is transmitted.** Before the first call, the interface must say in
plain words which fields leave the device. Not "your data may be processed" —
the actual list.

**Minimise personal data.** Send the smallest thing that can answer the
question: the sentence being checked, not the essay; the one mistake, not the
Error Log. Never send the profile, the activity log, the schedule, the mistake
history, the note collection or the mock results as context.

**Private learning records stay local by default.** The same rule as cloud sync
(§8 of the brief and `js/sync.js`): personal records belong to the device. An AI
feature is not an exception to that; it is the most likely way to breach it.

**Always a non-AI fallback.** Every AI-assisted path needs a path that reaches
the same place without a model: a rubric instead of an essay grade, a cheatsheet
instead of a generated explanation, the existing question generator instead of
generated questions. The fallback is the default, the model is the upgrade.

---

## 3. If you add one

1. Put the provider call in a new serverless function beside the existing ones.
   It reads its key from the environment and returns only what the feature needs.
2. Add the environment variable to `docs/DEPLOYMENT.md` and mark it optional.
3. Add a setting in Vault → Security, off by default, with the transmitted-data
   list rendered next to the switch.
4. Add a test asserting that with the setting off, no request reaches the
   provider — model it on `tools/no-upload-test.cjs`, which already proves this
   pattern works, including a control case so the test cannot pass vacuously.
5. Add a test asserting the feature's non-AI fallback still produces a usable
   result with the key absent.
6. Update this document with what the feature sends and why.

---

## 4. What would breach this policy

Listed plainly, because these are the shapes it usually takes:

- an "AI tutor" that reads the Error Log to personalise itself;
- automatic essay scoring that uploads Writing Task 2 drafts on save;
- a "smart review" that sends the vocabulary list to pick the next card;
- pronunciation scoring that streams Speaking recordings without a prompt;
- any feature that stops working, or silently degrades, when the key is removed;
- any key, token or endpoint credential visible in `dist/`.

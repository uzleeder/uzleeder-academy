#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tools/new-alphabet.py - Uzbek Latin text to the 2021 reform letters.

    O' o'  ->  O-umlaut / o-umlaut     (O'zbekiston -> Ozbekiston with umlaut)
    G' g'  ->  G-breve  / g-breve      (og'irligi   -> ogirligi with breve)
    Sh sh  ->  S-cedilla / s-cedilla   (saqlash     -> saqlas with cedilla)
    Ch ch  ->  C-cedilla / c-cedilla   (choy        -> coy with cedilla)
    '      ->  modifier apostrophe     (tutuq belgisi is kept)

ONLY Uzbek user-facing text is touched:
  * uz: '...' / uz: "..." values anywhere under js/
  * the uz: { ... } block of window.STRINGS in js/i18n*.js
  * a listed set of hardcoded strings in the HTML shells

English words, product names, code identifiers, URLs, file paths, HTML
fragments and {placeholders} are masked out before conversion and restored
afterwards, so "Coding Studio", "cheatsheet", "localStorage" and
"mission/day" survive untouched.

Masking is a SINGLE pass on purpose: with several passes a later pattern can
match inside a token an earlier pattern just wrote (the number rule eating the
index of an existing token), which produces nested tokens that cannot be
unmasked.

Usage:
    python tools/new-alphabet.py --check          report only, change nothing
    python tools/new-alphabet.py --sample 40      show before/after pairs
    python tools/new-alphabet.py --only js/os     restrict to a path fragment
    python tools/new-alphabet.py --apply          write the files
"""
import argparse
import glob
import io
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")

# New-alphabet letters, written as escapes so this file stays plain ASCII.
O_UP, O_LO = "\u00d6", "\u00f6"      # O with diaeresis
G_UP, G_LO = "\u011e", "\u011f"      # G with breve
S_UP, S_LO = "\u015e", "\u015f"      # S with cedilla
C_UP, C_LO = "\u00c7", "\u00e7"      # C with cedilla
TUTUQ = "\u02bc"                      # modifier letter apostrophe

NEW_LETTERS = O_UP + O_LO + G_UP + G_LO + S_UP + S_LO + C_UP + C_LO

# ---------------------------------------------------------------- protection

# Never converted. Matched case-insensitively on word boundaries. Everything
# here is English, a product name, or a technical term that appears inside
# Uzbek sentences.
PROTECT = """
IELTS Academic Cambridge British Council
Listening Reading Writing Speaking Grammar Vocabulary Task Part Section Band
Mock Booster Explorer Accelerator Destination Essential Dictation Phrasal
English Everest LC Shadowing
Python DataCamp PyAI AI Engineering Engineer Developer Fundamentals Toolbox
Data Types Intermediate Introduction Capstone Portfolio Project Projects
Job Ready JobReady Career Coding Studio Studios Command Center Centre
Dashboard Insights Review Lab Library Knowledge Mission Planner Vault
Personal OS Academy UzLeeder Leeder
Flashcard Flashcards Flash Cheatsheet Cheatsheets Etch Quick Repeat Placement
Spaced Repetition Active Recall Error Log Red List Launch Pre-launch
BBC Netflix YouTube Google Drive GitHub Netlify Vercel Chrome Safari Firefox
PDF HTML CSS JSON ZIP SVG MP4 WEBM URL API CORS HTTP HTTPS TLS CRC
LangChain OpenAI ChatGPT Jupyter Pandas NumPy Django Flask SQL Git Docker
print input int str float list dict set tuple bool len range sorted append
search match chr char chain class def lambda self schedule shape shapes
NameError TypeError ValueError IndexError KeyError SyntaxError AttributeError
localStorage IndexedDB OPFS sessionStorage cookie cookies cache
service worker PWA offline online
Store Sync Search Settings Profile Backup Export Import Restore
Overall Target Status Done Pending Partial Skipped
Windows Android iOS macOS Linux
Daily Discipline Uzlat Ribat
Shift Ctrl Alt Enter Escape Backspace
"""
PROTECT_WORDS = sorted({w for w in PROTECT.split() if w}, key=len, reverse=True)

MASK_PATTERNS = [
    # Inline code in explanations. The lessons teach Python the learner has to
    # type, so an identifier inside backticks must survive exactly: `yosh`
    # stays `yosh`, never `yos-cedilla`. 455 uz: strings carry code this way.
    r"`[^`]*`",
    r"\{[^{}]*\}",                                  # {n}, {d} placeholders
    r"<[^<>]+>",                                    # html fragments
    r"&[a-zA-Z#0-9]+;",                             # html entities
    r"https?://\S+",                                # urls
    r"\b[\w.-]+\.(?:js|css|html|json|md|cjs|mjs|png|jpg|svg|pdf)\b",
    r"\\u(?!02bb|02bc|02BB|02BC)[0-9a-fA-F]{4}",    # escaped unicode
    r"\\[nrt\\]",                                   # escape sequences (quotes handled in convert_uz)
    # Identifiers only. Both forms require a lowercase letter, so an ALL-CAPS
    # Uzbek word used for emphasis (YO'Q, BIRINCHI, SHART) is NOT protected;
    # genuine acronyms are covered by the word list instead.
    r"\b[a-z][A-Za-z]*[A-Z][A-Za-z]*\b",            # camelCase: localStorage
    r"\b[A-Z][a-z]+[A-Z][A-Za-z]*\b",               # PascalCase: DataCamp
    r"\b\d+(?:[.:]\d+)*\b",                         # numbers and times
]

TOKEN_OPEN = "\x00"
TOKEN_CLOSE = "\x00"

_COMBINED = None


def _combined():
    """One alternation for every protected pattern and word.

    Case-insensitivity is scoped to the word list with (?i:...), never applied
    to the whole regex: a global re.I turns [A-Z] in the camelCase rule into
    "any letter", which then swallows ordinary Uzbek words like "Kech" and
    leaves them unconverted.
    """
    global _COMBINED
    if _COMBINED is None:
        parts = list(MASK_PATTERNS) + [
            r"(?i:\b" + re.escape(w) + r"\b)" for w in PROTECT_WORDS
        ]
        _COMBINED = re.compile("|".join("(?:%s)" % p for p in parts))
    return _COMBINED


def mask(text):
    """Replace protected spans with indexed tokens, in one pass."""
    store = []

    def keep(m):
        store.append(m.group(0))
        return TOKEN_OPEN + str(len(store) - 1) + TOKEN_CLOSE

    return _combined().sub(keep, text), store


def unmask(text, store):
    pat = re.escape(TOKEN_OPEN) + r"(\d+)" + re.escape(TOKEN_CLOSE)
    return re.sub(pat, lambda m: store[int(m.group(1))], text)


# ---------------------------------------------------------------- conversion

APOS = "'\u2018\u2019\u02bb\u02bc\u00b4\u0060"


def convert_uz(text):
    """Apply the 2021 reform letters to a span of Uzbek text."""
    # \\u02bb and \\u02bc escapes are apostrophes written the long way.
    text = text.replace("\\u02bb", "\u02bb").replace("\\u02BB", "\u02bb")
    text = text.replace("\\u02bc", "\u02bc").replace("\\u02BC", "\u02bc")

    # Escapes are resolved by convert_literal before this is called, so the
    # text here is what the reader sees.
    body, store = mask(text)

    body = re.sub("O[" + APOS + "]", O_UP, body)
    body = re.sub("o[" + APOS + "]", O_LO, body)
    body = re.sub("G[" + APOS + "]", G_UP, body)
    body = re.sub("g[" + APOS + "]", G_LO, body)

    body = body.replace("SH", S_UP).replace("Sh", S_UP).replace("sh", S_LO)
    body = body.replace("CH", C_UP).replace("Ch", C_UP).replace("ch", C_LO)

    # A remaining apostrophe between two letters is the tutuq belgisi.
    letters = "A-Za-z" + NEW_LETTERS
    body = re.sub(
        "(?<=[" + letters + "])[" + APOS + "](?=[" + letters + "])", TUTUQ, body
    )

    return unmask(body, store)


# ---------------------------------------------------------------- file walk

UZ_VALUE = re.compile(r"""(uz\s*:\s*)(['"])((?:\\.|(?!\2).)*)(\2)""", re.S)
STR_LITERAL = re.compile(r"""(['"])((?:\\.|(?!\1).)*)\1""", re.S)


ESC = re.compile(r"\\u[0-9a-fA-F]{4}|\\.", re.S)

# Escapes that are really an apostrophe to the reader, and so must take part in
# the letter rules: \' \" inside a literal, and the two modifier letters.
APOS_ESCAPES = {"\\'": "'", '\\"': '"', "\\u02bb": "ʻ", "\\u02bc": "ʼ"}


def convert_literal(val, q):
    """Convert the body of a string literal, escape-aware.

    Splitting on escapes first is what makes this safe. Naively unescaping
    quotes corrupts a value like  \\\\ teskari chiziq, \\" qo'shtirnoq  where a
    literal backslash sits next to an escaped quote: the two runs merge and the
    re-escape pass then closes the string early.

    Every escape is an atom. An apostrophe-escape becomes a plain apostrophe so
    the letter rules see it; every other escape is protected verbatim. Bare
    delimiters are re-escaped at the end.
    """
    atoms = []          # protected escapes, restored after conversion
    parts = []
    pos = 0
    for m in ESC.finditer(val):
        parts.append(val[pos:m.start()])
        esc = m.group(0)
        low = esc.lower() if esc.startswith("\\u") else esc
        if low in APOS_ESCAPES:
            parts.append(APOS_ESCAPES[low])
        else:
            atoms.append(esc)
            parts.append("\x01%d\x01" % (len(atoms) - 1))
        pos = m.end()
    parts.append(val[pos:])

    body = convert_uz("".join(parts))

    # Re-escape any delimiter that is now bare, then restore the escapes.
    body = body.replace(q, "\\" + q)
    return re.sub(r"\x01(\d+)\x01", lambda m: atoms[int(m.group(1))], body)


# The key may be bare (uz:) or quoted ("uz": / 'uz':). course.js, pyai-*.js and
# the other JSON-shaped content files use the quoted form.
UZ_KEY = re.compile(r"""(?:^|[^A-Za-z0-9_$])["']?uz["']?\s*:\s*$""")


def convert_uz_values(src):
    """Convert the literal that follows every `uz:` key.

    Uses the same character scanner as the translation table, for the same
    reason: regex scanning drifts. A literal qualifies when the source right
    before it ends with `uz:`.
    """
    out = []
    pairs = []
    last = 0
    for start, end, q in scan_literals(src):
        if not UZ_KEY.search(src[max(0, start - 40):start]):
            continue
        val = src[start + 1:end]
        new = convert_literal(val, q)
        if new != val:
            pairs.append((val, new))
        out.append(src[last:start])
        out.append(q + new + q)
        last = end + 1
    out.append(src[last:])
    return "".join(out), pairs


def find_strings_block(src):
    """Locate the uz: { ... } block inside window.STRINGS."""
    m = re.search(r"window\.STRINGS\s*=\s*\{\s*uz\s*:\s*\{", src)
    if not m:
        return None
    start = m.end()
    depth = 1
    i = start
    n = len(src)
    while i < n and depth:
        c = src[i]
        # Comments are skipped as well as strings. Counting braces inside a
        # comment is what made this overrun the uz object and swallow the en
        # one, which would have translated the English half of the file.
        if c == "/" and i + 1 < n:
            if src[i + 1] == "/":
                j = src.find("\n", i)
                i = n if j < 0 else j + 1
                continue
            if src[i + 1] == "*":
                j = src.find("*/", i + 2)
                i = n if j < 0 else j + 2
                continue
        if c in "'\"`":
            q = c
            i += 1
            while i < n and src[i] != q:
                if src[i] == "\\":
                    i += 1
                i += 1
            i += 1
            continue
        if c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                return start, i
        i += 1
    return None


def scan_literals(block):
    """Walk a block of JS and yield (start, end, quote) for each string literal.

    A character scanner, not a regex. Regex scanning of a 190 KB translation
    table silently desynchronises: one literal whose body the pattern reads
    differently shifts every match after it by a quote, so unrelated strings
    get merged and a closing delimiter is eaten. This walks the source the way
    the parser does, skipping comments, and cannot drift.
    """
    i, n = 0, len(block)
    while i < n:
        c = block[i]
        if c == "/" and i + 1 < n:
            nxt = block[i + 1]
            if nxt == "/":                      # line comment
                j = block.find("\n", i)
                i = n if j < 0 else j + 1
                continue
            if nxt == "*":                      # block comment
                j = block.find("*/", i + 2)
                i = n if j < 0 else j + 2
                continue
        if c in "'\"`":
            q = c
            j = i + 1
            while j < n:
                if block[j] == "\\":
                    j += 2
                    continue
                if block[j] == q:
                    break
                j += 1
            if j < n:
                yield i, j, q
                i = j + 1
                continue
            i += 1
            continue
        i += 1


def convert_block(block):
    """Convert every string literal in a block of JS, leaving code untouched."""
    out = []
    pairs = []
    last = 0
    for start, end, q in scan_literals(block):
        val = block[start + 1:end]
        new = convert_literal(val, q)
        if new != val:
            pairs.append((val, new))
        out.append(block[last:start])
        out.append(q + new + q)
        last = end + 1
    out.append(block[last:])
    return "".join(out), pairs


def convert_strings_block(src):
    span = find_strings_block(src)
    if not span:
        return src, []
    start, end = span
    block, pairs = convert_block(src[start:end])
    return src[:start] + block + src[end:], pairs


HTML_STRINGS = [
    "Asosiy mazmunga o'tish",
    "Qidirish",
    "Sozlamalar",
    "Chiqish",
    "Progressni o'chirish",
    "Profil",
    "Nazorat va chat",
    "yurish",
    "ochish",
    "yopish",
    "Sertifikat",
    "30 kunlik Python kursi",
]


def convert_html(src):
    pairs = []
    for s in HTML_STRINGS:
        if s in src:
            new = convert_uz(s)
            if new != s:
                src = src.replace(s, new)
                pairs.append((s, new))
    return src, pairs


# ---------------------------------------------------------------- main


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true")
    ap.add_argument("--check", action="store_true")
    ap.add_argument("--sample", type=int, default=0)
    ap.add_argument("--only", default="")
    args = ap.parse_args()

    js = sorted(p.replace("\\", "/") for p in glob.glob("js/**/*.js", recursive=True))
    html = [p for p in ["index.html", "login.html", "404.html", "error.html"] if glob.glob(p)]

    if args.only:
        js = [p for p in js if args.only in p]
        html = [p for p in html if args.only in p]

    total = 0
    changed_files = 0
    samples = []

    for p in js:
        src = io.open(p, encoding="utf-8").read()
        out, pairs = convert_uz_values(src)
        if "window.STRINGS" in out:
            out, more = convert_strings_block(out)
            pairs += more
        if pairs:
            total += len(pairs)
            changed_files += 1
            samples.extend((p, a, b) for a, b in pairs[:4])
            if args.apply:
                io.open(p, "w", encoding="utf-8").write(out)

    for p in html:
        src = io.open(p, encoding="utf-8").read()
        out, pairs = convert_html(src)
        if pairs:
            total += len(pairs)
            changed_files += 1
            samples.extend((p, a, b) for a, b in pairs[:4])
            if args.apply:
                io.open(p, "w", encoding="utf-8").write(out)

    if args.sample and samples:
        step = max(1, len(samples) // args.sample)
        for p, a, b in samples[::step][: args.sample]:
            print("%-26s %s" % (p.split("/")[-1], a[:70]))
            print("%-26s %s" % ("", b[:70]))
            print()

    print("%s: %d strings in %d files" % ("APPLIED" if args.apply else "would change", total, changed_files))


if __name__ == "__main__":
    main()

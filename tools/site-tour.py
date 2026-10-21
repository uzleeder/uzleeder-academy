#!/usr/bin/env python3
"""
tools/site-tour.py — butun sayt bo'yicha qisqa video (ingliz tilida, ovozli).
---------------------------------------------------------------------------
Nima qiladi:
  1. Mahalliy static server (127.0.0.1:5174) ni ishga tushiradi
  2. Headless Chrome bilan asosiy sahifalarni 1920×1080 da suratga oladi (?lang=en)
  3. Har sahifa uchun dizaynlangan slayd (surat + sarlavha + izoh + logo) chizadi
  4. macOS `say` bilan inglizcha ovoz (Samantha) yozadi
  5. ffmpeg (imageio-ffmpeg) bilan slayd + ovozni bitta MP4 ga yig'adi

Ishga tushirish (loyiha papkasidan):   python3 tools/site-tour.py
Chiqadi:                                brand/out/site-tour-1920x1080.mp4
Talab: macOS (say), Google Chrome, ~/.cache/uzleeder/venv (imageio-ffmpeg) yoki PATH'da ffmpeg.
"""
import os, sys, json, subprocess, shutil, time, http.server, threading, socketserver, functools, re, html

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'brand', 'out')
WORK = os.path.join(OUT, 'tour')
PORT = 5174
CHROME = next((c for c in ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Chromium.app/Contents/MacOS/Chromium', shutil.which('google-chrome') or '', shutil.which('chromium') or ''] if c and os.path.exists(c)), None)
FFMPEG = shutil.which('ffmpeg')
if not FFMPEG:
    venv = os.path.expanduser('~/.cache/uzleeder/venv/bin/python')
    if os.path.exists(venv):
        FFMPEG = subprocess.check_output([venv, '-c', 'import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())']).decode().strip()
if not CHROME or not FFMPEG:
    sys.exit('Chrome yoki ffmpeg topilmadi')
VOICE = os.environ.get('TOUR_VOICE', 'Samantha')
RATE = os.environ.get('TOUR_RATE', '185')

# Slaydlar: (marshrut | None=cover, sarlavha, izoh/ovoz matni)
SLIDES = [
    (None, 'UzLeeder Academy', 'UzLeeder Academy — a personal learning OS. From zero to AI engineering: Python, DataCamp and IELTS 8.0 on one daily discipline. Official start: September 20th, 2026.'),
    ('dashboard', 'Dashboard', "The dashboard answers one question: what do I do now? Today's mission, KPIs for Python, English, DataCamp, streak and reviews — and rings that show your overall state."),
    ('today', 'Today', "Today is a deterministic checklist: due reviews, open mistakes, the weak area, the day's lessons, books, speaking and work — each with minutes."),
    ('habit', 'Daily discipline', 'Daily discipline: every day, hour by hour, from 05:20 to 21:20, built around prayer times. Trial days first, then the official schedule from September 20th.'),
    ('course', 'Courses', 'The courses hub: Python in 30 days, the DataCamp track, IELTS in 140 days, Speaking 30, BBC listening, Writing, and the 10-day Quick Repeat.'),
    ('lesson/1', 'Python lesson', 'Each Python lesson has theory in Uzbek and English, runnable code in the browser, practice tasks and a quiz — seven out of ten to pass.'),
    ('datacamp', 'DataCamp track', 'DataCamp Python Programming Fundamentals: 14 chapters on a fixed schedule, a quiz for every chapter, and a big coding test every Sunday.'),
    ('english', 'IELTS 8.0 — 140 days', 'English: IELTS 8.0 in 140 days. Six skills every day, five phases, four mocks, and the exam on February 20th.'),
    ('english/1', 'A day in the course', 'A day page: the six-skill plan, the grammar cheatsheet, the vocabulary set, tasks, notes and the Sunday test.'),
    ('books/vocab', 'Vocabulary plan', 'Vocabulary: fifteen days of the C-book, forty words a day written by hand, then 4000 Essential Words, book four.'),
    ('copy/vocab', 'Copybook', 'The copybook: word, part of speech, translation, synonyms, example — and your own pronunciation, recorded and reviewed with spaced repetition.'),
    ('practice/coding', 'Practice Center', 'The practice center: thousands of questions per source, code shown in a real frame, and every mistake goes to the review queue.'),
    ('analytics', 'Analytics', 'Analytics: study time from September 17th, mastery by area, and rings you can click for the full breakdown.'),
    ('goal', 'Goal board', 'The goal board: dated milestones from zero to expert. Every missed day shifts them forward — debt days you can see.'),
    ('movies', 'Movies & Videos', 'Movies and Videos: your English library — cloud files that open on any device, country, year, ratings and resume playback.'),
    ('profile', 'Profile & portfolio', 'The profile: photo, certificates by file or link, and a project portfolio with price, image and video cover.'),
    (None, 'Learn · Practice · Master · Build', 'Everything behind your own login, synced across every device, watched by a read-only controller panel. UzLeeder Academy — by UzLeeder.'),
]

def sh(cmd, **kw):
    return subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, **kw)

def serve():
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT)
    class Q(socketserver.TCPServer):
        allow_reuse_address = True
    srv = Q(('127.0.0.1', PORT), handler)
    srv.RequestHandlerClass.log_message = lambda *a, **k: None
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv

def shot(url, png, w=1920, h=1080, budget=9000):
    # --user-data-dir BERILMAYDI: alohida profil bilan headless Chrome surat olgach chiqmay qoladi (macOS)
    cmd = [CHROME, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', '--no-first-run',
           '--virtual-time-budget=%d' % budget, '--window-size=%d,%d' % (w, h), '--screenshot=' + png, url]
    try:
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=60)
    except subprocess.TimeoutExpired:
        pass
    if not os.path.exists(png): raise RuntimeError('screenshot failed: ' + url)

def slide_html(i, title, text, shot_png, total):
    cover = shot_png is None
    img = ('file://' + shot_png) if shot_png else ('file://' + os.path.join(OUT, 'cover-1920x1080.png'))
    return f"""<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=Inter:wght@500;600;700&family=JetBrains+Mono:wght@600&display=swap" rel="stylesheet">
<style>
*{{margin:0;box-sizing:border-box}}html,body{{width:1920px;height:1080px;overflow:hidden;background:#070b14;font-family:Inter,system-ui,sans-serif;color:#f2f7fb}}
body::before{{content:"";position:absolute;inset:0;background:radial-gradient(900px 600px at 20% 100%,#13223a,transparent 70%),radial-gradient(700px 500px at 90% 0%,#0f2a30,transparent 65%)}}
.grid{{position:absolute;inset:0;background-image:linear-gradient(rgba(78,200,216,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(78,200,216,.06) 1px,transparent 1px);background-size:64px 64px}}
.logo{{position:absolute;left:64px;top:44px;display:flex;align-items:center;gap:14px;z-index:2}}
.logo i{{width:44px;height:44px;border-radius:13px;background:linear-gradient(135deg,#8fe7f0,#4ec8d8);display:grid;place-items:center}}
.logo b{{font-family:Sora;font-size:24px;letter-spacing:-.01em}}.logo b span{{color:#4ec8d8}}.logo small{{display:block;font-size:10px;letter-spacing:.34em;color:#7f90aa;text-transform:uppercase;margin-top:2px}}
.n{{position:absolute;right:64px;top:52px;font:600 15px 'JetBrains Mono',monospace;letter-spacing:.14em;color:#7f90aa;z-index:2}}
.frame{{position:absolute;right:64px;top:120px;width:1330px;height:748px;border-radius:22px;overflow:hidden;background:#0c1424;border:1px solid rgba(143,231,240,.18);box-shadow:0 40px 120px rgba(0,0,0,.6),0 0 0 1px rgba(0,0,0,.4);z-index:2}}
.frame .bar{{height:38px;background:#0f1a2e;border-bottom:1px solid rgba(255,255,255,.06);display:flex;align-items:center;gap:8px;padding:0 16px}}
.frame .bar i{{width:11px;height:11px;border-radius:50%;background:#e2685a}}.frame .bar i:nth-child(2){{background:#e6b84a}}.frame .bar i:nth-child(3){{background:#4cc38a}}
.frame .bar span{{margin-left:14px;font:500 12px 'JetBrains Mono',monospace;color:#7f90aa}}
.frame img{{display:block;width:1330px;height:710px;object-fit:cover;object-position:top}}
.cover{{position:absolute;inset:0;z-index:1}}.cover img{{width:100%;height:100%;object-fit:cover}}
.cap{{position:absolute;left:64px;bottom:64px;width:440px;z-index:3}}
.cap .k{{font:700 13px 'JetBrains Mono',monospace;letter-spacing:.24em;color:#4ec8d8;text-transform:uppercase;margin-bottom:14px}}
.cap h1{{font-family:Sora;font-size:52px;line-height:1.05;letter-spacing:-.02em;margin-bottom:18px}}
.cap p{{font-size:19px;line-height:1.5;color:#b9c6d8}}
.cap .line{{width:80px;height:4px;border-radius:2px;background:linear-gradient(90deg,#4ec8d8,#8fe7f0);margin:22px 0 0}}
.cov .cap{{left:0;right:0;bottom:120px;width:auto;text-align:center}}.cov .cap h1{{font-size:64px}}.cov .cap p{{max-width:900px;margin:0 auto}}.cov .cap .line{{margin:22px auto 0}}
.cov .cover::after{{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(7,11,20,.1),rgba(7,11,20,.85))}}
.prog{{position:absolute;left:0;bottom:0;height:6px;background:linear-gradient(90deg,#4ec8d8,#8fe7f0);width:{(i+1)/total*100:.1f}%;z-index:4}}
</style></head><body class="{'cov' if cover else ''}"><div class="grid"></div>
<div class="logo"><i><svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M4 18 L9 8 L13 14 L20 5" stroke="#07141a" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="20" cy="5" r="2.3" fill="#07141a"/></svg></i><div><b>Uz<span>Leeder</span></b><small>Academy · Personal Learning OS</small></div></div>
<div class="n">{i+1:02d} / {total:02d}</div>
{'<div class="cover"><img src="'+img+'"></div>' if cover else '<div class="frame"><div class="bar"><i></i><i></i><i></i><span>uzleeder-academy · #/'+html.escape(shot_png and os.path.basename(shot_png).replace('.png','').replace('__','/') or '')+'</span></div><img src="'+img+'"></div>'}
<div class="cap"><div class="k">{'Site tour' if not cover else 'uzleeder.netlify.app'}</div><h1>{html.escape(title)}</h1><p>{html.escape(text)}</p><div class="line"></div></div>
<div class="prog"></div></body></html>"""

def dur(aiff):
    out = subprocess.run([FFMPEG, '-i', aiff], stderr=subprocess.PIPE, stdout=subprocess.PIPE).stderr.decode()
    m = re.search(r'Duration: (\d+):(\d+):(\d+\.\d+)', out)
    return int(m.group(1)) * 3600 + int(m.group(2)) * 60 + float(m.group(3))

def main():
    if os.path.exists(WORK): shutil.rmtree(WORK)
    os.makedirs(WORK)
    srv = serve(); time.sleep(0.5)
    total = len(SLIDES); segs = []
    try:
        for i, (route, title, text) in enumerate(SLIDES):
            print(f'[{i+1}/{total}] {title}')
            shot_png = None
            if route:
                shot_png = os.path.join(WORK, route.replace('/', '__') + '.png')
                shot(f'http://127.0.0.1:{PORT}/?lang=en&theme=ocean#/{route}', shot_png)
            hp = os.path.join(WORK, f'slide-{i:02d}.html')
            with open(hp, 'w') as f: f.write(slide_html(i, title, text, shot_png, total))
            sp = os.path.join(WORK, f'slide-{i:02d}.png')
            shot('file://' + hp, sp, budget=6000)
            ap = os.path.join(WORK, f'voice-{i:02d}.aiff')
            sh(['say', '-v', VOICE, '-r', RATE, '-o', ap, text])
            d = dur(ap) + 0.9
            mp = os.path.join(WORK, f'seg-{i:02d}.mp4')
            # yumshoq zoom (Ken Burns) + kirish/chiqish so'nishi + ovoz
            frames = int(d * 30)
            sh([FFMPEG, '-y', '-loop', '1', '-framerate', '30', '-i', sp, '-i', ap, '-t', f'{d:.2f}',
                '-filter_complex', f"[0:v]scale=2400:1350,zoompan=z='min(zoom+0.0006,1.06)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={frames}:s=1920x1080:fps=30,fade=t=in:st=0:d=0.5,fade=t=out:st={d-0.5:.2f}:d=0.5[v];[1:a]aresample=44100,apad,atrim=0:{d:.2f},afade=t=out:st={d-0.4:.2f}:d=0.4[a]",
                '-map', '[v]', '-map', '[a]', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k', '-ac', '2', '-shortest', mp])
            segs.append(mp)
    finally:
        srv.shutdown()
    lst = os.path.join(WORK, 'list.txt')
    with open(lst, 'w') as f:
        for m in segs: f.write(f"file '{m}'\n")
    final = os.path.join(OUT, 'site-tour-1920x1080.mp4')
    sh([FFMPEG, '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', '-movflags', '+faststart', final])
    print('done:', final, f'{os.path.getsize(final)/1e6:.1f} MB')

if __name__ == '__main__':
    main()

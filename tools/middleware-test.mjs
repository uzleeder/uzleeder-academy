/* tools/middleware-test.mjs — Edge middleware xavfsizlik testi (node tools/middleware-test.mjs) */
import crypto from 'node:crypto';
process.env.SESSION_SECRET = 's3cret';
const mw = (await import('../middleware.js')).default;
const b64u = b => Buffer.from(b).toString('base64url');
function token(payload, secret) { const body = b64u(JSON.stringify(payload)); return body + '.' + crypto.createHmac('sha256', secret || 's3cret').update(body).digest('base64url'); }
function req(path, cookie, accept) { return new Request('https://academy.test' + path, { headers: { cookie: cookie || '', accept: accept || 'text/html' } }); }
async function run(name, r, want) {
  const res = await mw(r);
  const got = res.status === 302 ? '302→' + new URL(res.headers.get('location')).pathname : res.headers.get('x-middleware-next') ? 'pass' : String(res.status);
  console.log((got === want ? 'ok   ' : 'FAIL ') + name + ' → ' + got + (got === want ? '' : ' (want ' + want + ')'));
  return got === want;
}
const exp = Date.now() + 3600000;
const learner = 'uzla_session=' + token({ u: 'max', exp });
const staff = 'uzla_ctrl=' + token({ u: 'teacher', role: 'teacher', exp });
const expired = 'uzla_session=' + token({ u: 'max', exp: Date.now() - 1 });
const forged = 'uzla_session=' + token({ u: 'max', exp }, 'wrong');
const swapped = 'uzla_session=' + token({ u: 'teacher', role: 'teacher', exp });
let ok = true;
ok &= await run('no cookie, page → login', req('/', ''), '302→/login');
ok &= await run('no cookie, api → 401', req('/api/state', '', 'application/json'), '401');
ok &= await run('learner → app', req('/', learner), 'pass');
ok &= await run('learner → api', req('/api/state', learner, 'application/json'), 'pass');
ok &= await run('expired → login', req('/', expired), '302→/login');
ok &= await run('bad signature → login', req('/', forged), '302→/login');
ok &= await run('staff token in learner cookie → login (role swap blocked)', req('/', swapped), '302→/login');
ok &= await run('staff → app page redirected to panel', req('/', staff), '302→/controller');
ok &= await run('staff → learner api 401', req('/api/state', staff, 'application/json'), '401');
ok &= await run('staff → js allowed', req('/js/app.js', staff, '*/*'), 'pass');
ok &= await run('/controller open', req('/controller', ''), 'pass');
ok &= await run('/staff open (rewrite → controller.html)', req('/staff', ''), 'pass');
ok &= await run('/api/ctrl/io open at edge (function checks role)', req('/api/ctrl/io', '', 'application/json'), 'pass');
ok &= await run('login open', req('/login', ''), 'pass');
console.log(ok ? '\nALL OK' : '\nFAILED'); process.exit(ok ? 0 : 1);

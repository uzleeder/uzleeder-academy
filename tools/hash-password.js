/* ==========================================================================
   tools/hash-password.js — istalgan parol uchun PBKDF2 hash (Vercel env uchun)
   ---------------------------------------------------------------------------
   Ishga tushirish:   node tools/hash-password.js "parol"
   Chiqadi:           pbkdf2$210000$<tuz>$<hash>
   Ishlatish:         AUTH_PASSWORD_HASH (o'quvchi) yoki CTRL_PASSWORD_HASH
                      (nazoratchi) qiymati sifatida Vercel → Environment Variables.
   Parolning o'zi hech qayerda saqlanmaydi. Format api/_lib.js bilan bir xil.
   ========================================================================== */
'use strict';
const crypto = require('crypto');
const pw = process.argv[2];
if (!pw || pw.length < 6) { console.error('Parol kamida 6 belgi: node tools/hash-password.js "parol"'); process.exit(1); }
const salt = crypto.randomBytes(16);
const hash = crypto.pbkdf2Sync(pw, salt, 210000, 32, 'sha256');
console.log('pbkdf2$210000$' + salt.toString('base64') + '$' + hash.toString('base64'));

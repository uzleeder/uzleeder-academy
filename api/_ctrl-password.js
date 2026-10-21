/* POST /api/ctrl/password → /api/password ga topshiriladi (har hisob o'z parolini
   o'zi almashtiradi; rol cookie'dan). Eski panel mijozlari uchun mos.        */
'use strict';
module.exports = function (req, res) { return require('./password')(req, res); };

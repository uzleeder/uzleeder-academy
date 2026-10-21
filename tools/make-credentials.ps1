<#
  make-credentials.ps1 — bulut akkaunt uchun parol, hash va sessiya siri
  ---------------------------------------------------------------------------
  Ishga tushirish (PowerShell):
      powershell -ExecutionPolicy Bypass -File tools\make-credentials.ps1

  Chiqadi:
    PAROL              — o'zingga (parol menejerida saqla; hech qayerga yozma)
    AUTH_PASSWORD_HASH — Vercel → Settings → Environment Variables ga
    SESSION_SECRET     — Vercel → Settings → Environment Variables ga

  Parolning O'ZI hech qayerda saqlanmaydi — serverda faqat hash bor.
  Parolni unutsang: shu skriptni qayta ishga tushir, yangi hash'ni Vercel'ga
  qo'y, redeploy qil. Progress yo'qolmaydi (u KV'da, parolga bog'liq emas).

  Algoritm: PBKDF2-HMAC-SHA256, 210 000 iteratsiya, 16 bayt tuz (OWASP
  tavsiyasi). Server (api/_lib.js) aynan shu formatni o'qiydi.
#>
Add-Type -AssemblyName System.Security

function New-RandomString([int]$len, [string]$alphabet) {
  $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
  $bytes = New-Object byte[] 4
  $sb = New-Object System.Text.StringBuilder
  $limit = [uint32]::MaxValue - ([uint32]::MaxValue % $alphabet.Length)
  for ($i = 0; $i -lt $len; $i++) {
    do { $rng.GetBytes($bytes); $v = [BitConverter]::ToUInt32($bytes, 0) } while ($v -ge $limit)
    [void]$sb.Append($alphabet[$v % $alphabet.Length])
  }
  $sb.ToString()
}

# 0/O, 1/l/I kabi chalkashadigan belgilar yo'q — qo'lda terish uchun
$alpha = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789'
$password = (New-RandomString 8 $alpha) + '-' + (New-RandomString 8 $alpha) + '-' + (New-RandomString 8 $alpha)

$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$salt = New-Object byte[] 16;  $rng.GetBytes($salt)
$secret = New-Object byte[] 32; $rng.GetBytes($secret)

$iter = 210000
$kdf = New-Object System.Security.Cryptography.Rfc2898DeriveBytes($password, $salt, $iter, [System.Security.Cryptography.HashAlgorithmName]::SHA256)
$hash = $kdf.GetBytes(32)

Write-Host ''
Write-Host 'PAROL (faqat o''zingga):' -ForegroundColor Yellow
Write-Host "  $password"
Write-Host ''
Write-Host 'Vercel Environment Variables:' -ForegroundColor Cyan
Write-Host ('  AUTH_PASSWORD_HASH = pbkdf2$' + $iter + '$' + [Convert]::ToBase64String($salt) + '$' + [Convert]::ToBase64String($hash))
Write-Host ('  SESSION_SECRET     = ' + [Convert]::ToBase64String($secret))
Write-Host ''

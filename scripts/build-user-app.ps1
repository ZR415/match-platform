# 用户端构建脚本
# 将 user-app/src/*.js 按顺序拼接，替换 index-shell.html 中的 /*__APP_CODE__*/ 占位符，
# 产出可直接运行的 user-app/index.html（单文件、无构建依赖）。
# 用法：powershell -ExecutionPolicy Bypass -File .\scripts\build-user-app.ps1
$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$appDir = Join-Path $root 'user-app'
$files = @(
  '00-core.js',
  '01-data.js',
  '01b-pickers.js',
  '02-auth.js',
  '03-square.js',
  '04-detail.js',
  '05-chat.js',
  '06a-profile.js',
  '06b-library.js',
  '07-app.js'
)

$code = ($files | ForEach-Object { Get-Content -Raw (Join-Path $appDir "src\$_") }) -join "`n"
$shell = Get-Content -Raw (Join-Path $appDir 'index-shell.html')
$out = $shell.Replace('/*__APP_CODE__*/', $code)

[IO.File]::WriteAllText(
  (Join-Path $appDir 'index.html'),
  $out,
  (New-Object System.Text.UTF8Encoding($false))
)

Write-Host "Build OK -> user-app/index.html ($($out.Length) chars)" -ForegroundColor Green

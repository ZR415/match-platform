# 本地预览脚本
# 用法：powershell -ExecutionPolicy Bypass -File .\scripts\start.ps1
# 启动后访问：
#   用户端  http://localhost:5173/user-app/
#   管理端  http://localhost:5173/admin-console/admin.html
$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

Write-Host ''
Write-Host '  搭子Match Demo' -ForegroundColor Green
Write-Host '  用户端  ->  http://localhost:5173/user-app/' -ForegroundColor Cyan
Write-Host '  管理端  ->  http://localhost:5173/admin-console/admin.html' -ForegroundColor Cyan
Write-Host '  Ctrl+C 停止' -ForegroundColor DarkGray
Write-Host ''

python -m http.server 5173

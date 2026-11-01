# 本地预览脚本：运行后在浏览器打开 http://localhost:5173/
# 用法：右键 -> 使用 PowerShell 运行，或执行 powershell -ExecutionPolicy Bypass -File .\start.ps1
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
Write-Host '搭子Match Demo  ->  http://localhost:5173/  (Ctrl+C 停止)' -ForegroundColor Green
python -m http.server 5173

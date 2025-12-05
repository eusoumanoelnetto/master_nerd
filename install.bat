@echo off
setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════╗
echo ║         MASTER NERD - ONE-CLICK LAUNCHER       ║
echo ╚════════════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [!] Node.js not detected.
    echo [>] Installing Node.js via chocolatey...
    powershell -Command "if (-not (Get-Command choco -ErrorAction SilentlyContinue)) { Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1')) }"
    choco install nodejs -y
    if errorlevel 1 (
        echo [!] Node.js installation failed. Please install manually from https://nodejs.org/
        pause
        exit /b 1
    )
)

echo [OK] Node.js detected.
echo.

REM Navigate to master-nerd folder
cd /d "%~dp0master-nerd"
if errorlevel 1 (
    echo [!] Failed to navigate to master-nerd folder.
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules\" (
    echo [>] Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo [!] npm install failed.
        pause
        exit /b 1
    )
)

echo [>] Launching Master Nerd...
echo.
call npm start

pause

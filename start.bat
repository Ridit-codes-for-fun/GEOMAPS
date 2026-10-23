@echo off
cd /d "%~dp0"
where node >nul 2>nul || (echo Node.js 20 or newer is required: https://nodejs.org/ & pause & exit /b 1)
start "" http://127.0.0.1:5173/
node server.js

@echo off
title FitVibe AI - Dangal Wrestling & Mobile Prototype
echo =========================================================
echo       FitVibe AI: Dangal Wrestling & Fitness Ecosystem
echo =========================================================
echo Starting Server and Public Mobile Tunnel...
echo.

cd /d "C:\Users\Sahil\.gemini\antigravity\scratch\SIH_2026_PS26196\prototype"
start https://127.0.0.1:5050
start /B python tunnel_service.py
python app.py
pause

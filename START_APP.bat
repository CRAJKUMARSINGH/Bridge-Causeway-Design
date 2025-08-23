@echo off
title Causeway Design Pro - Easy Startup
color 0A

echo.
echo ========================================
echo    🚧 CAUSEWAY DESIGN PRO APP 🚧
echo ========================================
echo.
echo Starting the application...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: Node.js is not installed!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Then run this batch file again.
    echo.
    pause
    exit /b 1
)

REM Check if dependencies are installed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies!
        pause
        exit /b 1
    )
    echo ✅ Dependencies installed successfully!
    echo.
)

echo 🚀 Starting Causeway Design Pro...
echo.
echo 📱 The app will open in your browser automatically
echo 🌐 Or manually visit: http://localhost:3000
echo.
echo ⚠️  Keep this window open while using the app
echo.
echo ========================================
echo.

REM Start the application
npm start

echo.
echo ========================================
echo    App stopped. Press any key to exit.
echo ========================================
pause >nul

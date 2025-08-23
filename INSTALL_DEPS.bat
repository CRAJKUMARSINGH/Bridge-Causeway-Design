@echo off
title Causeway Design Pro - Install Dependencies
color 0B

echo.
echo ========================================
echo    📦 DEPENDENCY INSTALLATION 📦
echo ========================================
echo.
echo Installing all required packages...
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

echo ✅ Node.js found: 
node --version
echo.

REM Check if npm is available
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: npm is not available!
    echo.
    echo Please reinstall Node.js to fix this issue.
    pause
    exit /b 1
)

echo ✅ npm found:
npm --version
echo.

REM Clean existing node_modules if present
if exist "node_modules" (
    echo 🧹 Cleaning existing dependencies...
    rmdir /s /q node_modules
    echo ✅ Cleaned successfully!
    echo.
)

REM Clean package-lock.json if present
if exist "package-lock.json" (
    echo 🧹 Cleaning package-lock.json...
    del package-lock.json
    echo ✅ Cleaned successfully!
    echo.
)

echo 📦 Installing dependencies...
echo This may take a few minutes...
echo.

npm install

if %errorlevel% neq 0 (
    echo.
    echo ❌ Installation failed!
    echo.
    echo Common solutions:
    echo 1. Check your internet connection
    echo 2. Try running as Administrator
    echo 3. Clear npm cache: npm cache clean --force
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo    ✅ INSTALLATION COMPLETE! ✅
echo ========================================
echo.
echo 🎉 All dependencies installed successfully!
echo.
echo 🚀 You can now run START_APP.bat to start the application
echo.
echo ========================================
echo.
pause

# MUJ Volleyball Management System - Production Build Script (Windows Powershell)

Write-Host "🚀 Starting Production Build Process..." -ForegroundColor Cyan

# 1. Clean previous build
Write-Host "🧹 Cleaning previous build..." -ForegroundColor Yellow
if (Test-Path "frontend/dist") {
    Remove-Item -Path "frontend/dist" -Recurse -Force
}

# 2. Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
Set-Location frontend
npm ci

# 3. Run Linting (optional)
Write-Host "🔍 Running linting..." -ForegroundColor Yellow
npm run lint

# 4. Build for production
Write-Host "🏗️ Building for production..." -ForegroundColor Yellow
npm run build:prod

# 5. Verify Build
if (Test-Path "dist") {
    Write-Host "✅ Build completed successfully! Output in frontend/dist/" -ForegroundColor Green
    
    # 6. Preview Build
    Write-Host "🌐 Starting preview server..." -ForegroundColor Cyan
    Write-Host "Access at: http://localhost:4173" -ForegroundColor Gray
    npm run preview
} else {
    Write-Host "❌ Build failed. Please check the logs above." -ForegroundColor Red
    exit 1
}

Set-Location ..

# Test OCR Setup Script
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "Testing OCR Configuration" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# Test 1: Check if Tesseract is installed
Write-Host "`n[1/3] Checking Tesseract installation..." -ForegroundColor Yellow

$tesseractPaths = @(
    "C:\Program Files\Tesseract-OCR\tesseract.exe",
    "C:\Program Files (x86)\Tesseract-OCR\tesseract.exe"
)

$found = $false
foreach ($path in $tesseractPaths) {
    if (Test-Path $path) {
        Write-Host "✅ Tesseract found at: $path" -ForegroundColor Green
        & $path --version
        $found = $true
        break
    }
}

if (-not $found) {
    Write-Host "❌ Tesseract not found!" -ForegroundColor Red
    Write-Host "   Download from: https://github.com/UB-Mannheim/tesseract/wiki" -ForegroundColor Yellow
}

# Test 2: Check Python packages
Write-Host "`n[2/3] Checking Python packages..." -ForegroundColor Yellow

$packages = @("pytesseract", "opencv-python", "Pillow")
foreach ($pkg in $packages) {
    $installed = pip show $pkg 2>$null
    if ($installed) {
        Write-Host "✅ $pkg installed" -ForegroundColor Green
    } else {
        Write-Host "❌ $pkg not installed" -ForegroundColor Red
    }
}

# Test 3: Check if backend files are ready for deployment
Write-Host "`n[3/3] Checking deployment files..." -ForegroundColor Yellow

$deployFiles = @(
    "apt-packages",
    "build.sh",
    "render.yaml",
    "requirements.txt"
)

foreach ($file in $deployFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file exists" -ForegroundColor Green
    } else {
        Write-Host "❌ $file missing" -ForegroundColor Red
    }
}

Write-Host "`n==================================================" -ForegroundColor Cyan
Write-Host "Test Complete!" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Fix any ❌ issues above" -ForegroundColor White
Write-Host "2. Push to GitHub: git add . && git commit -m 'Add OCR fix' && git push" -ForegroundColor White
Write-Host "3. Deploy to Render (auto-deploys or manual)" -ForegroundColor White
Write-Host "4. Check Render build logs for Tesseract installation" -ForegroundColor White

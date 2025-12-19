#!/bin/bash
# Build script for Render deployment
# Note: System packages are installed via apt-packages file

echo "🚀 Starting build process..."
echo "📦 Tesseract and system dependencies are installed via apt-packages file"

# Upgrade pip
echo "⬆️  Upgrading pip..."
pip install --upgrade pip

# Install Python packages
echo "📚 Installing Python packages..."
pip install -r requirements.txt

# Verify Tesseract installation
echo "🔍 Checking for Tesseract..."
if command -v tesseract &> /dev/null; then
    echo "✅ Tesseract found at: $(which tesseract)"
    tesseract --version
else
    echo "⚠️  Warning: Tesseract not found. OCR may not work."
    echo "   Make sure apt-packages file exists with tesseract-ocr"
fi

echo "✨ Build complete!"

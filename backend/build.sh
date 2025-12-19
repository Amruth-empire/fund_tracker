#!/bin/bash
# Build script for Render deployment

# Install system dependencies for Tesseract OCR
echo "Installing Tesseract OCR and dependencies..."

# Update apt
apt-get update

# Install Tesseract and required libraries
apt-get install -y tesseract-ocr tesseract-ocr-eng libtesseract-dev libleptonica-dev

# Install OpenCV system dependencies
apt-get install -y libgl1-mesa-glx libglib2.0-0

# Install Python packages
echo "Installing Python packages..."
pip install -r requirements.txt

echo "Build complete!"

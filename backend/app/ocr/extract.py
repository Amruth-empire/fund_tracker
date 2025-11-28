from pathlib import Path
from typing import Dict, Any
from PIL import Image
import pytesseract
from app.ocr.preprocess import preprocess_image


def extract_text(image_path: str) -> str:
    img = Image.open(Path(image_path))
    img = preprocess_image(img)
    return pytesseract.image_to_string(img)

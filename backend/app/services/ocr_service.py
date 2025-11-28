from pathlib import Path
from typing import Dict, Any
from PIL import Image
import pytesseract

from app.ocr.preprocess import preprocess_image


def extract_invoice_fields(image_path: str) -> Dict[str, Any]:
    """
    Very simple OCR; you can improve field extraction later.
    """
    img_path = Path(image_path)
    img = Image.open(img_path)
    img = preprocess_image(img)

    text = pytesseract.image_to_string(img)

    # Very naive parsing – replace with regex / custom logic
    data = {
        "raw_text": text,
        "invoice_number": "",
        "vendor_name": "",
        "amount": 0.0,
    }
    return data

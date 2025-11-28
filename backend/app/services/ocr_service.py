import re
from pathlib import Path
from typing import Dict, Any
from PIL import Image
import pytesseract

from app.ocr.preprocess import preprocess_image


def extract_invoice_fields(image_path: str) -> Dict[str, Any]:
    """
    Extract invoice fields using OCR and regex pattern matching.
    """
    img_path = Path(image_path)
    img = Image.open(img_path)
    img = preprocess_image(img)

    text = pytesseract.image_to_string(img)

    # Normalize text for better matching
    text_lower = text.lower()

    def find(pattern):
        """Helper function to find pattern in text"""
        match = re.search(pattern, text_lower, re.IGNORECASE)
        return match.group(1).strip() if match else ""

    # Extract invoice number (multiple patterns)
    invoice_no = (
        find(r"invoice\s*(?:no|number|#)[:\-\s]*([a-z0-9\-]+)") or
        find(r"inv[:\-\s]*([a-z0-9\-]+)") or
        find(r"bill\s*(?:no|number)[:\-\s]*([a-z0-9\-]+)")
    )

    # Extract vendor name (multiple patterns)
    vendor = (
        find(r"vendor[:\-\s]*([a-z0-9\s]+?)(?:\n|invoice|date|amount)") or
        find(r"company[:\-\s]*([a-z0-9\s]+?)(?:\n|invoice|date|amount)") or
        find(r"from[:\-\s]*([a-z0-9\s]+?)(?:\n|invoice|date|amount)") or
        find(r"seller[:\-\s]*([a-z0-9\s]+?)(?:\n|invoice|date|amount)")
    )

    # Extract amount (multiple patterns)
    amount_str = (
        find(r"(?:total|amount|sum)[:\-\s]*(?:rs\.?|₹)?\s*([0-9,\.]+)") or
        find(r"(?:grand\s*total)[:\-\s]*(?:rs\.?|₹)?\s*([0-9,\.]+)") or
        find(r"₹\s*([0-9,\.]+)") or
        find(r"rs\.?\s*([0-9,\.]+)")
    )

    # Convert amount to float
    try:
        amount_val = float(amount_str.replace(",", "").replace(" ", ""))
    except (ValueError, AttributeError):
        amount_val = 0.0

    # Extract date if possible
    date = find(r"date[:\-\s]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})")

    # Extract GST if available
    gst = find(r"(?:gst|gstin)[:\-\s]*([a-z0-9]+)")

    data = {
        "invoice_number": invoice_no.upper() if invoice_no else "",
        "vendor_name": vendor.title() if vendor else "",
        "amount": amount_val,
        "date": date,
        "gst": gst.upper() if gst else "",
        "raw_text": text
    }
    
    return data

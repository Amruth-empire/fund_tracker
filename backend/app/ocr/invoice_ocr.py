import cv2
import pytesseract
import numpy as np
import re
import platform

# Set tesseract path based on OS
if platform.system() == "Windows":
    pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# ------------------------------
# Extract Key Fields
# ------------------------------
def extract_key_fields(img):
    """Extract invoice number, vendor name, and amount from image"""
    text = pytesseract.image_to_string(img).lower()

    def find(patterns):
        """Try multiple regex patterns and return first match"""
        for pattern in patterns:
            m = re.search(pattern, text, re.IGNORECASE)
            if m:
                return m.group(1).strip() if len(m.groups()) > 0 else m.group(0).strip()
        return ""

    # Invoice number patterns
    invoice_patterns = [
        r"invoice\s*(?:no|number|#)[:\-]?\s*([a-z0-9\-\/]+)",
        r"inv\s*(?:no|#)?[:\-]?\s*([a-z0-9\-\/]+)",
        r"bill\s*(?:no|number)[:\-]?\s*([a-z0-9\-\/]+)"
    ]

    # Vendor name patterns
    vendor_patterns = [
        r"vendor[:\-]?\s*([a-z0-9 .,&\(\)]+?)(?:\n|$)",
        r"company[:\-]?\s*([a-z0-9 .,&\(\)]+?)(?:\n|$)",
        r"from[:\-]?\s*([a-z0-9 .,&\(\)]+?)(?:\n|$)",
        r"seller[:\-]?\s*([a-z0-9 .,&\(\)]+?)(?:\n|$)"
    ]

    # Amount patterns
    amount_patterns = [
        r"total[:\-]?\s*(?:rs\.?|₹)?\s*([0-9,\.]+)",
        r"amount[:\-]?\s*(?:rs\.?|₹)?\s*([0-9,\.]+)",
        r"grand\s*total[:\-]?\s*(?:rs\.?|₹)?\s*([0-9,\.]+)",
        r"₹\s*([0-9,\.]+)",
        r"rs\.?\s*([0-9,\.]+)"
    ]

    invoice_no = find(invoice_patterns)
    vendor = find(vendor_patterns)
    amount = find(amount_patterns)

    # Clean up extracted values
    if amount:
        amount = amount.replace(",", "").replace(" ", "")

    return {
        "invoice_number_ocr": invoice_no,
        "vendor_name_ocr": vendor.strip(),
        "amount_ocr": amount
    }

# ------------------------------
# Extract Table
# ------------------------------
def extract_table(image_path):
    """Extract table data from invoice image"""
    try:
        img = cv2.imread(image_path)
        if img is None:
            return []

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # Apply adaptive thresholding
        thresh = cv2.adaptiveThreshold(
            gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C,
            cv2.THRESH_BINARY_INV, 15, 8
        )

        # Find contours
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        if not contours:
            return []

        # Find largest contour (likely the table)
        table_contour = max(contours, key=cv2.contourArea)

        x, y, w, h = cv2.boundingRect(table_contour)
        roi = gray[y:y+h, x:x+w]

        # Extract text with position data
        data = pytesseract.image_to_data(roi, output_type=pytesseract.Output.DICT)

        rows = []
        cur = []
        prev = None

        for i in range(len(data["text"])):
            if int(data["conf"][i]) > 40:
                top = data["top"][i]
                word = data["text"][i].strip()

                if not word:
                    continue

                if prev is None:
                    prev = top

                # New row detection (vertical gap)
                if abs(top - prev) > 25:
                    if cur:
                        rows.append(cur)
                    cur = []
                    prev = top

                cur.append(word)

        if cur:
            rows.append(cur)

        return rows

    except Exception as e:
        print(f"Table extraction error: {str(e)}")
        return []

# ------------------------------
# Main OCR Driver
# ------------------------------
def process_invoice_ocr(filepath):
    """Process invoice and extract fields + table"""
    try:
        img = cv2.imread(filepath)
        if img is None:
            return {
                "ocr_fields": {
                    "invoice_number_ocr": "",
                    "vendor_name_ocr": "",
                    "amount_ocr": ""
                },
                "ocr_table": []
            }

        fields = extract_key_fields(img)
        table = extract_table(filepath)

        return {
            "ocr_fields": fields,
            "ocr_table": table
        }

    except Exception as e:
        print(f"OCR processing error: {str(e)}")
        return {
            "ocr_fields": {
                "invoice_number_ocr": "",
                "vendor_name_ocr": "",
                "amount_ocr": ""
            },
            "ocr_table": []
        }

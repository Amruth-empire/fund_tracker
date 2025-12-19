import cv2
import pytesseract
import numpy as np
import re
import platform
import os

# Set tesseract path based on OS and environment
if platform.system() == "Windows":
    # Try multiple common Tesseract installation paths for Windows
    possible_paths = [
        r"C:\Program Files\Tesseract-OCR\tesseract.exe",
        r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
        r"C:\Users\{}\AppData\Local\Programs\Tesseract-OCR\tesseract.exe".format(os.getenv('USERNAME')),
    ]
    
    for path in possible_paths:
        if os.path.exists(path):
            pytesseract.pytesseract.tesseract_cmd = path
            break
else:
    # For Linux/Unix (Production on Render)
    # Check if tesseract is in PATH or set explicit path
    tesseract_cmd = os.getenv('TESSERACT_CMD', 'tesseract')
    
    # Try to find tesseract
    import shutil
    tesseract_path = shutil.which(tesseract_cmd)
    
    if tesseract_path:
        pytesseract.pytesseract.tesseract_cmd = tesseract_path
        print(f"✅ Tesseract found at: {tesseract_path}")
    else:
        # Try common Linux paths
        linux_paths = [
            '/usr/bin/tesseract',
            '/usr/local/bin/tesseract',
            '/app/.apt/usr/bin/tesseract',  # Render specific
        ]
        for path in linux_paths:
            if os.path.exists(path):
                pytesseract.pytesseract.tesseract_cmd = path
                print(f"✅ Tesseract found at: {path}")
                break

# ------------------------------
# Extract Key Fields
# ------------------------------
def extract_key_fields(img):
    """Extract invoice number, vendor name, and amount from image"""
    # Get OCR data with position information
    data = pytesseract.image_to_data(img, output_type=pytesseract.Output.DICT)
    
    # Clean OCR data
    ocr_data = [
        {"text": data['text'][i], "left": data['left'][i], "top": data['top'][i], "conf": int(data['conf'][i])}
        for i in range(len(data['text']))
        if data['text'][i].strip() and int(data['conf'][i]) > 40
    ]
    
    # Define keywords to search for
    keywords = {
        "invoice": ["Invoice #", "Invoice", "INV", "Invoice Number"],
        "vendor": ["Your Company LLC", "Company", "Vendor"],
        "amount": ["Amount Due", "Grand Total", "Total Amount", "Total", "Amount"]
    }
    
    results = {
        "invoice_number_ocr": "",
        "vendor_name_ocr": "",
        "amount_ocr": ""
    }
    
    # Function to find keyword and extract nearby value
    def find_value_near_keyword(keyword_variants, key_type):
        for keyword in keyword_variants:
            keyword_parts = keyword.split()
            
            # Find keyword match
            for i in range(len(ocr_data) - len(keyword_parts) + 1):
                consecutive_match = all(
                    ocr_data[i + j]['text'].lower() == keyword_parts[j].lower()
                    for j in range(len(keyword_parts))
                )
                
                if consecutive_match:
                    keyword_left = ocr_data[i + len(keyword_parts) - 1]['left']
                    keyword_top = ocr_data[i]['top']
                    
                    # Find text to the right of keyword
                    # For amounts, collect all consecutive numbers on the same line
                    if key_type == "amount":
                        candidates_on_line = []
                        for candidate in ocr_data:
                            vertical_distance = abs(candidate['top'] - keyword_top)
                            horizontal_distance = candidate['left'] - keyword_left
                            
                            if vertical_distance < 15 and horizontal_distance > 0 and horizontal_distance < 400:
                                # Check if it contains numbers
                                if re.search(r'\d', candidate['text']):
                                    candidates_on_line.append((candidate['left'], candidate['text']))
                        
                        if candidates_on_line:
                            # Sort by position and concatenate all numbers
                            candidates_on_line.sort(key=lambda x: x[0])
                            amount_parts = []
                            for _, text in candidates_on_line:
                                cleaned = re.sub(r'[^\d]', '', text)
                                if cleaned:
                                    amount_parts.append(cleaned)
                            
                            if amount_parts:
                                # Join all parts to form complete amount (e.g., "4" + "800" = "4800")
                                full_amount = ''.join(amount_parts)
                                try:
                                    if int(full_amount) >= 100:
                                        return full_amount
                                except:
                                    pass
                    else:
                        # For invoice and vendor, find closest single value
                        closest_value = ""
                        min_distance = float('inf')
                        
                        for candidate in ocr_data:
                            vertical_distance = abs(candidate['top'] - keyword_top)
                            horizontal_distance = candidate['left'] - keyword_left
                            
                            if vertical_distance < 15 and horizontal_distance > 0 and horizontal_distance < 300:
                                # Skip "NO" if looking for invoice number
                                if key_type == "invoice" and candidate['text'].upper() == "NO":
                                    continue
                                
                                if horizontal_distance < min_distance:
                                    min_distance = horizontal_distance
                                    closest_value = candidate['text']
                        
                        if closest_value:
                            # Clean based on type
                            if key_type == "invoice":
                                # Only keep if it has digits
                                if re.search(r'\d', closest_value):
                                    closest_value = re.sub(r'[^\w\-\/]', '', closest_value)
                                else:
                                    closest_value = ""
                            
                            if closest_value:
                                return closest_value
        
        return ""
    
    # Extract invoice number
    results["invoice_number_ocr"] = find_value_near_keyword(keywords["invoice"], "invoice")
    
    # Extract vendor name - look for company name near top of document (first line only)
    for item in ocr_data[:30]:  # Check first 30 items
        text_lower = item['text'].lower()
        if "company" in text_lower or "llc" in text_lower or "ltd" in text_lower or "inc" in text_lower:
            # Get only words on the same line (tight vertical tolerance)
            company_parts = []
            item_top = item['top']
            for candidate in ocr_data:
                if abs(candidate['top'] - item_top) < 10:  # Stricter tolerance for same line
                    # Skip if it looks like an address (contains numbers like "123" or "111-222")
                    if not re.search(r'\d{3}', candidate['text']):
                        company_parts.append((candidate['left'], candidate['text']))
            
            if company_parts:
                company_parts.sort(key=lambda x: x[0])
                vendor_name = " ".join([part[1] for part in company_parts])
                # Limit to reasonable length (first 50 characters)
                results["vendor_name_ocr"] = vendor_name[:50].strip()
                break
    
    # Extract amount
    results["amount_ocr"] = find_value_near_keyword(keywords["amount"], "amount")
    
    # Fallback: Use regex on full text for better extraction
    full_text = pytesseract.image_to_string(img)
    
    if not results["invoice_number_ocr"] or results["invoice_number_ocr"].lower() in ["number", "no"]:
        # Try multiple patterns for invoice number
        patterns = [
            r'invoice\s*no\s*[:\-]?\s*(\d+)',  # INVOICE NO 101
            r'invoice\s*number\s*[:\-#]?\s*[#]?(\d+)',  # Invoice Number: #1234
            r'inv[:\-\s]+(\d+)',  # INV: 101
            r'#\s*(\d{3,})',  # #1234
            r'invoice\s*[#]\s*(\d+)',  # Invoice #1234
            r'(?:^|\n)(\d{3,})(?:\s|$)',  # Standalone 3+ digit number
        ]
        for pattern in patterns:
            match = re.search(pattern, full_text, re.IGNORECASE)
            if match:
                results["invoice_number_ocr"] = match.group(1)
                break
    
    if not results["amount_ocr"] or results["amount_ocr"] == "":
        # Try multiple patterns for total/subtotal amount
        patterns = [
            r'grand\s*total\s*[:.\-]?\s*(?:rs\.?|₹|\$)?\s*([0-9,\.]+)',  # Grand Total first (highest priority)
            r'total\s*amount\s*[:.\-]?\s*(?:rs\.?|₹|\$)?\s*([0-9,\.]+)',  # Total Amount
            r'amount\s*due\s*[:.\-]?\s*(?:rs\.?|₹|\$)?\s*([0-9,\.]+)',  # Amount Due
            r'total\s*[:.\-]?\s*(?:rs\.?|₹|\$)?\s*([0-9,\.\s]+)',  # Total: Rs. 2,800.00 or Total: 4 800
            r'sub\s*total\s*[:.\-]?\s*(?:rs\.?|₹|\$)?\s*([0-9,\.]+)',  # Subtotal
            r'amount\s*[:.\-]?\s*(?:rs\.?|₹|\$)?\s*([0-9,\.\s]+)',  # Amount: 4800 or Amount: 4 800
            r'(?:rs\.?|₹)\s*([0-9,\.\s]{4,})',  # Rs. 4 800 or ₹4800
            r'\$\s*([0-9,\.\s]{4,})',  # $4800 or $ 4 800
        ]
        for pattern in patterns:
            match = re.search(pattern, full_text, re.IGNORECASE)
            if match:
                amount_str = match.group(1).replace(',', '').replace(' ', '').replace('.00', '')
                # Only accept if it's a reasonable amount (more than 100)
                try:
                    amount_val = float(amount_str)
                    if amount_val >= 100:
                        results["amount_ocr"] = str(int(amount_val))  # Get integer value
                        break
                except:
                    continue
    
    return results

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
            gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY_INV, 15, 8
        )

        # Find contours
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        if not contours:
            return []

        # Find table-like region (large rectangular area)
        table_roi = None
        for contour in contours:
            x, y, w, h = cv2.boundingRect(contour)
            if w > 400 and h > 150:  # Table size threshold
                table_roi = img[y:y+h, x:x+w]
                break
        
        if table_roi is None:
            return []

        # Extract text with position data from table ROI
        data = pytesseract.image_to_data(table_roi, output_type=pytesseract.Output.DICT)

        # Clean and structure OCR data
        ocr_data = [
            {"text": data['text'][i], "left": data['left'][i], "top": data['top'][i], "conf": int(data['conf'][i])}
            for i in range(len(data['text']))
            if data['text'][i].strip() and int(data['conf'][i]) > 50
        ]

        # Group text into rows using 'top' coordinate
        rows_dict = {}
        for item in ocr_data:
            row_key = item['top'] // 10  # Group rows with 10-pixel tolerance
            if row_key not in rows_dict:
                rows_dict[row_key] = []
            rows_dict[row_key].append((item['left'], item['text']))

        # Parse rows dynamically
        table = []
        for _, row in sorted(rows_dict.items(), key=lambda x: x[0]):
            row = sorted(row, key=lambda x: x[0])  # Sort by left position
            parsed_row = []
            product_name = []

            for text in [entry[1] for entry in row]:
                if text.isdigit():  # NO or QUANTITY column
                    if product_name:
                        parsed_row.append(" ".join(product_name))
                        product_name = []
                    parsed_row.append(text)
                elif re.match(r'^\$?\d+(\.\d+)?$', text):  # RATE or AMOUNT column
                    if product_name:
                        parsed_row.append(" ".join(product_name))
                        product_name = []
                    parsed_row.append(text)
                else:  # Product Name
                    product_name.append(text)

            if product_name:  # Append remaining product name
                parsed_row.append(" ".join(product_name))

            # Only add rows with sufficient columns
            if len(parsed_row) >= 3:
                table.append(parsed_row)

        return table

    except Exception as e:
        print(f"Table extraction error: {str(e)}")
        return []

# ------------------------------
# Main OCR Driver
# ------------------------------
def process_invoice_ocr(filepath):
    """Process invoice and extract fields + table"""
    try:
        # Check if Tesseract is available
        try:
            pytesseract.get_tesseract_version()
        except Exception as e:
            print(f"Tesseract not found: {str(e)}")
            print("Please install Tesseract OCR from: https://github.com/UB-Mannheim/tesseract/wiki")
            # Return empty results if Tesseract is not installed
            return {
                "ocr_fields": {
                    "invoice_number_ocr": "Tesseract not installed",
                    "vendor_name_ocr": "Tesseract not installed",
                    "amount_ocr": "0"
                },
                "ocr_table": []
            }
        
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

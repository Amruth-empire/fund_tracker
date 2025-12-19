"""
Migration script to add fraud_category and amount_mismatch_percentage fields to invoices table
Run this once to update your database schema
"""
import sqlite3
from pathlib import Path

# Path to your database
DB_PATH = Path(__file__).parent / "fund_tracker.db"

def migrate():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    print("Starting migration: Adding fraud detection fields to invoices table...")
    
    try:
        # Add new columns for fraud detection
        columns_to_add = [
            ("fraud_category", "TEXT"),
            ("amount_mismatch_percentage", "REAL"),
        ]
        
        for column_name, column_type in columns_to_add:
            try:
                cursor.execute(f"ALTER TABLE invoices ADD COLUMN {column_name} {column_type}")
                print(f"✓ Added column: {column_name}")
            except sqlite3.OperationalError as e:
                if "duplicate column name" in str(e).lower():
                    print(f"⚠ Column {column_name} already exists, skipping...")
                else:
                    raise
        
        conn.commit()
        print("\n✅ Migration completed successfully!")
        print("Fraud detection fields added: fraud_category and amount_mismatch_percentage")
        print("You can now restart your FastAPI server.")
        
    except Exception as e:
        conn.rollback()
        print(f"\n❌ Migration failed: {e}")
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    migrate()

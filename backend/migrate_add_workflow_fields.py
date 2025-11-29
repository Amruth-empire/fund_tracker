"""
Migration script to add workflow fields to invoices table
Run this once to update your database schema
"""
import sqlite3
from pathlib import Path

# Path to your database
DB_PATH = Path(__file__).parent / "fund_tracker.db"

def migrate():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    print("Starting migration: Adding workflow fields to invoices table...")
    
    try:
        # Add new columns one by one (SQLite doesn't support adding multiple columns at once)
        columns_to_add = [
            ("uploaded_by", "TEXT DEFAULT 'contractor'"),
            ("status", "TEXT DEFAULT 'pending'"),
            ("submitted_by_user_id", "INTEGER"),
            ("verified_by_user_id", "INTEGER"),
            ("created_at", "TIMESTAMP"),
            ("verified_at", "TIMESTAMP"),
            ("admin_notes", "TEXT"),
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
        
        # Update existing invoices with default values
        cursor.execute("""
            UPDATE invoices 
            SET created_at = datetime('now')
            WHERE created_at IS NULL
        """)
        
        conn.commit()
        print("\n✅ Migration completed successfully!")
        print("You can now restart your FastAPI server.")
        
    except Exception as e:
        conn.rollback()
        print(f"\n❌ Migration failed: {e}")
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    migrate()

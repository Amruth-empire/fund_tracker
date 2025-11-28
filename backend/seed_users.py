"""
Seed script to create default users
Run this with: python seed_users.py
"""
from sqlalchemy.orm import Session
from app.config.database import SessionLocal, engine, Base
from app.models.user_model import User
from app.utils.hashing import hash_password

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

def seed_default_users():
    db: Session = SessionLocal()
    
    try:
        # Check if users already exist
        admin_exists = db.query(User).filter(User.email == "admin@panchayat.gov.in").first()
        contractor_exists = db.query(User).filter(User.email == "contractor@panchayat.gov.in").first()
        
        if not admin_exists:
            admin = User(
                name="District Admin",
                email="admin@panchayat.gov.in",
                password=hash_password("admin@123"),
                role="admin"
            )
            db.add(admin)
            print("✅ Admin user created: admin@panchayat.gov.in / admin@123")
        else:
            print("ℹ️  Admin user already exists")
        
        if not contractor_exists:
            contractor = User(
                name="Contractor",
                email="contractor@panchayat.gov.in",
                password=hash_password("contractor@123"),
                role="contractor"
            )
            db.add(contractor)
            print("✅ Contractor user created: contractor@panchayat.gov.in / contractor@123")
        else:
            print("ℹ️  Contractor user already exists")
        
        db.commit()
        print("\n✅ Database seeded successfully!")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("🌱 Seeding default users...\n")
    seed_default_users()

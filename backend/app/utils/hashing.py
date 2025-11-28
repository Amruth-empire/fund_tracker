from passlib.context import CryptContext

# Configure bcrypt with explicit rounds to avoid version issues
pwd_cxt = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=12
)


def hash_password(password: str) -> str:
    # Ensure password is not too long for bcrypt (72 bytes max)
    if len(password.encode('utf-8')) > 72:
        raise ValueError("Password is too long (max 72 bytes)")
    return pwd_cxt.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_cxt.verify(plain, hashed)

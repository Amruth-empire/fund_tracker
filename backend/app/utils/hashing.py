from passlib.context import CryptContext

pwd_cxt = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_cxt.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_cxt.verify(plain, hashed)

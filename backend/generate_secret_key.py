import secrets

# Generate a secure SECRET_KEY for your backend
secret_key = secrets.token_urlsafe(32)

print("=" * 60)
print("🔑 Generated SECRET_KEY for Render Environment Variables")
print("=" * 60)
print(f"\n{secret_key}\n")
print("=" * 60)
print("\nCopy this key and add it to Render's Environment Variables")
print("Variable name: SECRET_KEY")
print("=" * 60)

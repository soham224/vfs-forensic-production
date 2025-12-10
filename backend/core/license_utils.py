import base64
import hashlib

from cryptography.fernet import Fernet


class CryptographyHandler:
    def __init__(self, secret_key):
        self.secret_key = secret_key
        hash_digest = hashlib.sha256(self.secret_key.encode()).digest()
        self.cipher = Fernet(base64.urlsafe_b64encode(hash_digest))

    def encrypt_message(self, message):
        return self.cipher.encrypt(str(message).encode()).decode()

    def decrypt_message(self, encrypted_message):
        return self.cipher.decrypt(encrypted_message).decode()

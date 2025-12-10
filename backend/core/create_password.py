import random
import string


def generate_license_key(length=25, segments=5):
    """
    Generate a license key with the specified length and segments.

    Args:
        length (int): Total length of the license key (default: 25).
        segments (int): Number of segments (default: 5).

    Returns:
        str: Generated license key.
    """
    # Ensure each segment is of equal length
    if length % segments != 0:
        raise ValueError("Total length must be divisible by the number of segments.")

    segment_length = length // segments

    # Define character pool (uppercase letters and digits)
    chars = string.ascii_uppercase + string.digits

    # Generate each segment
    segments = [
        "".join(random.choices(chars, k=segment_length)) for _ in range(segments)
    ]

    # Join segments with a hyphen
    license_key = "-".join(segments)
    return license_key


import random
import string


def generate_password(length=16):
    if length < 12:
        print("Warning: A strong password should be at least 12 characters long!")
        length = 12

    # Define character pools
    lowercase = string.ascii_lowercase
    uppercase = string.ascii_uppercase
    digits = string.digits
    special_chars = "!@#$%^&*()-_=+<>?{}[]|"

    # Ensure the password has at least one of each character type
    password = [
        random.choice(lowercase),
        random.choice(uppercase),
        random.choice(digits),
        random.choice(special_chars),
    ]

    # Fill the rest of the password length with a random mix of all character types
    all_chars = lowercase + uppercase + digits + special_chars
    password += random.choices(all_chars, k=length - 4)

    # Shuffle the password to avoid predictable patterns
    random.shuffle(password)

    # Join the list into a string and return it
    return "".join(password)

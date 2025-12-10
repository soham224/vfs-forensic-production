# VFS Backend API

## User Management

### Create New User

Register a new user with a valid, unclaimed license key. The system will automatically generate a secure password and activate the license.

#### Endpoint
```
POST /api/v1/users/add_user
```

#### Request Body
```json
{
  "user_email": "user@example.com",
  "license_key": "ABC123-XYZ789-DEF456-GHI789-JKL012"
}
```

#### Response
- **200 OK**: User created successfully
  ```json
  {
    "user_id": 1,
    "user_email": "user@example.com",
    "user_password": "generated-password-here",
    "is_active": true,
    "is_superuser": false
  }
  ```

- **400 Bad Request**:
  - If user with email already exists
  - If license key format is invalid (must be 29 characters)
  - If license key is invalid or already claimed

#### Implementation Details
- Validates license key format (29 characters)
- Checks for existing user with same email
- Verifies license key exists and is unclaimed
- Generates a secure random password
- Creates user account
- Updates license status to "activate"
- Sets license start date to current time
- Sets license expiry to 1 year from activation
- Returns user details including generated password

#### Example Usage
```python
import requests

url = "https://api.example.com/api/v1/users/add_user"
data = {
    "user_email": "new.user@example.com",
    "license_key": "ABC123-XYZ789-DEF456-GHI789-JKL012"
}

response = requests.post(url, json=data)
print(response.json())
```

## License Management

### Generate License Key

Generate a new license key for system access. This endpoint is restricted to superusers only.

#### Endpoint
```
POST /api/v1/license/generate
```

#### Authentication
- Requires superuser privileges
- Include JWT token in the Authorization header: `Authorization: Bearer <token>`

#### Request
No request body required.

#### Response
- **200 OK**: License key generated successfully
  ```json
  {
    "license_id": 123,
    "license_key": "ABC123-XYZ789-DEF456",
    "key_status": "unclaimed"
  }
  ```

- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: User doesn't have superuser privileges
- **500 Internal Server Error**: Failed to generate or encrypt license key

#### Implementation Details
- Generates a cryptographically secure license key
- Encrypts the key before storing in the database
- Sets default values:
  - `key_status`: "unclaimed"
  - `limit_id`: 1
  - `status`: true
  - `deleted`: false
  - Timestamps for creation and updates

#### Example Usage
```python
import requests

url = "https://api.example.com/api/v1/license/generate"
headers = {
    "Authorization": "Bearer your_jwt_token_here"
}

response = requests.post(url, headers=headers)
print(response.json())
```

## Getting Started

### Prerequisites
- Python 3.8+
- PostgreSQL
- Redis (for caching)

### Installation
1. Clone the repository
2. Install dependencies: `pip install -r requirements.txt`
3. Set up environment variables (copy .env.example to .env)
4. Run migrations: `alembic upgrade head`
5. Start the server: `uvicorn main:app --reload`

## License
[Your License Here]

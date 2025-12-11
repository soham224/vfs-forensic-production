# VFS Forensic Backend API

> A FastAPI-based backend service for VFS Forensic application

[![Python](https://img.shields.io/badge/python-3.8%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.95.0-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 📋 Table of Contents
- [Project Structure](#-project-structure)
- [Features](#-features)
- [API Documentation](#-api-documentation)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [Development](#-development)
- [API Endpoints](#-api-endpoints)
- [Maintainer](#-maintainer)
- [License](#-license)

## 🏗️ Project Structure

```
backend/
├── api/
│   └── api_v1/
│       ├── endpoints/         # API endpoint definitions
│       │   ├── __init__.py
│       │   ├── users.py       # User management endpoints
│       │   └── license_api.py # License management endpoints
│       └── api.py             # API router configuration
├── core/
│   ├── config.py             # Application configuration
│   ├── security.py           # Authentication and security utilities
│   └── db_init_utils.py      # Database initialization utilities
├── models/
│   ├── __init__.py
│   ├── user.py               # User model definitions
│   └── license.py            # License model definitions
├── schemas/
│   ├── __init__.py
│   ├── user.py               # Pydantic schemas for users
│   └── license.py            # Pydantic schemas for licenses
├── main.py                   # Application entry point
├── requirements.txt          # Python dependencies
└── README.md                 # This file
```

## ✨ Features

- 🔐 JWT-based authentication
- 👥 User management with role-based access control
- 🔑 License key generation and validation
- 🚀 High performance with FastAPI and async support
- 📝 Interactive API documentation with Swagger UI and ReDoc
- 🛡️ Secure password hashing
- 🗃️ PostgreSQL database with SQLAlchemy ORM
- 🔄 Asynchronous database operations

## 📚 API Documentation

Once the application is running, you can access the interactive API documentation:

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

---

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

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- PostgreSQL 13+
- Redis 6+ (for caching and rate limiting)
- Poetry (for dependency management)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/vfs-forensic-production.git
   cd vfs-forensic-production/backend
   ```

2. **Set up Python virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   # or with poetry
   poetry install
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Update the .env file with your configuration
   ```

5. **Run database migrations**
   ```bash
   alembic upgrade head
   ```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Application
APP_ENV=development
DEBUG=True
SECRET_KEY=your-secret-key-here

# Database
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/vfs_forensic
DATABASE_TEST_URL=postgresql+asyncpg://user:password@localhost:5432/vfs_forensic_test

# JWT
JWT_SECRET_KEY=your-jwt-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Redis
REDIS_URL=redis://localhost:6379/0

# CORS
CORS_ORIGINS=["http://localhost:3000", "http://localhost:8000"]
```

### Running the Application

**Development mode:**
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Production mode (using Gunicorn with Uvicorn workers):**
```bash
gunicorn -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000 main:app
```

The API will be available at `http://localhost:8000`

## 🛠️ Development

### Running Tests
```bash
pytest
```

### Code Formatting
```bash
black .
```

### Linting
```bash
flake8 .
```

### Pre-commit Hooks
Install pre-commit hooks to ensure code quality before each commit:
```bash
pre-commit install
```

---

## 👤 Maintainer

**Shruti Agarwal**



---

<div align="center">
  
</div>

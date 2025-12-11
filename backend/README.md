# VFS Forensic Backend API

> A FastAPI-based backend service for VFS Forensic application

[![Python](https://img.shields.io/badge/python-3.8%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.61.0-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com/)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-1.3.19-ff4b4b.svg)](https://www.sqlalchemy.org/)
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
│       ├── endpoints/             # API endpoint definitions
│       │   ├── camera_api.py      # Camera management endpoints
│       │   ├── camera_rtsp_api.py # Camera RTSP configuration
│       │   ├── case_api.py        # Case management endpoints
│       │   ├── company_api.py     # Company management
│       │   ├── license_api.py     # License management
│       │   ├── location_api.py    # Location management
│       │   ├── login.py           # Authentication endpoints
│       │   ├── notification_api.py # Notification system
│       │   ├── result_api.py      # Result processing
│       │   ├── suspect_api.py     # Suspect management
│       │   └── users.py           # User management
│       └── api.py                # API router configuration
├── core/
│   ├── config.py             # Application configuration
│   ├── security.py           # Authentication and security
│   ├── db_init_utils.py      # Database initialization
│   └── aws_utils.py          # AWS integration utilities
├── models/                   # SQLAlchemy models
│   ├── camera.py
│   ├── case.py
│   ├── company.py
│   ├── license.py
│   ├── location.py
│   ├── result.py
│   ├── suspect.py
│   └── user.py
├── schemas/                  # Pydantic schemas
│   ├── camera.py
│   ├── case.py
│   ├── company.py
│   ├── license.py
│   ├── location.py
│   ├── result.py
│   ├── suspect.py
│   └── user.py
├── crud/                    # Database CRUD operations
│   ├── camera_crud.py
│   ├── case_crud.py
│   ├── company_crud.py
│   ├── license_crud.py
│   ├── location_crud.py
│   ├── result_crud.py
│   ├── suspect_crud.py
│   └── user_crud.py
├── migrations/              # Database migrations
├── applogging/              # Logging configuration
├── client_data/             # Client-uploaded files
├── enums/                   # Enumerations
├── logo/                    # Application logos
├── main.py                  # Application entry point
├── requirement.txt          # Python dependencies
├── log_config.yml           # Logging configuration
└── README.md                # This file
```

## ✨ Features

- 🔐 JWT-based authentication with OAuth2
- 👥 User management with role-based access control (RBAC)
- 📹 Camera and RTSP stream management
- 🕵️‍♂️ Case management for forensic investigations
- 🏢 Company and location management
- 🔑 License key generation and validation
- 📊 Result processing and analysis
- 🔍 Suspect tracking and management
- 🔔 Real-time notifications
- 🌐 RESTful API with OpenAPI documentation
- 🚀 High performance with FastAPI and async support
- 🛡️ Secure password hashing with bcrypt
- 🗃️ MySQL database with SQLAlchemy ORM
- 🔄 Asynchronous database operations
- 📝 Interactive API documentation with Swagger UI and ReDoc
- 📊 Structured logging with YAML configuration
- ☁️ AWS S3 integration for file storage

## 📚 API Documentation

Once the application is running, you can access the interactive API documentation:

- **Swagger UI**: `http://localhost:8004/docs`
- **ReDoc**: `http://localhost:8004/redoc`

### Authentication

Most endpoints require authentication. Include the JWT token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

### Main API Endpoints

- **Authentication**:
  - `POST /api/v1/login` - User login
  - `POST /api/v1/login/test-token` - Test access token

- **Users**:
  - `GET /api/v1/users/me` - Get current user
  - `POST /api/v1/users/` - Create new user
  - `GET /api/v1/users/` - List users (admin only)

- **Cameras**:
  - `GET /api/v1/cameras/` - List all cameras
  - `POST /api/v1/cameras/` - Add new camera
  - `GET /api/v1/cameras/{camera_id}` - Get camera details
  - `PUT /api/v1/cameras/{camera_id}` - Update camera

- **Cases**:
  - `GET /api/v1/cases/` - List all cases
  - `POST /api/v1/cases/` - Create new case
  - `GET /api/v1/cases/{case_id}` - Get case details
  - `PUT /api/v1/cases/{case_id}` - Update case

- **Suspects**:
  - `GET /api/v1/suspects/` - List all suspects
  - `POST /api/v1/suspects/` - Add new suspect
  - `GET /api/v1/suspects/{suspect_id}` - Get suspect details
  - `POST /api/v1/suspects/search` - Search suspects

- **Results**:
  - `GET /api/v1/results/` - List all results
  - `POST /api/v1/results/` - Add new result
  - `GET /api/v1/results/{result_id}` - Get result details
  - `GET /api/v1/results/case/{case_id}` - Get results by case

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
## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- MySQL 8.0+
- pip (Python package manager)
- FFmpeg (for video processing)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirement.txt
   ```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Application
PROJECT_NAME="VFS Forensic Backend"
API_V1_STR=/api/v1
SERVER_NAME=localhost
SERVER_HOST=http://localhost:8004

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

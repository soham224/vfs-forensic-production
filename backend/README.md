# 🚀 VFS Forensic Backend API

> A high-performance FastAPI-based backend service for VFS Forensic application with advanced video analytics and face recognition capabilities

[![Python](https://img.shields.io/badge/python-3.8%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.68.0-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com/)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-1.4.0-ff4b4b.svg)](https://www.sqlalchemy.org/)
[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?logo=docker&logoColor=white)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 📋 Table of Contents

- [Project Structure](#-project-structure)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the Application](#running-the-application)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Deployment](#-deployment)
- [Development](#-development)
- [Testing](#-testing)
- [License](#-license)

## 🏗️ Project Structure

```
backend/
├── api/                      # API endpoints and routes
│   └── api_v1/               # API version 1
│       ├── endpoints/        # API endpoint definitions
│       │   ├── camera_api.py      # Camera management
│       │   ├── camera_rtsp_api.py # RTSP configuration
│       │   ├── case_api.py        # Case management
│       │   ├── company_api.py     # Company management
│       │   ├── company_setting_api.py # Company settings
│       │   ├── limit_api.py       # System limits
│       │   ├── license_api.py     # License management
│       │   ├── location_api.py    # Location management
│       │   ├── login.py           # Authentication
│       │   ├── result_api.py      # Results processing
│       │   ├── result_type_api.py # Result types
│       │   └── suspect_api.py     # Suspect management
│       └── api.py                # API router configuration
│
├── core/                     # Core application logic
│   ├── config.py             # Configuration settings
│   ├── security.py           # Authentication
│   ├── db_init_utils.py      # DB initialization
│   └── aws_utils.py          # AWS utilities
│
├── models/                   # Database models
│   ├── camera.py            # Camera configurations
│   ├── case.py              # Case management
│   ├── company.py           # Company data
│   ├── location.py          # Location data
│   └── suspect.py           # Suspect information
│
├── schemas/                  # Pydantic schemas
│   ├── camera.py            # Camera schemas
│   ├── case.py              # Case schemas
│   └── ...                  # Other schemas
│
├── crud/                    # Database operations
├── migrations/              # Database migrations
├── db/                      # Database configuration
├── applogging/              # Logging setup
└── utils.py                 # Utility functions
```
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

## ✨ Key Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (RBAC)
- Secure password hashing with bcrypt
- Token-based session management

### 📁 Case & Evidence Management
- End-to-end case lifecycle management
- Digital evidence organization and versioning
- Case status tracking and reporting
- Evidence chain of custody

### 🎥 Video Analytics
- RTSP/RTMP camera integration
- Real-time video processing pipeline
- Frame extraction and analysis
- Motion detection and object tracking

### 👤 Face Recognition
- High-accuracy face detection
- Real-time face recognition
- Suspect matching against watchlists
- Face search and comparison

### ⚙️ System Administration
- Multi-tenant architecture
- License and subscription management
- System health monitoring
- Comprehensive audit logging
- User activity tracking

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI 0.68.0
- **Python**: 3.8+
- **ASGI Server**: Uvicorn
- **API Documentation**: OpenAPI 3.0 (Swagger UI & ReDoc)

### Database
- **Primary DB**: MySQL 8.0+
- **ORM**: SQLAlchemy 1.4.0
- **Migrations**: Alembic
- **Connection Pooling**: SQLAlchemy Pool

### Authentication & Security
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: Bcrypt
- **CORS**: Enabled with secure defaults
- **Request Validation**: Pydantic models

### Cloud & DevOps
- **Containerization**: Docker
- **Orchestration**: Kubernetes (optional)
- **CI/CD**: Jenkins
- **Cloud Services**:
  - AWS S3 (Storage)
  - AWS Rekognition (Face Recognition)
  - AWS ECS/EKS (Deployment)

### Monitoring & Logging
- **Structured Logging**: Python logging with YAML config
- **Monitoring**: Custom health checks
- **Metrics**: Prometheus (optional)
- **Tracing**: OpenTelemetry (optional)

## 📚 API Documentation

Once the application is running, you can access the interactive API documentation:

- **Swagger UI**: `http://localhost:8004/docs`
- **ReDoc**: `http://localhost:8004/redoc`

### Authentication

```http
POST /api/v1/login/access-token
Content-Type: application/x-www-form-urlencoded

username=admin&password=yourpassword
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### Key Endpoints

#### Authentication
- `POST /api/v1/login/access-token` - Obtain JWT token
- `POST /api/v1/login/test-token` - Validate token

#### User Management
- `GET /api/v1/users/me` - Get current user details
- `GET /api/v1/users/` - List all users (Admin only)
- `POST /api/v1/users/` - Create new user
- `PUT /api/v1/users/{user_id}` - Update user
- `DELETE /api/v1/users/{user_id}` - Delete user

#### Case Management
- `GET /api/v1/cases/` - List all cases
- `POST /api/v1/cases/` - Create new case
- `GET /api/v1/cases/{case_id}` - Get case details
- `PUT /api/v1/cases/{case_id}` - Update case
- `DELETE /api/v1/cases/{case_id}` - Delete case

#### Camera Management
- `GET /api/v1/cameras/` - List all cameras
- `POST /api/v1/cameras/` - Add new camera
- `GET /api/v1/cameras/rtsp` - List RTSP camera configurations
- `POST /api/v1/cameras/rtsp` - Configure RTSP camera

#### Suspect Management
- `GET /api/v1/suspects/` - List all suspects
- `POST /api/v1/suspects/` - Add new suspect
- `POST /api/v1/suspects/search` - Search suspects

#### Results
- `GET /api/v1/results/` - List analysis results
- `GET /api/v1/results/types` - Get result types
- `POST /api/v1/results/process` - Process video analysis

For complete API documentation, visit the interactive Swagger UI at `http://localhost:8000/api/v1/docs` after starting the server.

## 🗄️ Database Schema

The database schema is managed using SQLAlchemy ORM with Alembic for migrations. Key tables include:

- `users` - User accounts and authentication
- `companies` - Organization information
- `locations` - Physical locations
- `cameras` - Camera configurations
- `cases` - Investigation cases
- `suspects` - Suspect information
- `results` - Analysis results

To create and apply migrations:

```bash
# Generate new migration
alembic revision --autogenerate -m "Your migration message"

# Apply migrations
alembic upgrade head
```

## 🚀 Deployment

### Docker Deployment

1. Build the Docker image:
   ```bash
   docker build -t vfs-forensic-backend .
   ```

2. Run with environment variables:
   ```bash
   docker run -d \
     --name vfs-backend \
     -p 8000:8000 \
     --env-file .env \
     vfs-forensic-backend
   ```

### Kubernetes

Example deployment configuration:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vfs-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: vfs-backend
  template:
    spec:
      containers:
      - name: vfs-backend
        image: your-registry/vfs-forensic-backend:latest
        ports:
        - containerPort: 8000
        envFrom:
        - secretRef:
            name: vfs-backend-secrets
```

## 🛠 Development

### Code Style & Quality

- **Black** for code formatting
- **isort** for import sorting
- **mypy** for static type checking
- **pylint** for code quality

Run code quality checks:

```bash
# Format code
black .

# Sort imports
isort .

# Run linter
pylint api/ core/ models/ schemas/

# Run type checking
mypy .
```

### Testing

Run tests with pytest:

```bash
pytest tests/

# With coverage report
pytest --cov=api --cov=core --cov-report=term-missing
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📋 Getting Started

### Prerequisites

- Python 3.8+
- MySQL 8.0+
- pip
- Docker (optional, for containerized deployment)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-organization/vfs-forensic-production.git
   cd vfs-forensic-production/backend
   ```

2. Set up a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirement.txt
   ```

### Environment Variables

Create a `.env` file with the following required variables:

```env
# Database Configuration
MYSQL_HOSTNAME=your-db-host
MYSQL_USERNAME=your-db-user
MYSQL_PASS=your-db-password
MYSQL_PORT=3306
MYSQL_DB_NAME=vfs_forensic
MYSQL_POOL_SIZE=20
MYSQL_MAX_OVERFLOW=10
MYSQL_POOL_TIMEOUT=30
MYSQL_POOL_PRE_PING=true

# JWT Configuration
SECRET_KEY=generate-a-secure-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=480

# AWS Configuration
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_DEFAULT_REGION=ap-south-1

# Application Settings
ROI_API_ENDPOINT=your-roi-api-endpoint
MODEL_TEST_API_URL=https://k9hyxica2b.execute-api.ap-south-1.amazonaws.com/prod/infer
TEST_IMG_STORAGE_BUCKET=tusker-testing-images-storage
MODEL_STORAGE_BUCKET=tusker-model-storage
FRAME_EXTRACTOR_URI=your-frame-extractor-uri
```

### Running the Application

**Development mode:**
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Using Docker:**
1. Build the Docker image:
   ```bash
   docker build -t vfs-forensic-backend .
   ```

2. Run the container:
   ```bash
   docker run -d --name vfs-backend -p 8000:8000 --env-file .env vfs-forensic-backend
   ```

**Access API Documentation:**
- Swagger UI: http://localhost:8000/api/v1/docs
- ReDoc: http://localhost:8000/api/v1/redoc
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

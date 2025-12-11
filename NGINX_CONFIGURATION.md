# Nginx Configuration Guide

## Overview
This document describes the nginx reverse proxy configuration that routes all traffic through port 80 to different services.

## File Locations
- **Main nginx config**: `frontend/nginx/nginx.conf`
- **Docker compose**: `docker-compose.yml`

## Endpoint Routing

### Frontend (React UI)
- **Path**: `/` (root)
- **Target**: `vfs-auto-serving-ui:80`
- **Access**: `http://localhost/`
- **Description**: Serves the React frontend application

### Backend API
- **Path**: `/api/`
- **Target**: `vfs-auto-serving-api:80`
- **Access**: `http://localhost/api/v1/...`
- **Description**: All API endpoints are routed here
- **Examples**:
  - `http://localhost/api/v1/login/access-token`
  - `http://localhost/api/v1/users/add_user`
  - `http://localhost/api/v1/cases/`
  - `http://localhost/api/v1/results/`
  - `http://localhost/api/v1/cameras/`

### API Documentation
- **Path**: `/docs`
- **Target**: `vfs-auto-serving-api:80/docs`
- **Access**: `http://localhost/docs`
- **Description**: Swagger UI documentation for the API

### OpenAPI Schema
- **Path**: `/openapi.json`
- **Target**: `vfs-auto-serving-api:80/openapi.json`
- **Access**: `http://localhost/openapi.json`
- **Description**: OpenAPI JSON schema

### ReDoc Documentation
- **Path**: `/redoc`
- **Target**: `vfs-auto-serving-api:80/redoc`
- **Access**: `http://localhost/redoc`
- **Description**: ReDoc API documentation (alternative to Swagger)

### Health Check
- **Path**: `/health`
- **Access**: `http://localhost/health`
- **Description**: Simple health check endpoint (returns "healthy")

## Configuration Features

### Rate Limiting
- **API endpoints**: 10 requests/second with burst of 20
- **General endpoints**: 50 requests/second with burst of 50
- **Purpose**: Prevent abuse and DDoS attacks

### Proxy Settings
- **Connect timeout**: 60 seconds
- **Send timeout**: 60 seconds
- **Read timeout**: 60 seconds
- **Max body size**: 100MB (for file uploads)

### CORS Headers
- CORS headers are automatically added to API responses
- Supports all HTTP methods (GET, POST, PUT, DELETE, OPTIONS)
- Handles preflight OPTIONS requests

### Static Asset Caching
- Static assets (images, CSS, JS, fonts) are cached for 1 day
- Improves performance and reduces server load

### WebSocket Support
- WebSocket connections are supported for real-time features
- Proper upgrade headers are set

## Testing Endpoints

### Test Frontend
```bash
curl http://localhost/
```

### Test API
```bash
curl http://localhost/api/v1/login/test-token
```

### Test API Docs
```bash
curl http://localhost/docs
```

### Test Health Check
```bash
curl http://localhost/health
```

## Direct Access (Alternative)

If you need to access services directly without nginx:

- **Frontend**: `http://localhost:8080`
- **Backend API**: `http://localhost:8000`
- **API Docs**: `http://localhost:8000/docs`

## Environment Variables

The frontend uses these environment variables (with defaults):

- `REACT_APP_IP`: API documentation URL (default: `http://localhost/docs`)
- `REACT_APP_API_HOST`: API base URL (default: `http://localhost/api/v1`)

These are set in `docker-compose.yml` and can be overridden via `.env` file.

## Troubleshooting

### Check nginx logs
```bash
docker compose logs nginx
```

### Test nginx configuration
```bash
docker compose exec nginx nginx -t
```

### Restart nginx
```bash
docker compose restart nginx
```

### Check if services are running
```bash
docker compose ps
```

## Architecture Diagram

```
Browser
   |
   | (http://localhost)
   v
Nginx (Port 80)
   |
   +-- /          -> Frontend (vfs-auto-serving-ui:80)
   +-- /api/      -> Backend API (vfs-auto-serving-api:80)
   +-- /docs      -> API Docs (vfs-auto-serving-api:80/docs)
   +-- /openapi.json -> OpenAPI Schema
   +-- /redoc     -> ReDoc Docs
   +-- /health    -> Health Check
```

## Notes

- All services must be running for nginx to work properly
- Nginx depends on both `vfs-auto-serving-ui` and `vfs-auto-serving-api`
- The frontend is configured to use relative paths, so it works through nginx
- API calls from the frontend go to `/api/v1/...` which nginx routes to the backend


# Use a more recent Python version with Debian Bullseye
FROM python:3.8-slim-bullseye

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Database configuration with default empty values
ENV MYSQL_HOSTNAME="" \
    MYSQL_USERNAME="" \
    MYSQL_PASS="" \
    MYSQL_PORT="" \
    MYSQL_DB_NAME="" \
    MYSQL_POOL_SIZE=""

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    default-libmysqlclient-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
WORKDIR /app
COPY autoserving-req.txt .
RUN pip install --upgrade pip && \
    pip install -r autoserving-req.txt

# Copy application code
COPY . .

# Use JSON array format for CMD
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]

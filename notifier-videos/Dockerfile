# Use an official Python 3.8 image
FROM python:3.8-slim

# Set the working directory inside the container
WORKDIR /app

# Install system dependencies (replacing libmysqlclient-dev)
RUN apt-get update && apt-get install -y \
    gcc \
    libmariadb-dev \
    libmariadb-dev-compat \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy the rest of your application code
COPY . .

# Set entrypoint or default command (adjust as needed)
CMD ["python", "main.py"]

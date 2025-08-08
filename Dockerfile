# Use official Python slim image
FROM python:3.11-slim as builder

# Create a non-root user and switch to it
RUN useradd -m qruser && \
    mkdir -p /app && \
    chown qruser:qruser /app

WORKDIR /app
USER qruser

# Copy requirements first to leverage Docker cache
COPY --chown=qruser:qruser ./app/requirements.txt .

# Install dependencies in virtual environment
RUN python -m venv venv && \
    . venv/bin/activate && \
    pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY --chown=qruser:qruser ./app .

# Final stage
FROM python:3.11-slim

# Create non-root user again
RUN useradd -m qruser && \
    mkdir -p /app && \
    chown qruser:qruser /app

WORKDIR /app
USER qruser

# Copy from builder
COPY --from=builder --chown=qruser:qruser /app /app

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PATH="/app/venv/bin:$PATH"

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
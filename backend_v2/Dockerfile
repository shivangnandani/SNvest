# Use the official Python image
FROM python:3.10-slim

# Set the working directory
WORKDIR /app

# Hugging Face Spaces requires running as a non-root user
RUN useradd -m -u 1000 user
USER user
ENV PATH="/home/user/.local/bin:$PATH"

# Copy the requirements file and install dependencies
COPY --chown=user requirements.txt .
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Copy the rest of the application code
COPY --chown=user . .

# Ensure the data directory has write permissions
RUN mkdir -p /app/data && chmod -R 777 /app/data

# Expose port 7860 for Hugging Face Spaces
EXPOSE 7860

# Command to run the FastAPI application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]

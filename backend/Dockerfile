FROM python:3.11-slim

# Setting working directory inside container
WORKDIR /app

# Copy dependency list and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the FastAPI app code
COPY . .

# Expose port FastAPI runs on
EXPOSE 8000

# Run uvicorn server when container starts
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
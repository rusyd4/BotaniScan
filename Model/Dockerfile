# Gunakan base image Python
FROM python:3.9-slim

# Set working directory di dalam container
WORKDIR /app

# Salin file requirements.txt ke container
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Salin semua file dari folder Model ke dalam container
COPY . .

# Ekspos port yang digunakan oleh aplikasi model
EXPOSE 5000

# Perintah untuk menjalankan aplikasi (misalnya app.py)
CMD ["python", "app.py"]

# Gunakan base image Node.js versi 18
FROM node:18

# Set working directory di dalam container
WORKDIR /app

# Salin file package.json dan package-lock.json untuk menginstall dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin semua file dari folder BE ke container
COPY . .

# Ekspos port sesuai dengan konfigurasi
EXPOSE 5001

# Jalankan server menggunakan environment variable PORT dari file .env
CMD ["npm", "start"]

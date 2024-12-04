# Gunakan base image Node.js
FROM node:18

# Set working directory di container
WORKDIR /app

# Salin file package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin semua file ke dalam container
COPY . .

# Ekspos port Metro bundler (default 8081)
EXPOSE 8081

# Jalankan Metro bundler untuk React Native
CMD ["npx", "react-native", "start"]

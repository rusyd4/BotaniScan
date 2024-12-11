// models/Plant.js
// models/Plant.js
const mongoose = require('mongoose');

// Define Plant schema
const plantSchema = new mongoose.Schema({
  species: { type: String, required: true }, // Nama spesies tanaman
  score: { type: Number, required: true }, // Tingkat kepercayaan identifikasi
  timestamp: { type: Date, default: Date.now }, // Waktu identifikasi
  image: { type: String, required: true }, // URL atau path ke gambar tanaman
});

// Create and export Plant model
module.exports = mongoose.model('Plant', plantSchema);

// models/Plant.js
const mongoose = require('mongoose');

// Define Plant schema
const plantSchema = new mongoose.Schema({
  species: { type: String, required: true }, // Nama spesies tanaman
  confidence: { type: Number, required: true }, // Tingkat kepercayaan identifikasi
  rarity: { type: String, required: true }, // Kelangkaan tanaman (Least Concerned, dll)
  timestamp: { type: Date, default: Date.now }, // Waktu identifikasi
});

// Create and export Plant model
module.exports = mongoose.model('Plant', plantSchema);

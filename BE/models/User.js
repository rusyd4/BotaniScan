const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  history: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Plant' }],
  collection: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Plant' }],
  profilePicture: {
    type: String, // URL untuk gambar profil
    default: 'https://example.com/default-profile-picture.png', // Gambar profil default
  },
});

module.exports = mongoose.model('User', userSchema);

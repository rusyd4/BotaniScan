const express = require('express');
const User = require('../models/User');
const authenticate = require('../middleware/authenticate');
const router = express.Router();
const bcrypt = require('bcryptjs');

// Endpoint untuk mendapatkan data pengguna yang sedang login
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('username email password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Change Password
router.post('/change-password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validasi input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required.' });
    }

    // Cari user berdasarkan ID dari token
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
        // Verifikasi password saat ini
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
          return res.status(401).json({ error: 'Current password is incorrect.' });
        }
    
        // Hash password baru
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    
        // Perbarui password pengguna
        user.password = hashedNewPassword;
        await user.save();
    
        res.status(200).json({ message: 'Password updated successfully.' });
      } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ error: 'Failed to change password. Please try again later.' });
      }
    });
    
    module.exports = router;
    

module.exports = router;

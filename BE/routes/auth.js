const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Register
// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Basic validation: Check if all fields are provided
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if username or email already exists
    const existingUserByUsername = await User.findOne({ username });
    const existingUserByEmail = await User.findOne({ email });

    if (existingUserByUsername) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    if (existingUserByEmail) {
      return res.status(409).json({ error: 'Email already exists' });
    }


    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    // Return success response
    res.status(201).json({ message: 'User registered successfully', token: 'user-token' });

  } catch (error) {
    console.error('Registration error:', error);

    // Handle specific errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation failed. Please check the data provided.' });
    }

    // Generic error
    res.status(500).json({ error: 'Internal Server Error. Please try again later.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({ error: 'Email/Username and password are required' });
    }

    // Cari pengguna berdasarkan email atau username
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email/username' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
});


module.exports = router;
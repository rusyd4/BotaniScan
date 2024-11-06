// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Import database connection (make sure you have db.js file with mongoose connection)
require('./db');

// Define User model (make sure you have User.js model file)
const User = require('./models/User');

// Register endpoint
app.post('/register', async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      // Cek apakah semua data diperlukan sudah ada
      if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, email, password: hashedPassword });
      await user.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({ error: "Failed to register user" });
    }
  });
  
  

// Login endpoint
app.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Cek apakah email dan password ada
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }
  
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
  
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ message: "Login successful", token });
    } catch (error) {
      console.error("Login error:", error); // Tambahkan logging ini
      res.status(400).json({ error: "Login failed" });
    }
  });
  

// Landing endpoint
app.get('/landing', (req, res) => {
  res.json({ message: "Welcome to BotaniScan! Discover plant types with ease." });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

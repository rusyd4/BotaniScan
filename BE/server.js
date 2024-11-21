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

// Import database connection
require('./db');

// Import User and Plant models
const User = require('./models/User');
const Plant = require('./models/Plant');

// Endpoint to get all user IDs
app.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, '_id'); // Hanya ambil field _id
    res.json(users.map(user => user._id));
  } catch (error) {
    console.error("Error fetching user IDs:", error);
    res.status(500).json({ error: "Failed to fetch user IDs" });
  }
});

// Register endpoint
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

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

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
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
    console.error("Login error:", error);
    res.status(400).json({ error: "Login failed" });
  }
});

// Middleware for authentication
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header missing or malformed' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // Tambahkan userId ke request
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

app.post('/history', authenticate, async (req, res) => {
  try {
    const { species, confidence, rarity } = req.body;

    if (!species || !confidence || !rarity) {
      return res.status(400).json({ error: "Species, confidence, and rarity are required" });
    }

    const user = await User.findById(req.userId).populate('collection');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Cek apakah spesies sudah ada di koleksi
    const isSpeciesInCollection = user.collection.some(plant => plant.species === species);

    // Tambahkan tanaman ke database
    const plant = new Plant({ species, confidence, rarity });
    await plant.save();

    let addedToCollection = false;

    // Jika spesies belum ada di koleksi, tambahkan ke koleksi
    if (!isSpeciesInCollection) {
      user.collection.push(plant._id);
      addedToCollection = true;
    }

    // Selalu tambahkan ke riwayat
    user.history.push(plant._id);
    await user.save();

    res.status(201).json({
      message: "Plant added to history",
      addedToCollection, // Informasikan apakah tanaman ditambahkan ke koleksi
      plant,
    });
  } catch (error) {
    console.error("Error adding plant to history:", error);
    res.status(500).json({ error: "Failed to add plant to history" });
  }
});





// Endpoint to get user history
app.get('/history', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('history');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user.history);
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// Endpoint untuk mendapatkan koleksi spesies unik dari riwayat
app.get('/collection', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('collection');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user.collection); // Kirimkan koleksi spesies
  } catch (error) {
    console.error("Error fetching collection:", error);
    res.status(500).json({ error: "Failed to fetch collection" });
  }
});


// Endpoint untuk menampilkan leaderboard
app.get('/leaderboard', async (req, res) => {
  try {
    const users = await User.find().populate('collection');
    
    // Hitung jumlah koleksi unik untuk setiap pengguna
    const leaderboard = users.map(user => ({
      username: user.username,
      collectionSize: user.collection.length, // Jumlah koleksi unik
    }));

    // Urutkan berdasarkan jumlah koleksi (descending)
    leaderboard.sort((a, b) => b.collectionSize - a.collectionSize);

    res.json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});



// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

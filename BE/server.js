const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('./db/index');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/user', require('./routes/user'));
app.use('/leaderboard', require('./routes/leaderboard'));
app.use('/history', require('./routes/history'));
app.use('/collection', require('./routes/collection'));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

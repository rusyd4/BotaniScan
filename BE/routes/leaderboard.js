const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await User.find().populate('collection');
    const leaderboard = users.map(user => ({
      username: user.username,
      collectionSize: user.collection.length,
    })).sort((a, b) => b.collectionSize - a.collectionSize);

    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

module.exports = router;

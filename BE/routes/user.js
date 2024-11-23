const express = require('express');
const User = require('../models/User');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

// Get user history
router.get('/history', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('history');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.history);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Get user collection
router.get('/collection', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('collection');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.collection);
  } catch (error) {
    console.error('Error fetching collection:', error);
    res.status(500).json({ error: 'Failed to fetch collection' });
  }
});

module.exports = router;

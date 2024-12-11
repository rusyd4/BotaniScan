const express = require('express');
const User = require('../models/User');
const Plant = require('../models/Plant');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

// Add a plant to user history
router.post('/', authenticate, async (req, res) => {
  try {
    const { species, score, image } = req.body;
    console.log('Received Data:', { species, score, image }); // Debug data

    if (!species || !score || !image) {
      console.log('Validation Error: Missing required fields');
      return res.status(400).json({ error: 'Species, score, and image are required.' });
    }

    if (typeof score !== 'number' || score < 0 || score > 1) {
      console.log('Validation Error: Invalid score');
      return res.status(400).json({ error: 'Score must be a number between 0 and 1.' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      console.log('Validation Error: User not found');
      return res.status(404).json({ error: 'User not found.' });
    }

    const newPlant = new Plant({ species, score, image });
    await newPlant.save();

    user.history.push(newPlant._id);
    await user.save();

    res.status(201).json({ message: 'Plant added to history.', plant: newPlant });
  } catch (error) {
    console.error('Error adding plant to history:', error);
    res.status(500).json({ error: 'Failed to add plant to history.' });
  }
});



// Get user history
router.get('/', authenticate, async (req, res) => {
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

module.exports = router;

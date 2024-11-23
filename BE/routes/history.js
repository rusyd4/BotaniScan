const express = require('express');
const User = require('../models/User');
const Plant = require('../models/Plant');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

router.post('/', authenticate, async (req, res) => {
  try {
    const { species, confidence, rarity } = req.body;

    if (!species || !confidence || !rarity) {
      return res.status(400).json({ error: 'Species, confidence, and rarity are required' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const plant = new Plant({ species, confidence, rarity });
    await plant.save();

    const isSpeciesInCollection = user.collection.some(plantId => String(plantId) === String(plant._id));

    if (!isSpeciesInCollection) {
      user.collection.push(plant._id);
    }

    user.history.push(plant._id);
    await user.save();

    res.status(201).json({ message: 'Plant added to history', plant });
  } catch (error) {
    console.error('Error adding plant to history:', error);
    res.status(500).json({ error: 'Failed to add plant to history' });
  }
});

module.exports = router;

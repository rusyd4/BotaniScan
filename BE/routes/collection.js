const express = require('express');
const User = require('../models/User');
const Plant = require('../models/Plant');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

router.post('/', authenticate, async (req, res) => {
  try {
    const { species, confidence, rarity } = req.body;

    if (!species || !confidence || !rarity) {
      return res.status(400).json({ error: 'Species, confidence, and rarity are required.' });
    }

    const user = await User.findById(req.userId).populate('collection');
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const isSpeciesExists = user.collection.some(plant => plant.species === species);

    if (isSpeciesExists) {
      return res.status(200).json({ message: 'Species already exists in collection.' });
    }

    const newPlant = new Plant({ species, confidence, rarity });
    await newPlant.save();

    user.collection.push(newPlant._id);
    await user.save();

    res.status(201).json({ message: 'Species added to collection.', plant: newPlant });
  } catch (error) {
    console.error('Error adding plant to collection:', error);
    res.status(500).json({ error: 'Failed to add plant to collection.' });
  }
});


router.get('/', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('collection');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user.collection);
  } catch (error) {
    console.error('Error fetching collection:', error);
    res.status(500).json({ error: 'Failed to fetch collection' });
  }
});


module.exports = router;

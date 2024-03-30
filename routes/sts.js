const express = require('express');
const router = express.Router();
const STS = require('../models/sts');

// Route to create a new STS
router.post('/', async (req, res) => {
  try {
    // Extracting data from the request body
    const { wardNumber, capacity, longitude, latitude } = req.body;

    // Creating a new STS instance
    const newSTS = new STS({
      wardNumber,
      capacity,
      longitude,
      latitude
    });

    // Saving the new STS instance to the database
    const savedSTS = await newSTS.save();

    // Responding with the saved STS data
    res.status(201).json(savedSTS);
  } catch (error) {
    // Handling errors
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

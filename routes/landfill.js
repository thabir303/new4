const express = require('express');
const router = express.Router();
const Landfill = require('../models/landfill');

// Route to create a new Landfill
router.post('/', async (req, res) => {
  try {
    // Extracting data from the request body
    const { landfillId, longitude, latitude } = req.body;

    // Creating a new Landfill instance
    const newLandfill = new Landfill({
      landfillId,
      longitude,
      latitude
    });

    // Saving the new Landfill instance to the database
    const savedLandfill = await newLandfill.save();

    // Responding with the saved Landfill data
    res.status(201).json(savedLandfill);
  } catch (error) {
    // Handling errors
    res.status(400).json({ message: error.message });
  }
});

// Route to get all Landfills
router.get('/', async (req, res) => {
  try {
    // Fetching all Landfills from the database
    const landfills = await Landfill.find();

    // Responding with the fetched Landfills
    res.json(landfills);
  } catch (error) {
    // Handling errors
    res.status(500).json({ message: error.message });
  }
});

// Route to get a specific Landfill by landfillId
router.get('/:landfillId', async (req, res) => {
  try {
    // Extracting the landfillId parameter from the request URL
    const { landfillId } = req.params;

    // Fetching the Landfill by landfillId from the database
    const landfillRecord = await Landfill.findOne({ landfillId: landfillId });

    // Checking if the Landfill exists
    if (!landfillRecord) {
      return res.status(404).json({ message: 'Landfill not found' });
    }

    // Responding with the fetched Landfill
    res.json(landfillRecord);
  } catch (error) {
    // Handling errors
    res.status(500).json({ message: error.message });
  }
});

// Route to update a specific Landfill by landfillId
router.put('/:landfillId', async (req, res) => {
  try {
    // Extracting the landfillId parameter and updated data from the request body
    const { landfillId } = req.params;
    const { longitude, latitude } = req.body;

    // Finding and updating the Landfill by landfillId in the database
    const updatedLandfill = await Landfill.findOneAndUpdate(
      { landfillId: landfillId },
      { longitude, latitude },
      { new: true }
    );

    // Checking if the Landfill exists
    if (!updatedLandfill) {
      return res.status(404).json({ message: 'Landfill not found' });
    }

    // Responding with the updated Landfill
    res.json(updatedLandfill);
  } catch (error) {
    // Handling errors
    res.status(400).json({ message: error.message });
  }
});

// Route to delete a specific Landfill by landfillId
router.delete('/:landfillId', async (req, res) => {
  try {
    // Extracting the landfillId parameter from the request URL
    const { landfillId } = req.params;

    // Deleting the Landfill by landfillId from the database
    const deletedLandfill = await Landfill.findOneAndDelete({ landfillId: landfillId });

    // Checking if the Landfill exists
    if (!deletedLandfill) {
      return res.status(404).json({ message: 'Landfill not found' });
    }

    // Responding with a success message
    res.json({ message: 'Landfill deleted successfully' });
  } catch (error) {
    // Handling errors
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;

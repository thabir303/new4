const express = require('express');
const router = express.Router();
const Bills = require('../models/bill');
const Vehicle = require('../models/vehicle');

// Route to create a new bill
router.post('/', async (req, res) => {
  try {
    // Extracting data from the request body
    const { registrationNumber, wardNumber, arrivalTime, departureTime, distance, time, weight } = req.body;

    // Find the vehicle by registration number
    const vehicle = await Vehicle.findOne({ registrationNumber });

    // Check if vehicle belongs to the specified ward
    if (!vehicle || vehicle.wardNumber !== wardNumber) {
      return res.status(400).json({ message: `Vehicle with registration number ${registrationNumber} does not belong to ward ${wardNumber}` });
    }

    // Calculate cost per km
    const costPerKm = vehicle.fuelCostUnloaded + ((weight / (vehicle.capacity*1000)) * (vehicle.fuelCostFullyLoaded - vehicle.fuelCostUnloaded));

    // Calculate total cost
    const cost = distance * costPerKm;

    const highestBill = await Bills.findOne({}, {}, { sort: { 'billId': -1 } });
    let billId;
    if (highestBill && highestBill.billId > 0) {
        billId = parseInt(highestBill.billId) + 1;
    }
    else{
        billId = 1;
    }
    // Creating a new Bill instance
    const newBill = new Bills({
      billId,
      registrationNumber,
      wardNumber,
      arrivalTime,
      departureTime,
      distance,
      time,
      weight,
      cost,
      costPerKm
    });

    // Saving the new Bill instance to the database
    const savedBill = await newBill.save();

    // Responding with the saved Bill data
    res.status(201).json(savedBill);
  } catch (error) {
    // Handling errors
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
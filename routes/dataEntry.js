// Import necessary modules
const express = require('express');
const router = express.Router();
const Vehicle = require('../models/vehicle');

const vehicleValidator = (data) => {
    const { registrationNumber, type, fuelCostFullyLoaded, fuelCostUnloaded, wardNumber } = data;

    if (!registrationNumber || !type || !fuelCostFullyLoaded || !fuelCostUnloaded || !wardNumber) {
        return { error: 'Missing required elements in request body' };
    }

    let capacity;
    switch (type) {
        case 'openTruck':
            capacity = '3';
            break;
        case 'dumpTruck':
            capacity = '5';
            break;
        case 'compactor':
            capacity = '7';
            break;
        case 'container':
            capacity = '15';
            break;
        default:
            return { error: 'Invalid vehicle type' };
    }

    return { ...data, capacity };

};



// Route to search and sort vehicles
// /vehicles?type=openTruck&sort=asc&sortBy=wardNumber
router.get("/", async (req, res) => {
    try {
        // Define filter and sort options based on query parameters
        let filter = {};
        let sort = {};

        // Filter vehicles by type
        if (req.query.type) {
            filter.type = req.query.type;
        }

        // Filter vehicles by wardNumber
        if (req.query.wardNumber) {
            filter.wardNumber = req.query.wardNumber;
        }

        // Sort vehicles by registrationNumber in ascending order
        if (req.query.sort === 'asc') {
            sort.registrationNumber = 1;
        }

        // Sort vehicles by registrationNumber in descending order
        if (req.query.sort === 'desc') {
            sort.registrationNumber = -1;
        }

        // Fetch vehicles based on filter and sort options
        const vehicles = await Vehicle.find(filter).sort(sort);

        res.status(200).json(vehicles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});



// POST method to create new vehicle
router.post('/', async (req, res) => {
    try {

        let vehicle = await Vehicle.findOne({ registrationNumber: req.body.registrationNumber });
        if (vehicle) return res.status(400).json({ message: "Vehicle with same registration number already exists." });

        const validatedData = vehicleValidator(req.body);
        vehicle = await Vehicle.create(validatedData);

        res.status(201).json(vehicle);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});
// Route to get all vehicles
router.get('/', async (req, res) => {
    try {
        const vehicles = await Vehicle.find();
        res.json(vehicles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route to get a single vehicle by registrationNumber
router.get('/:registrationNumber', async (req, res) => {
    try {
        const vehicle = await Vehicle.findOne({ registrationNumber: req.params.registrationNumber });
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.json(vehicle);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// PUT method to update a vehicle
router.put('/:registrationNumber', async (req, res) => {
    try {
        const { registrationNumber } = req.params;

        // Validate the incoming data
        const validatedData = vehicleValidator(req.body);

        // Check if validation failed
        if (validatedData.error) {
            return res.status(400).json({ message: validatedData.error.details[0].message });
        }

        // Find the vehicle by registration number
        let vehicle = await Vehicle.findOneAndUpdate(
            { registrationNumber }, // Filter criteria
            validatedData, // Updated data
            { new: true } // Options to return the modified document
        );

        // Check if vehicle not found
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        // Send the updated vehicle as response
        res.json(vehicle);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route to delete a vehicle by registrationNumber
router.delete('/:registrationNumber', async (req, res) => {
    try {
        const { registrationNumber } = req.params;

        const deletedVehicle = await Vehicle.findOneAndDelete({ registrationNumber });

        if (!deletedVehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        res.json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;

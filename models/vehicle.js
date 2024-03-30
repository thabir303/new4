const mongoose = require('mongoose');

// Define the vehicle schema
const vehicleSchema = new mongoose.Schema({
    registrationNumber: { type: String, required: true, unique: true},
    type: { type: String, enum: ['openTruck', 'dumpTruck', 'compactor', 'container'], required: true },
    capacity: { type: String, enum: ['3', '5', '7', '15'], required: true },
    fuelCostFullyLoaded: { type: Number, required: true },
    fuelCostUnloaded: { type: Number, required: true },
    wardNumber: { type: Number, required: true }
});

// Create a model from the schema
const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;

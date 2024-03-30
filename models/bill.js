const mongoose = require('mongoose');

const BillsSchema = new mongoose.Schema({

   billId: {
        type: Number,
        required: true
      },
  registrationNumber: {
    type: String,
    required: true
  },
  wardNumber: {
    type: Number,
    required: true
  },
  arrivalTime: {
    type: Number,
    required: true
  },
  departureTime: {
    type: Number,
    required: true
  },
  distance: {
    type: Number,
    required: true
  },
  time: {
    type: Number,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  costPerKm: {
    type: Number,
    required: true
  },
  cost: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Bills', BillsSchema);

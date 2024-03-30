const mongoose = require('mongoose');

const LandfillSchema = new mongoose.Schema({
  landfillId: {
    type: Number,
    required: true,
    unique: true // Ensures uniqueness of landfillId
  },
  longitude: {
    type: Number,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  }
});

module.exports = mongoose.model('Landfill', LandfillSchema);

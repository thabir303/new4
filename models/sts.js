const mongoose = require('mongoose');

const STSSchema = new mongoose.Schema({
  wardNumber: {
    type: Number,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('STS', STSSchema);

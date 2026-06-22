const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  items: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Deal', dealSchema);
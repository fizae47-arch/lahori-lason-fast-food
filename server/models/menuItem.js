const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  // Normal item ke liye single price
  price: {
    type: Number
  },
  // Pizza jaisi items ke liye multiple sizes
  sizes: {
    small: { type: Number },
    medium: { type: Number },
    large: { type: Number }
  },
  available: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);
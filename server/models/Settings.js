const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  password: {
    type: String,
    required: true,
    default: 'lahori2026'
  }
});

module.exports = mongoose.model('Settings', settingsSchema);
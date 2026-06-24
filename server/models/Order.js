const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  invoiceNumber: {
    type: Number,
    unique: true
  },
  customerName: {
    type: String,
    required: true
  },
  // ... baaki sab same rahega
  items: [
    {
      menuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem',
        required: true
      },
      name: {
        type: String,
        required: true
      },
      size: {
        type: String // "small", "medium", "large" — agar pizza ho
      },
      price: {
        type: Number,
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        default: 1
      }
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
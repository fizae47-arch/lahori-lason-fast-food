const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Naya Order Banao
router.post('/', async (req, res) => {
  try {
    // Sab se latest order dhundo, uska invoiceNumber lekar +1 karo
    const lastOrder = await Order.findOne().sort({ invoiceNumber: -1 });
    const nextInvoiceNumber = lastOrder?.invoiceNumber ? lastOrder.invoiceNumber + 1 : 1;

    const newOrder = new Order({
      ...req.body,
      invoiceNumber: nextInvoiceNumber,
    });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Saare Orders Lao (Admin ke liye)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Order Status Update Karo (Admin ke liye)
router.put('/:id', async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Order Delete Karo
router.delete('/:id', async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order Deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Deal = require('../models/Deal');

// Saare Deals Lao
router.get('/', async (req, res) => {
  try {
    const deals = await Deal.find();
    res.json(deals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Naya Deal Add Karo
router.post('/', async (req, res) => {
  try {
    const newDeal = new Deal(req.body);
    await newDeal.save();
    res.status(201).json(newDeal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Deal Update Karo
router.put('/:id', async (req, res) => {
  try {
    const updatedDeal = await Deal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedDeal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Deal Delete Karo
router.delete('/:id', async (req, res) => {
  try {
    await Deal.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deal Deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
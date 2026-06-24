const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const Category = require('../models/Category');

// Saari Categories Lao
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Saare Menu Items Lao (category ke naam ke saath)
router.get('/items', async (req, res) => {
  try {
   const items = await MenuItem.find().populate('category', 'name').sort({ createdAt: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Naya Item Add Karo (Admin ke liye)
router.post('/items', async (req, res) => {
  try {
    const newItem = new MenuItem(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Item Update Karo (Admin ke liye)
router.put('/items/:id', async (req, res) => {
  try {
    const updatedItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Item Delete Karo (Admin ke liye)
router.delete('/items/:id', async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item Deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Naya Category Add Karo
router.post('/categories', async (req, res) => {
  try {
    const newCategory = new Category(req.body);
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Category Delete Karo
router.delete('/categories/:id', async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category Deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
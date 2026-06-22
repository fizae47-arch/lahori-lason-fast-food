const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');

// Login Check Karo
router.post('/login', async (req, res) => {
  try {
    const { password } = req.body;
    let settings = await Settings.findOne();

    // Agar settings exist nahi karti, naya bana do default password se
    if (!settings) {
      settings = new Settings({ password: 'lahori2026' });
      await settings.save();
    }

    if (password === settings.password) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: 'Galat Password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Password Change Karo
router.post('/change-password', async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    let settings = await Settings.findOne();

    if (!settings) {
      return res.status(400).json({ message: 'Settings not found' });
    }

    if (oldPassword !== settings.password) {
      return res.status(401).json({ message: 'Wrong password' });
    }

    settings.password = newPassword;
    await settings.save();
    res.json({ success: true, message: 'Password Changed!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
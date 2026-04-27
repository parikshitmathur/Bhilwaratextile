// routes/inquiry.js

const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');

// 🔴 POST: Jab customer form submit karega
router.post('/add', async (req, res) => {
  try {
    
    // 1. Seedha database mein Create aur Save ek sath karo
    await Inquiry.create({
      clientName: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      fabricName: req.body.fabric,
      quantity: req.body.qty
    });

    // 2. Kaam hone ke baad customer ko wapas Home page pe bhej do
    res.redirect('/?success=true');

  } catch (error) {
    // Agar koi error aayi toh ye chalega
    console.log(error);
    res.status(500).send("Server mein kuch gadbad hai!");
  }
});

module.exports = router;
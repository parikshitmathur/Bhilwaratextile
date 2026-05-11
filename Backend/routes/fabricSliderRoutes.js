const express = require('express');
const router = express.Router();
const FabricSlider = require('../models/FabricSlider');

// 1. GET Route: Admin Page render karne ke liye
router.get('/', async (req, res) => {
  try {
    // Data fetch karo
    const sliderData = await FabricSlider.findOne();
    
    // 🔥 FIX: Folder 'admin-panel' aur file 'fabric-slider-page' use karo
    // Saath hi 'slides' bhej rahe hain kyunki aapne EJS mein loop lagaya ho sakta hai
    // Agar single object hai toh [sliderData] array bana kar bhej rahe hain
    res.render('admin-panel/fabric-slider-page', { 
      slides: sliderData ? [sliderData] : [], 
      data: sliderData || {},
      title: "Manage Fabric Slider"
    });

  } catch (error) {
    console.error("Render Error:", error);
    res.status(500).send("Admin panel load nahi ho raha: " + error.message);
  }
});

// 2. POST Route: Data update ya create karne ke liye
router.post('/update', async (req, res) => {
  try {
    const { 
      tagline, titleMain, titleGold, description, 
      badgeText, imageURL, stat1_val, stat1_lbl, stat2_val, stat2_lbl 
    } = req.body;

    // Stats array format mein convert karna
    const stats = [
      { value: stat1_val, label: stat1_lbl },
      { value: stat2_val, label: stat2_lbl }
    ];

    let sliderData = await FabricSlider.findOne();

    if (sliderData) {
      // Update existing record
      await FabricSlider.findOneAndUpdate({}, {
        tagline, titleMain, titleGold, description, badgeText, imageURL, stats
      });
    } else {
      // Naya record create karo
      await FabricSlider.create({
        tagline, titleMain, titleGold, description, badgeText, imageURL, stats
      });
    }

    // 🔥 FIX: Redirect ka path wahi rakhein jo server.js mein mount kiya hai
    res.redirect('/admin/fabric-slider');

  } catch (error) {
    res.status(500).send("Data update fail ho gaya: " + error.message);
  }
});

module.exports = router;
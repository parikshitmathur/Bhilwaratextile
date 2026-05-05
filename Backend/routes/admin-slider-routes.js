const express = require('express');
const router = express.Router();
const HeroSlider = require('../models/HeroSlider');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 📁 Specific Storage Path
const sliderPath = 'C:/Users/Hp/OneDrive/Desktop/real-node/bhilwara-textile/Frontend/public/images/admin-add-silder';
if (!fs.existsSync(sliderPath)) fs.mkdirSync(sliderPath, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, sliderPath),
    filename: (req, file, cb) => {
        cb(null, `SLIDE-${req.body.slideNumber}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

// Render Admin Slider Page
router.get('/admin/manage-slider', async (req, res) => {
    const slides = await HeroSlider.find().sort({ slideNumber: 1 });
    res.render('admin-panel/admin-add-silder', { slides, title: 'Manage Hero Slider' });
});

// Update/Upload Slide API
router.post('/api/admin/update-slide', upload.single('slideImage'), async (req, res) => {
    try {
        const { slideNumber, title, subtitle } = req.body;
        let updateData = { title, subtitle, updatedAt: Date.now() };

        if (req.file) {
            updateData.imagePath = `/images/admin-add-silder/${req.file.filename}`;
        }

        await HeroSlider.findOneAndUpdate(
            { slideNumber: slideNumber },
            updateData,
            { upsert: true, new: true }
        );

        res.redirect('/admin/manage-slider?success=true');
    } catch (err) {
        res.status(500).send("Slider Update Error: " + err.message);
    }
});

module.exports = router;
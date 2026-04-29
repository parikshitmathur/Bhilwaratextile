const express = require('express');
const router = express.Router();
const Seller = require('../models/Seller');

// GET Route: Seller Form dikhane ke liye
router.get('/seller', (req, res) => {
    res.render('seller', { title: 'For Sellers - Register | Bhilwara Textile' });
});

// POST Route: Form ka data save karne ke liye
router.post('/submit-seller', async (req, res) => {
    try {
        const { companyName, contactPerson, mobile, email, city, businessType } = req.body;
        
        await Seller.create({
            companyName,
            contactPerson,
            mobile,
            email,
            city,
            businessType
        });

        // Save hone ke baad success message
        res.send(`
            <div style="text-align: center; margin-top: 100px; font-family: sans-serif;">
                <h1 style="color: #C9922A;">Registration Successful! 🎉</h1>
                <p style="color: #666; margin-top: 10px;">Welcome to Bhilwara Textile. Our team will contact you shortly.</p>
                <a href="/" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background: #141210; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Go Back Home</a>
            </div>
        `);
    } catch (error) {
        console.error("Seller Registration Error:", error);
        res.status(500).send("Bhai server me kuch locha ho gaya, wapas try kar!");
    }
});

module.exports = router;
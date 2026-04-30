const express = require('express');
const router = express.Router();
const Seller = require('../models/Seller'); // Ekdum sahi file name!


// 🟢 Seller Registration Page
router.get('/seller', (req, res) => {
    // 🔴 YAHAN BADLAV HUA HAI: folder ka naam 'seller-admin' aur file 'seller-form'
    res.render('seller-admin/seller-form', { title: 'Seller Registration | Bhilwara Textile' });
});
// 🔴 Seller Form Submit API
router.post('/api/seller/register', async (req, res) => {
    try {
        let selectedFabrics = req.body.fabrics;
        if (!selectedFabrics) {
            selectedFabrics = [];
        } else if (!Array.isArray(selectedFabrics)) {
            selectedFabrics = [selectedFabrics];
        }

        const sellerData = {
            ...req.body,
            fabrics: selectedFabrics
        };

        await Seller.create(sellerData);
        
        res.send(`
            <div style="text-align: center; margin-top: 100px; font-family: sans-serif;">
                <h1 style="color: #C9922A; font-size: 40px;">Welcome to Bhilwara Textile! 🚀</h1>
                <p style="color: gray; font-size: 18px; margin-bottom: 30px;">Aapka business successfully register ho gaya hai. Hamari team verification ke liye jaldi contact karegi.</p>
                <a href="/" style="padding: 12px 24px; background: #141210; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Back to Home</a>
            </div>
        `);
    } catch (error) {
        console.log("Seller Registration Error:", error.message);
        res.send("Bhai, form submit hone me error aa gaya. Kripya details (aur address format) check karein!");
    }
});

module.exports = router;
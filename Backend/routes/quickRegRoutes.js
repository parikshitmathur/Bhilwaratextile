const express = require('express');
const router = express.Router();
const QuickRegistration = require('../models/QuickRegistration');

// 🟢 1. Viewer/User Page: "Free Join" page dikhane ke liye
router.get('/join-free', (req, res) => {
    res.render('join-free', { title: 'Free Registration | Bhilwara Textile' });
});

// 🔴 2. Form Submit: Mobile number save karne ke liye
router.post('/api/quick-register', async (req, res) => {
    try {
        await QuickRegistration.create({ mobile: req.body.mobile });
        // Save hone ke baad wapas usi page par bhej do ek success flag ke sath
        res.redirect('/join-free?success=true');
    } catch (error) {
        console.log(error);
        res.status(500).send("Bhai, register karne mein error aa gaya!");
    }
});

// 🟡 3. Admin Panel: Saare numbers dekhne ke liye
router.get('/admin/quick-registrations', async (req, res) => {
    try {
        const registrations = await QuickRegistration.find().sort({ createdAt: -1 });
        res.render('admin-panel/Quick-Registrations', { 
            title: 'Quick Registrations | Admin',
            registrations 
        });
    } catch (error) {
        res.status(500).send("Admin page load nahi ho raha.");
    }
});

module.exports = router;
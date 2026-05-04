const express = require('express');
const router = express.Router();
const Seller = require('../models/Seller');

// REGISTER PAGE
router.get('/seller/admin-register', (req, res) => {
    res.render('seller-admin/admin-register');
});

// REGISTER API
router.post('/api/seller/register', async (req, res) => {
    try {
        let fabrics = req.body.fabrics || [];
        if (!Array.isArray(fabrics)) fabrics = [fabrics];

        await Seller.create({
            ...req.body,
            fabrics,
            status: 'Pending'
        });

        res.redirect('/seller/admin-register');
    } catch (err) {
        console.log(err);
        res.send("Error");
    }
});

// STATUS UPDATE
router.post('/api/seller/update-status/:id', async (req, res) => {
    try {
        await Seller.findByIdAndUpdate(req.params.id, {
            status: req.body.status
        });
        res.redirect('/admin/seller-requests');
    } catch (err) {
        res.send("Update Error");
    }
});

module.exports = router;
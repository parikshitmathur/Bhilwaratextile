const express = require('express');
const router = express.Router();
const Seller = require('../models/seller-admin-model');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const multer = require('multer');
const path = require('path');
const fs = require('fs');


// ================================
// 📁 MULTER SETUP (IMAGE UPLOAD)
// ================================

const uploadPath = path.join(__dirname, '../../Frontend/public/images/seller-profile-img');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });


// ================================
// 🔹 PAGES RENDERING
// ================================

router.get('/tx-login', (req, res) => 
    res.render('seller-admin/tx-login')
);

router.get('/tx-register', (req, res) => 
    res.render('seller-admin/tx-register')
);

router.get('/tx-forgot', (req, res) => 
    res.render('seller-admin/tx-forgot')
);

router.get('/tx-reset/:token', (req, res) => 
    res.render('seller-admin/tx-reset', { token: req.params.token })
);


// ================================
// 🔹 REGISTER API
// ================================

router.post('/api/seller-admin/register', async (req, res) => {
    try {
        const seller = new Seller({
            ...req.body,
            status: 'Approved'
        });

        await seller.save();

        res.cookie('sellerId', seller._id, { httpOnly: true });

        res.redirect('/tx-dashboard');

    } catch (err) {
        res.status(500).send(err.message);
    }
});


// ================================
// 🔹 LOGIN API
// ================================

router.post('/api/seller/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const seller = await Seller.findOne({ email });

        if (!seller) return res.send("Email not found");
        if (seller.password !== password) return res.send("Wrong password");

        res.cookie('sellerId', seller._id, { httpOnly: true });

        res.redirect('/tx-dashboard');

    } catch (err) {
        res.status(500).send("Login error");
    }
});


// ================================
// 🔹 FORGOT PASSWORD
// ================================

router.post('/api/seller-admin/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        const seller = await Seller.findOne({ email });
        if (!seller) return res.send("Email not found");

        const token = crypto.randomBytes(20).toString('hex');

        seller.resetToken = token;
        seller.resetTokenExpiry = Date.now() + 3600000;

        await seller.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            to: seller.email,
            from: process.env.EMAIL_USER,
            subject: 'Password Reset',
            text: `${process.env.BASE_URL}/tx-reset/${token}`
        });

        res.send(`<script>alert('Reset link sent!');window.location='/tx-login';</script>`);

    } catch (err) {
        res.status(500).send("Error sending email");
    }
});


// ================================
// 🔹 RESET PASSWORD
// ================================

router.post('/api/seller-admin/reset-password', async (req, res) => {
    try {
        const { token, newPassword, confirmPassword } = req.body;

        if (newPassword !== confirmPassword) {
            return res.send("Passwords do not match");
        }

        const seller = await Seller.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }
        });

        if (!seller) return res.send("Token invalid");

        seller.password = newPassword;
        seller.resetToken = undefined;
        seller.resetTokenExpiry = undefined;

        await seller.save();

        res.send(`<script>alert('Password updated!');window.location='/tx-login';</script>`);

    } catch (err) {
        res.status(500).send("Reset error");
    }
});


// ================================
// 🔹 LOGOUT
// ================================

router.get('/tx-logout', (req, res) => {
    res.clearCookie('sellerId');
    res.redirect('/tx-login');
});


// ================================
// 🔹 PROFILE PAGE
// ================================

router.get('/tx-profile', async (req, res) => {
    if (!req.cookies.sellerId) {
        return res.redirect('/tx-login');
    }

    const user = await Seller.findById(req.cookies.sellerId);

    res.render('seller-admin/tx-profile', { user });
});


// ================================
// 🔹 UPDATE PROFILE (FINAL)
// ================================

router.post('/tx-profile/update', upload.single('logo'), async (req, res) => {

    const user = await Seller.findById(req.cookies.sellerId);

    let updateData = {
        companyName: req.body.companyName,
        shortName: req.body.shortName,
        ownerName: req.body.ownerName,
        mobile: req.body.mobile,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        description: req.body.description
    };

    // 🗑 OLD IMAGE DELETE
    if (req.file && user.logo) {
        const oldPath = path.join(__dirname, '../Frontend/public', user.logo);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    // 🆕 NEW IMAGE SAVE
    if (req.file) {
        updateData.logo = '/images/seller-profile-img/' + req.file.filename;
    }

    await Seller.findByIdAndUpdate(req.cookies.sellerId, updateData);

    res.redirect('/tx-profile');
});


module.exports = router;
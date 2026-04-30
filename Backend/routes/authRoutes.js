const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer'); // 🟢 NAYA: Email bhejne ke liye
const User = require('../models/User'); // Tumhara User model

// 🟢 OTP Save karne ke liye desi jugad (Memory storage)
const otpStorage = {}; 

// 🟢 Email Bhejne wala Engine (Secure tareeke se .env se credentials lega)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // .env file se aayega
        pass: process.env.EMAIL_PASS  // .env file se aayega (wo 16-digit wala)
    }
});


// 🟢 1. UI Pages dikhane ke routes (Naye pages bhi jod diye)
router.get('/register', (req, res) => res.render('user/register'));
router.get('/login', (req, res) => res.render('user/login'));
router.get('/forgot-password', (req, res) => res.render('user/forgot-password')); // NAYA
router.get('/reset-password', (req, res) => res.render('user/reset-password')); // NAYA


// 🔴 2. SIMPLE REGISTER API (Bina kisi security/encryption ke)
router.post('/api/register', async (req, res) => {
    try {
        // Seedha data uthao aur DB mein phek do
        await User.create(req.body); 
        
        // Save hote hi Login page par bhej do
        res.redirect('/login');
    } catch (error) {
        console.log("Register Error:", error);
        res.send("Bhai, yeh Email pehle se register hai!");
    }
});


// 🔴 3. SIMPLE LOGIN API (Direct Match)
router.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Seedha check karo ki is Email aur Password wala koi User hai kya?
        const user = await User.findOne({ email: email, password: password });

        if (user) {
            // User mil gaya! Ek simple Cookie de do taaki yaad rahe
            res.cookie('isLoggedIn', 'yes');
            res.redirect('/'); // Home page par bhej do
        } else {
            // Match nahi hua
            res.send("Bhai, Email ya Password galat hai!");
        }
    } catch (error) {
        console.log("Login Error:", error);
        res.send("Login mein error aa gaya.");
    }
});


// 🟡 4. Logout API
router.get('/logout', (req, res) => {
    res.clearCookie('isLoggedIn'); // Cookie uda do
    res.redirect('/');
});


// 🔵 5. FORGOT PASSWORD - OTP Bhejne ka API
router.post('/api/send-forgot-otp', async (req, res) => {
    const { email } = req.body;

    try {
        // Pehle check karo user hai bhi ya nahi
        const user = await User.findOne({ email });
        if (!user) {
            return res.send("Bhai, is email se koi account nahi hai! Pehle register karo.");
        }

        // 4-digit ka random OTP banao
        const otp = Math.floor(1000 + Math.random() * 9000);
        
        // OTP ko memory me save kar lo
        otpStorage[email] = otp;

        // Email bhej do
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset OTP - Bhilwara Textile',
            text: `Aapka Password Reset OTP hai: ${otp}\n\nIse kisi ke sath share na karein.`
        };

        await transporter.sendMail(mailOptions);
        
        // OTP bhejne ke baad user ko sidha Reset Password page par bhej do (URL me email lagakar)
        res.redirect(`/reset-password?email=${email}`);

    } catch (error) {
        console.log("OTP Error:", error);
        res.send("OTP bhejne me problem hui. Apni .env file check karo bhai!");
    }
});


// 🔵 6. RESET PASSWORD - OTP Verify karke Naya Password Save karna
router.post('/api/reset-password', async (req, res) => {
    const { email, otp, newPassword } = req.body;

    // Check karo OTP match ho raha hai ya nahi
    if (otpStorage[email] && otpStorage[email] == otp) {
        try {
            // OTP match ho gaya! Password update kar do (Ye bhi direct save hoga)
            await User.findOneAndUpdate({ email: email }, { password: newPassword });
            
            // OTP memory se delete kar do taaki koi dobara use na kar sake
            delete otpStorage[email];

            // Success message dikhao aur Login ka button do
            res.send(`
                <div style="text-align: center; margin-top: 50px; font-family: sans-serif;">
                    <h2 style="color: green;">Password successfully changed! 🎉</h2>
                    <br>
                    <a href="/login" style="padding: 12px 24px; background: #C9922A; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Login Now</a>
                </div>
            `);
        } catch (error) {
            res.send("Password update karne me error aa gaya.");
        }
    } else {
        res.send("Bhai, OTP galat hai! Wapas try karo.");
    }
});

module.exports = router;
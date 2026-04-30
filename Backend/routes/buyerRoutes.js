const express = require('express');
const router = express.Router();
const Requirement = require('../models/Requirement');
const Category = require('../models/Category'); //
// GET Route: फॉर्म दिखाने के लिए
router.get('user/buyer', async (req, res) => {
    const allCategories = await Category.find();
    res.render('buyer', { categories: allCategories });
});
// POST Route: फॉर्म का डेटा डेटाबेस में ठूसने के लिए
router.post('/submit-requirement', async (req, res) => {
    try {
        // Form से डेटा निकालो
        const { name, mobile, email, category, quantity } = req.body;

        // नया डॉक्यूमेंट बनाओ
        const newReq = new Requirement({
            companyName: name,
            mobile: mobile,
            email: email,
            category: category,
            quantity: quantity
        });

        // Database में सेव करो
        await newReq.save();
        
        console.log("Data saved successfully!");
        // सक्सेस होने पर वापस फॉर्म पर भेज दो या कोई सक्सेस पेज दिखा दो
        res.send(`
            <div style="text-align: center; margin-top: 50px; font-family: sans-serif;">
                <h1 style="color: green;">Badhai ho! Requirement Database me chali gayi 🎉</h1>
                <a href="/buyer" style="padding: 10px 20px; background: blue; color: white; text-decoration: none; border-radius: 5px;">Go Back</a>
            </div>
        `);

    } catch (error) {
        console.error("error", error);
        res.status(500).send("<h1>Server Error. Check console!</h1>");
    }
});

module.exports = router;
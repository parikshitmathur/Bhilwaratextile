// routes/category.js
const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const multer = require('multer');
const path = require('path');

// ══════════ MULTER SETUP (IMAGE UPLOAD) ══════════
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Tera exact path jahan photo save hogi (Backend/routes se 2 step peeche)
    // Note: 'category-img' folder pehle se bana hona chahiye tera!
    cb(null, path.join(__dirname, '../../Frontend/public/images/category-img'));
  },
  filename: function (req, file, cb) {
    // Photo ko naya naam do: Time + Original extension (.jpg/.png)
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });


// 🔴 POST: Category Add (With Image) -> 'upload.single("image")' add kiya hai
router.post('/add', upload.single('image'), async (req, res) => {
  try {
    // Agar photo upload hui hai, toh uska public path save karo
    // Taaki EJS usko <img src="/images/category-img/xyz.jpg"> karke dikha sake
    let imagePath = '';
    if (req.file) {
      imagePath = '/images/category-img/' + req.file.filename;
    }

    await Category.create({
      name: req.body.name,
      description: req.body.description,
      image: imagePath // 📸 Database mein path save ho gaya
    });

    res.redirect('/admin/add-category');

  } catch (error) {
    if(error.code === 11000) {
      return res.status(400).send("Bhai, ye category pehle se bani hui hai!");
    }
    console.log("Upload Error:", error);
    res.status(500).send("Server mein photo save karne mein gadbad hui!");
  }
});


// 🟢 GET: Saari Categories lene ke liye
router.get('/all', async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Categories laane mein dikkat aa rahi hai." });
  }
});

// 🔴 POST: Delete Route
router.post('/delete/:id', async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.redirect('/admin/add-category');
    } catch (error) {
        console.log(error);
        res.status(500).send("Delete karne mein dikkat aayi.");
    }
});

module.exports = router;
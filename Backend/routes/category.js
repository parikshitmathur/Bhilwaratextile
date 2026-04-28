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
// ... baaki imports wahi rahenge ...
// 🔴 POST: Category Add/Update (Smart Route)
router.post('/add', upload.single('image'), async (req, res) => {
  try {
    let imagePath = '';
    if (req.file) {
      imagePath = '/images/category-img/' + req.file.filename;
    }

    // Comma-separated subcategories ko array mein badlo
    let subCatArray = [];
    if (req.body.subcategories) {
        // Filter lagaya hai taaki khali space ya extra comma na save ho
        subCatArray = req.body.subcategories.split(',').map(item => item.trim()).filter(item => item !== "");
    }

    // 🧠 SMART LOGIC: Pehle check karo ki category already hai kya?
    let existingCategory = await Category.findOne({ name: req.body.name });

    if (existingCategory) {
        // 🔹 AGAR PEHLE SE HAI -> Toh usko Update karo
        
        if (imagePath) existingCategory.image = imagePath; // Agar nayi photo dali hai toh update kar do
        if (req.body.description) existingCategory.description = req.body.description;

        // Purani aur nayi subcategories ko mila do (Set ka use kiya taaki duplicate entry na ho)
        existingCategory.subcategories = [...new Set([...existingCategory.subcategories, ...subCatArray])];

        await existingCategory.save();
        console.log(`✅ Category '${req.body.name}' Update ho gayi!`);

    } else {
        // 🔹 AGAR NAHI HAI -> Toh Nayi Category Banao
        
        await Category.create({
          name: req.body.name,
          description: req.body.description,
          image: imagePath,
          subcategories: subCatArray
        });
        console.log(`🚀 Nayi Category '${req.body.name}' Ban gayi!`);
    }

    res.redirect('/admin/add-category');

  } catch (error) {
    console.log("Upload Error:", error);
    res.status(500).send("Galti ho gayi bhai!");
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
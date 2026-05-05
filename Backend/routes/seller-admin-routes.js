const express = require('express');
const router = express.Router();
const Seller = require('../models/seller-admin-model');
const Product = require('../models/Product'); 
const Category = require('../models/Category'); 
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ==========================================
// 📁 MULTER CONFIGURATIONS (Dual Storage)
// ==========================================

// 1. Profile Logo Storage Path
const profilePath = path.join(__dirname, '../../Frontend/public/images/seller-profile-img');
if (!fs.existsSync(profilePath)) fs.mkdirSync(profilePath, { recursive: true });

const profileStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, profilePath),
    filename: (req, file, cb) => cb(null, 'LOGO-' + Date.now() + path.extname(file.originalname))
});

// 2. Product Images Storage Path
const productPath = path.join(__dirname, '../../Frontend/public/images/seller-products');
if (!fs.existsSync(productPath)) fs.mkdirSync(productPath, { recursive: true });

const productStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, productPath),
    filename: (req, file, cb) => cb(null, 'PROD-' + Date.now() + path.extname(file.originalname))
});

const uploadLogo = multer({ storage: profileStorage });
const uploadProduct = multer({ storage: productStorage });


// ==========================================
// 🔹 AUTH & PAGES RENDERING
// ==========================================

router.get('/tx-login', (req, res) => res.render('seller-admin/tx-login'));
router.get('/tx-register', (req, res) => res.render('seller-admin/tx-register'));
router.get('/tx-forgot', (req, res) => res.render('seller-admin/tx-forgot'));
router.get('/tx-reset/:token', (req, res) => res.render('seller-admin/tx-reset', { token: req.params.token }));

router.post('/api/seller-admin/register', async (req, res) => {
    try {
        const seller = new Seller({ ...req.body, status: 'Approved' });
        await seller.save();
        res.cookie('sellerId', seller._id, { httpOnly: true });
        res.redirect('/tx-dashboard');
    } catch (err) { res.status(500).send(err.message); }
});

router.post('/api/seller/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const seller = await Seller.findOne({ email });
        if (!seller) return res.send("Email not found");
        if (seller.password !== password) return res.send("Wrong password");
        res.cookie('sellerId', seller._id, { httpOnly: true });
        res.redirect('/tx-dashboard');
    } catch (err) { res.status(500).send("Login error"); }
});

router.get('/tx-logout', (req, res) => {
    res.clearCookie('sellerId');
    res.redirect('/tx-login');
});

// ==========================================
// 🔹 PROFILE MANAGEMENT
// ==========================================

router.get('/tx-profile', async (req, res) => {
    if (!req.cookies.sellerId) return res.redirect('/tx-login');
    const user = await Seller.findById(req.cookies.sellerId);
    res.render('seller-admin/tx-profile', { user });
});

router.post('/tx-profile/update', uploadLogo.single('logo'), async (req, res) => {
    try {
        const user = await Seller.findById(req.cookies.sellerId);
        let updateData = { ...req.body };

        if (req.file) {
            if (user.logo) {
                const oldPath = path.join(__dirname, '../../Frontend/public', user.logo);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            updateData.logo = '/images/seller-profile-img/' + req.file.filename;
        }
        await Seller.findByIdAndUpdate(req.cookies.sellerId, updateData);
        res.redirect('/tx-profile');
    } catch (err) { res.status(500).send("Update Error"); }
});

// ==========================================
// 🔹 PRODUCT MANAGEMENT (Add, List, Edit, Delete)
// ==========================================

// 1. ADD PRODUCT PAGE
router.get('/seller/add-product', async (req, res) => {
    if (!req.cookies.sellerId) return res.redirect('/tx-login');
    try {
        const user = await Seller.findById(req.cookies.sellerId);
        const categories = await Category.find().sort({ name: 1 });
        res.render('seller-admin/add-product', { user, categories });
    } catch (err) { res.status(500).send("Error loading categories"); }
});

// 2. SAVE PRODUCT API
router.post('/api/seller/add-product', uploadProduct.single('productImage'), async (req, res) => {
    try {
        const { productName, category, fabricType, bulkStock, pricePerUnit, description } = req.body;
        const newProduct = new Product({
            sellerId: req.cookies.sellerId,
            productName,
            category,
            fabricType,
            bulkStock,
            pricePerUnit,
            description,
            fabricImage: req.file ? '/images/seller-products/' + req.file.filename : ''
        });
        await newProduct.save();
        res.send("<script>alert('Product Added Successfully!'); window.location='/seller/my-products';</script>");
    } catch (err) { res.status(500).send("Error saving product: " + err.message); }
});

// 3. MY PRODUCTS LIST (Inventory)
// 3. MY PRODUCTS LIST (Inventory) - Fully Dynamic with Categories
router.get('/seller/my-products', async (req, res) => {
    if (!req.cookies.sellerId) return res.redirect('/tx-login');
    try {
        // 1. Seller ka data lo
        const user = await Seller.findById(req.cookies.sellerId);
        
        // 2. Seller ke products lo
        const products = await Product.find({ sellerId: req.cookies.sellerId }).sort({ createdAt: -1 });
        
        // 3. 🆕 Sabhi categories fetch karo taaki filter dynamic ho jaye
        const categories = await Category.find().sort({ name: 1 });

        // 4. Render karo saare data ke saath
        res.render('seller-admin/my-products', { 
            user, 
            products, 
            categories, // Isse aapka dynamic filter aur modal dropdown chalega
            title: "My Inventory" 
        });
    } catch (err) { 
        console.error("Inventory Fetch Error:", err);
        res.status(500).send("Error fetching inventory data"); 
    }
});
// 4. EDIT PRODUCT PAGE (Render) -> Isse 404 error solve hogi
router.get('/seller/edit-product/:id', async (req, res) => {
    if (!req.cookies.sellerId) return res.redirect('/tx-login');
    try {
        const user = await Seller.findById(req.cookies.sellerId);
        const product = await Product.findById(req.params.id);
        const categories = await Category.find().sort({ name: 1 });
        
        if (!product) return res.send("Product not found!");
        
        res.render('seller-admin/edit-product', { user, product, categories });
    } catch (err) { res.status(500).send("Error loading edit page"); }
});

// 5. UPDATE PRODUCT API
router.post('/api/seller/update-product/:id', uploadProduct.single('productImage'), async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        let updateData = { ...req.body };

        if (req.file) {
            // Delete old product image
            if (product.fabricImage) {
                const oldPath = path.join(__dirname, '../../Frontend/public', product.fabricImage);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            updateData.fabricImage = '/images/seller-products/' + req.file.filename;
        }

        await Product.findByIdAndUpdate(req.params.id, updateData);
        res.send("<script>alert('Product Updated!'); window.location='/seller/my-products';</script>");
    } catch (err) { res.status(500).send("Update Error: " + err.message); }
});

// 6. DELETE PRODUCT API
router.post('/api/seller/delete-product/:id', async (req, res) => {
    try {
        if (!req.cookies.sellerId) return res.sendStatus(401);
        const product = await Product.findById(req.params.id);
        
        // Clean up image file before deleting record
        if (product.fabricImage) {
            const imgPath = path.join(__dirname, '../../Frontend/public', product.fabricImage);
            if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
        }

        await Product.findByIdAndDelete(req.params.id);
        res.sendStatus(200);
    } catch (err) { res.status(500).send(err.message); }
});

module.exports = router;
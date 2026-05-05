/**
 * ============================================================
 * PROJECT: BHILWARA TEXTILE - ELITE MANAGEMENT SYSTEM
 * AUTHOR: PARIKSHIT MATHUR (Super Authority)
 * DATE: 2026-05-02
 * ============================================================
 */

// ===== [01] MODULES & CONFIGURATION =====
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config(); 

const app = express();

// ===== [02] DATABASE CONNECTION =====
const dbURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bhilwaratextile';

mongoose.connect(dbURI)
  .then(() => console.log('✅ MongoDB Connected: Bhilwara Textile Database'))
  .catch(err => console.log('❌ DB Connection Error:', err));

// ===== [03] ENGINE & MIDDLEWARE SETTINGS =====
app.set('views', path.join(__dirname, '../Frontend/views'));
app.set('view engine', 'ejs');

// Static Files Configuration
app.use(express.static(path.join(__dirname, '../Frontend/public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Global Variables for EJS
app.use((req, res, next) => {
    res.locals.title = "Bhilwara Textile | Elite Marketplace";
    next();
});


// ✅ FINAL FIX
app.use((req, res, next) => {
    res.locals.title = "Bhilwara Textile | Elite Marketplace";
    res.locals.user = null;   // 🔥 FORCE DEFINE
    next();
});


// ===== [04] MODELS (Database Schemas) =====
const Category = require('./models/Category');
const Inquiry = require('./models/Inquiry');
const Requirement = require('./models/Requirement');
const SellerAdmin = require('./models/seller-admin-model'); 
const QuickRegistration = require('./models/QuickRegistration');
const Product = require('./models/Product');
const HeroSlider = require('./models/HeroSlider'); 

// ===== [05] CUSTOM AUTH MIDDLEWARES =====
// 🔐 Textile Seller Auth Check
const isTxAuthenticated = (req, res, next) => {
    if (req.cookies && req.cookies.sellerId) {
        next();
    } else {
        res.redirect('/tx-login');
    }
};

// ===== [06] ROUTES MOUNTING (External Files) =====
app.use('/', require('./routes/buyerRoutes'));
app.use('/', require('./routes/sellerRoutes')); 
app.use('/', require('./routes/authRoutes'));
app.use('/', require('./routes/seller-admin-routes')); 
app.use('/', require('./routes/admin-slider-routes'));

// API Route Groups
app.use('/api/category', require('./routes/category'));
app.use('/api/inquiry', require('./routes/inquiry'));

// ============================================================
// [07] SECTION: FRONTEND (USER) ROUTES
// ============================================================

// 🏠 MAIN HOME ROUTE (With Hero Slider & Categories)
app.get('/', async (req, res) => {
    try {
        // Parallel data fetching for performance
        const [slides, categories] = await Promise.all([
            HeroSlider.find().sort({ slideNumber: 1 }),
            Category.find().sort({ createdAt: -1 })
        ]);

        res.render('user/home', { 
            slides, 
            categories,
            title: "Bhilwara Textile | Home" 
        });
    } catch (err) {
        console.error("❌ Home Route Error:", err);
        res.render('user/home', { slides: [], categories: [] });
    }
});

app.get('/fabrics', (req, res) => res.render('user/fabrics'));
app.get('/products', (req, res) => res.render('user/products'));
app.get('/about', (req, res) => res.render('user/about'));
app.get('/become-seller', (req, res) => res.render('user/seller-registration'));

app.get('/buyer', async (req, res) => {
    try {
        const categories = await Category.find();
        res.render('user/buyer', { categories });
    } catch (err) {
        res.render('user/buyer', { categories: [] });
    }
});

// User Auth Rendering
app.get('/join-free', (req, res) => res.render('user/join-free'));
app.get('/login', (req, res) => res.render('user/login'));
app.get('/register', (req, res) => res.render('user/register'));
app.get('/forgot-password', (req, res) => res.render('user/forgot-password'));
app.get('/reset-password', (req, res) => res.render('user/reset-password'));


// ============================================================
// [08] SECTION: SELLER ADMIN (Merchant Dashboard)
// ============================================================

app.get('/tx-dashboard', isTxAuthenticated, async (req, res) => {
    try {
        const userData = await SellerAdmin.findById(req.cookies.sellerId);
        res.render('seller-admin/tx-dashboard', { user: userData });
    } catch (err) {
        res.redirect('/tx-login');
    }
});

// ============================================================
// [09] SECTION: MAIN ADMIN PANEL (Authority)
// ============================================================

// Seller Requests Management
app.get('/admin/seller-requests', async (req, res) => {
    res.render('admin-panel/Seller-Requests');
});

app.get('/admin/seller-requests/data', async (req, res) => {
    try {
        const data = await SellerAdmin.find().sort({ createdAt: -1 });
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: 'failed' });
    }
});

// Buyer Inquiries Management
app.get('/admin/buyer-inquiries', async (req, res) => {
    try {
        const inquiries = await Requirement.find().sort({ createdAt: -1 });
        res.render('admin-panel/Buyer-Inquiries', { inquiries });
    } catch (err) {
        res.status(500).send("Error loading inquiries");
    }
});

// Marketplace Authority (Product Management)
app.get('/admin/all-products', (req, res) => res.render('admin-panel/All-Products'));

app.get('/api/admin/all-products', async (req, res) => {
    try {
        const products = await Product.find()
            .populate('sellerId', 'companyName city') 
            .sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/admin/delete-product/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Product removed" });
    } catch (err) {
        res.status(500).json({ error: "Failed" });
    }
});

// Quick Leads / Registrations
app.get('/admin/quick-registrations', async (req, res) => {
    try {
        const registrations = await QuickRegistration.find().sort({ createdAt: -1 });
        res.render('admin-panel/Quick-Registrations', { registrations });
    } catch (err) {
        res.status(500).send("Error");
    }
});

// 🖼️ MANAGE HERO SLIDER (Admin Tool)
app.get('/admin/admin-add-silder', async (req, res) => {
    try {
        const slides = await HeroSlider.find().sort({ slideNumber: 1 });
        res.render('admin-panel/admin-add-silder', { 
            slides, 
            title: 'Manage Hero Slider' 
        });
    } catch (err) {
        res.status(500).send("Slider Page Error");
    }
});


// Status Updates API
app.post('/api/seller/update-status/:id', async (req, res) => {
    try {
        await SellerAdmin.findByIdAndUpdate(req.params.id, {
            status: req.body.status,
            isVerified: req.body.status === 'Approved'
        });
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send("Error");
    }
});

// ============================================================
// [10] SECTION: MISC & ERROR HANDLING
// ============================================================

app.post('/api/quick-register', async (req, res) => {
    try {
        if (!req.body.mobile) return res.status(400).send("Mobile required");
        await QuickRegistration.create({ mobile: req.body.mobile });
        res.redirect('/join-free?success=true');
    } catch (err) {
        res.status(500).send("Error");
    }
});

// 404 Handler
app.use((req, res) => {
    res.status(404).render('user/404', { title: "404 - Not Found" });
});


// ============================================================
// [11] SECTION: SERVER BOOTSTRAP
// ============================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`
    ====================================================
    🚀 SERVER ACTIVE: http://localhost:${PORT}
    🏠 ENVIRONMENT: Development
    📦 DATABASE: MongoDB Bhilwara Textile
    ====================================================
    `);
});
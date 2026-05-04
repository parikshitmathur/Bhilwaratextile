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
// Database Name: bhilwaratextile
const dbURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bhilwaratextile';

mongoose.connect(dbURI)
  .then(() => console.log('✅ MongoDB Connected: Bhilwara Textile Database'))
  .catch(err => console.log('❌ DB Connection Error:', err));

// ===== [03] ENGINE & MIDDLEWARE SETTINGS =====
// View Engine Setup (Frontend views path)
app.set('views', path.join(__dirname, '../Frontend/views'));
app.set('view engine', 'ejs');

// Static Files (CSS, JS, Images)
app.use(express.static(path.join(__dirname, '../Frontend/public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Global Variables (Available in all EJS files)
app.use((req, res, next) => {
    res.locals.title = "Bhilwara Textile | Elite Marketplace";
    next();
});

// ===== [04] MODELS (Database Schemas) =====
const Category = require('./models/Category');
const Inquiry = require('./models/Inquiry');
const Requirement = require('./models/Requirement');
const Seller = require('./models/Seller'); // Main Seller Model
const SellerAdmin = require('./models/seller-admin-model'); // Unique Seller Admin Model
const QuickRegistration = require('./models/QuickRegistration');

// ===== [05] ROUTES IMPORT & MOUNTING =====
const buyerRoutes = require('./routes/buyerRoutes');
const sellerRoutes = require('./routes/sellerRoutes'); 
const authRoutes = require('./routes/authRoutes');
const sellerAdminRoutes = require('./routes/seller-admin-routes'); // Unique Seller Admin Routes

// Base Route Groups
app.use('/', buyerRoutes);
app.use('/', sellerRoutes);
app.use('/', authRoutes);
app.use('/', sellerAdminRoutes); // Mounting Seller Admin (Login/Signup/Reset)

// API Route Groups
app.use('/api/category', require('./routes/category'));
app.use('/api/inquiry', require('./routes/inquiry'));


// ============================================================
// [06] SECTION: FRONTEND (USER) ROUTES
// ============================================================

app.get('/', async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.render('user/home', { categories });
    } catch (err) {
        res.render('user/home', { categories: [] });
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

// User Auth Endpoints
app.get('/join-free', (req, res) => res.render('user/join-free'));
app.get('/login', (req, res) => res.render('user/login'));
app.get('/register', (req, res) => res.render('user/register'));
app.get('/forgot-password', (req, res) => res.render('user/forgot-password'));
app.get('/reset-password', (req, res) => res.render('user/reset-password'));


// ============================================================
// [07] SECTION: SELLER ADMIN ROUTES (Merchant Dashboard)
// ============================================================

// Unique Seller Auth Pages (Managed via sellerAdminRoutes)
// These are: /seller/signup, /seller/signin, /seller/reset/:token

// 1. PEHLE DEFINE KARO (Middleware)
// ============================================================
// CUSTOM MIDDLEWARE: SELLER AUTH CHECK
// ============================================================
const isSellerAuthenticated = (req, res, next) => {
    // Check karna ki cookie mein sellerId hai ya nahi
    if (req.cookies && req.cookies.sellerId) {
        next(); // Agar hai toh aage badhne do
    } else {
        // Agar nahi hai toh login page par bhej do
        res.redirect('/seller/signin');
    }
};

// 2. PHIR USE KARO (Routes)
// 🔐 TEXTILE SELLER AUTH CHECK
const isTxAuthenticated = (req, res, next) => {
    if (req.cookies && req.cookies.sellerId) {
        next();
    } else {
        res.redirect('/tx-login');
    }
};


// 🎯 TEXTILE DASHBOARD
app.get('/tx-dashboard', isTxAuthenticated, async (req, res) => {
    try {
        // 1. Database se user ka data nikalo (Cookie mein save sellerId se)
        const userData = await SellerAdmin.findById(req.cookies.sellerId);

        // 2. Render karte waqt 'user' variable bhejo
        res.render('seller-admin/tx-dashboard', { user: userData });
    } catch (err) {
        console.log("Dashboard Data Error:", err);
        res.redirect('/tx-login');
    }
});
// ============================================================
// [08] SECTION: MAIN ADMIN PANEL ROUTES (Owner/Authority)
// ============================================================

// ===============================
// 📄 ADMIN PAGE
// ===============================
app.get('/admin/seller-requests', async (req, res) => {
    try {
        res.render('admin-panel/Seller-Requests'); // frontend fetch karega
    } catch (err) {
        res.status(500).send("Error loading page");
    }
});

// ===============================
// 📊 DATA API (ONLY ONE)
// ===============================
app.get('/admin/seller-requests/data', async (req, res) => {
    try {
        const data = await SellerAdmin.find().sort({ createdAt: -1 });
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: 'failed' });
    }
});
app.get('/admin/buyer-inquiries', async (req, res) => {
    try {
        const inquiries = await Requirement.find().sort({ createdAt: -1 });
        res.render('admin-panel/Buyer-Inquiries', { inquiries });
    } catch (err) {
        res.status(500).send("Error loading inquiries");
    }
});


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




app.get('/admin/quick-registrations', async (req, res) => {
    try {
        const registrations = await QuickRegistration.find().sort({ createdAt: -1 });
        res.render('admin-panel/Quick-Registrations', { registrations });
    } catch (err) {
        res.status(500).send("Error loading registrations");
    }
});


// ============================================================
// [09] SECTION: MISC & GLOBAL ERROR HANDLERS
// ============================================================

app.post('/api/quick-register', async (req, res) => {
    try {
        if (!req.body.mobile) return res.status(400).send("Mobile number required");
        await QuickRegistration.create({ mobile: req.body.mobile });
        res.redirect('/join-free?success=true');
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

// 404 Handler - Keep at the end
app.use((req, res) => {
    res.status(404).render('user/404', { title: "404 - Not Found" });
});

// ============================================================
// [10] SECTION: SERVER BOOTSTRAP
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
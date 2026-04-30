// ===== MODULES =====
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config(); 

const app = express();

// ===== DATABASE =====
const dbURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bhilwaratextile';

mongoose.connect(dbURI)
  .then(() => console.log('✅ MongoDB Connected: Bhilwara Textile Database'))
  .catch(err => console.log('❌ DB Error:', err));

// ===== MIDDLEWARE =====
// Views path set kiya (Frontend/views)
app.set('views', path.join(__dirname, '../Frontend/views'));
app.set('view engine', 'ejs');

// Assets (CSS/JS) ke liye static folder
app.use(express.static(path.join(__dirname, '../Frontend/public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Global Variables
app.use((req, res, next) => {
    res.locals.title = "Bhilwara Textile";
    next();
});

// ===== ROUTES IMPORT =====
const buyerRoutes = require('./routes/buyerRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/', buyerRoutes);
app.use('/', sellerRoutes);
app.use('/', authRoutes);

// API endpoints
app.use('/api/category', require('./routes/category'));
app.use('/api/inquiry', require('./routes/inquiry'));

// ===== MODELS =====
const Category = require('./models/Category');
const Inquiry = require('./models/Inquiry');
const Requirement = require('./models/Requirement');
const Seller = require('./models/Seller');
const QuickRegistration = require('./models/QuickRegistration');

// ===== FRONTEND (USER) ROUTES =====
// Note: Saari files ab 'user/' folder ke relative call hongi

// Home
app.get('/', async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.render('user/home', { categories }); // user folder ke andar check karega
    } catch (err) {
        console.log("Home Error:", err);
        res.render('user/home', { categories: [] });
    }
});

// Fabrics
app.get('/fabrics', (req, res) => {
    res.render('user/fabrics');
});

// About
app.get('/about', (req, res) => {
    res.render('user/about');
});

// About
app.get('/sell', (req, res) => {
    res.render('user/Sell');
});

app.get('/sellerop', (req, res) => {
    res.render('user/Seller');
});


// Buyer Section
app.get('/buyer', async (req, res) => {
    try {
        const categories = await Category.find();
        res.render('user/buyer', { categories });
    } catch (err) {
        res.render('user/buyer', { categories: [] });
    }
});

// Quick Register Page
app.get('/join-free', (req, res) => {
    res.render('user/join-free');
});

// Products (Extra: Agar file 'user' folder mein hai toh)
app.get('/products', (req, res) => {
    res.render('user/products');
});

// Seller Profile/Page


// ===== AUTH ROUTES (Login/Register) =====
app.get('/login', (req, res) => res.render('user/login'));
app.get('/register', (req, res) => res.render('user/register'));
app.get('/forgot-password', (req, res) => res.render('user/forgot-password'));
app.get('/reset-password', (req, res) => res.render('user/reset-password'));


// ===== QUICK REGISTER API =====
app.post('/api/quick-register', async (req, res) => {
    try {
        if (!req.body.mobile) return res.status(400).send("Mobile number required");
        await QuickRegistration.create({ mobile: req.body.mobile });
        res.redirect('/join-free?success=true');
    } catch (err) {
        res.status(500).send("Server Error");
    }
});


// ===== ADMIN ROUTES =====
// Admin panel files 'admin-panel/' folder mein hi hain
app.get('/admin', async (req, res) => {
    try {
        const inquiries = await Inquiry.find().sort({ createdAt: -1 });
        const categories = await Category.find().sort({ createdAt: -1 });
        res.render('admin-panel/Dashboard', { inquiries, categories });
    } catch (err) {
        res.status(500).send("Admin load error");
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

app.get('/admin/sellers', async (req, res) => {
    try {
        const sellers = await Seller.find().sort({ createdAt: -1 });
        res.render('admin-panel/Sellers', { sellers });
    } catch (err) {
        res.status(500).send("Error loading sellers");
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


// ===== 404 HANDLER =====
app.use((req, res) => {
    res.status(404).send("Page Not Found!");
});


// ===== SERVER =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Bhilwara Textile Server active on: http://localhost:${PORT}`);
});
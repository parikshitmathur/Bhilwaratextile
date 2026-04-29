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
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ DB Error:', err));


// ===== MIDDLEWARE =====
app.set('views', path.join(__dirname, '../Frontend/views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '../Frontend/public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 🔥 GLOBAL TITLE FIX (important)
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

app.use('/api/category', require('./routes/category'));
app.use('/api/inquiry', require('./routes/inquiry'));


// ===== MODELS =====
const Category = require('./models/Category');
const Inquiry = require('./models/Inquiry');
const Requirement = require('./models/Requirement');
const Seller = require('./models/Seller');
const QuickRegistration = require('./models/QuickRegistration');


// ===== FRONTEND ROUTES =====

// HOME
app.get('/', async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });

        res.render('home', {
            categories
        });

    } catch (err) {
        console.log("Home Error:", err);
        res.render('home', { categories: [] });
    }
});

// FABRICS
app.get('/fabrics', (req, res) => {
    res.render('fabrics');
});

// ABOUT
app.get('/about', (req, res) => {
    res.render('about');
});

// BUYER
app.get('/buyer', async (req, res) => {
    try {
        const categories = await Category.find();

        res.render('buyer', { categories });

    } catch (err) {
        console.log("Buyer Error:", err);
        res.render('buyer', { categories: [] });
    }
});


// ===== QUICK REGISTER =====
app.get('/join-free', (req, res) => {
    res.render('join-free');
});

app.post('/api/quick-register', async (req, res) => {
    try {
        if (!req.body.mobile) {
            return res.status(400).send("Mobile number required");
        }

        await QuickRegistration.create({ mobile: req.body.mobile });

        res.redirect('/join-free?success=true');

    } catch (err) {
        console.log("Quick Reg Error:", err);
        res.status(500).send("Server Error");
    }
});


// ===== ADMIN =====
app.get('/admin', async (req, res) => {
    try {
        const inquiries = await Inquiry.find().sort({ createdAt: -1 });
        const categories = await Category.find().sort({ createdAt: -1 });

        res.render('admin-panel/Dashboard', { inquiries, categories });

    } catch (err) {
        console.log(err);
        res.status(500).send("Admin load error");
    }
});

app.get('/admin/buyer-inquiries', async (req, res) => {
    try {
        const inquiries = await Requirement.find().sort({ createdAt: -1 });

        res.render('admin-panel/Buyer-Inquiries', { inquiries });

    } catch (err) {
        res.status(500).send("Error");
    }
});

app.get('/admin/sellers', async (req, res) => {
    try {
        const sellers = await Seller.find().sort({ createdAt: -1 });

        res.render('admin-panel/Sellers', { sellers });

    } catch (err) {
        res.status(500).send("Error");
    }
});

app.get('/admin/quick-registrations', async (req, res) => {
    try {
        const registrations = await QuickRegistration.find().sort({ createdAt: -1 });

        res.render('admin-panel/Quick-Registrations', { registrations });

    } catch (err) {
        res.status(500).send("Error");
    }
});


// ===== 404 HANDLER =====
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});


// ===== SERVER =====
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running: http://localhost:${PORT}`);
});
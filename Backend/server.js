// External modules import kar rahe hain
const express = require('express');
const mongoose = require('mongoose'); 
const path = require('path');
require('dotenv').config(); 

const app = express();

// ══════════ DATABASE CONNECTION ══════════
const dbURI = process.env.MONGO_URI || 'mongodb://localhost:27017/bhilwaratextile';

mongoose.connect(dbURI)
  .then(() => console.log('✅ Database Mast Connect Ho Gaya Hai!'))
  .catch((err) => console.log('❌ Database Connection Error:', err));


// ══════════ SETTINGS & MIDDLEWARE (YE UPAR HONA CHAHIYE) ══════════
app.set('views', path.join(__dirname, '../Frontend/views')); 
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '../Frontend/public')));

// 🔴 Form Data padhne ke liye zaroori middleware (Humesha routes se pehle!) 🔴 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ══════════ ROUTES IMPORTS & USAGE ══════════
const buyerRoutes = require('./routes/buyerRoutes'); 
const Category = require('./models/Category');
const Inquiry = require('./models/Inquiry');
const Requirement = require('./models/Requirement');

// Ab routes aayenge, kyunki data parse hone ke liye ready hai
app.use('/', buyerRoutes);
app.use('/api/category', require('./routes/category'));
app.use('/api/inquiry', require('./routes/inquiry'));


// ══════════ FRONTEND PAGE ROUTES (EJS) ══════════

// 1. Home Page Route 
app.get('/', async (req, res) => {
    try {
        const allCategories = await Category.find().sort({ createdAt: -1 });
        res.render('home', { 
            title: "Bhilwara Textile - Premium Quality",
            categories: allCategories 
        });
    } catch (error) {
        console.log("Home Page Error:", error);
        res.render('home', { 
            title: "Bhilwara Textile - Premium Quality", 
            categories: [] 
        });
    }
});

// 2. Fabrics Page
app.get('/fabrics', (req, res) => {
    res.render('fabrics', { title: 'Our Fabrics Collection' }); 
});

// 3. About Page
app.get('/about', (req, res) => {
    res.render('about', { title: 'Our Story - Bhilwara Textile' });
});


// ══════════ ADMIN PANEL ROUTE ══════════

app.get('/admin', async (req, res) => {
    try {
        const inquiries = await Inquiry.find().sort({ createdAt: -1 });
        const categories = await Category.find().sort({ createdAt: -1 });

        res.render('admin-panel/Dashboard', { 
            title: 'Admin Dashboard', 
            inquiries: inquiries, 
            categories: categories 
        });
    } catch (error) {
        console.log("Admin Panel Error:", error);
        res.status(500).send("Admin panel load nahi ho raha!");
    }
});

app.get('/admin/add-category', async (req, res) => {
    try {
        const allCategories = await Category.find().sort({ createdAt: -1 });
        res.render('admin-panel/add-category', { categories: allCategories });
    } catch (error) {
        console.log(error);
        res.status(500).send("Categories load nahi ho rahi hain!");
    }

});

// Route 2: Sirf Buyer Inquiries list dikhane ke liye (Isme solve ho gaya tera error)
// Tera Route
app.get('/admin/buyer-inquiries', async (req, res) => {
    try {
        // Yahan 'Inquiry' ki jagah 'Requirement' kar de
        const allInquiries = await Requirement.find().sort({ createdAt: -1 });
        
        res.render('admin-panel/Buyer-Inquiries', { 
            title: 'Buyer Inquiries List',
            inquiries: allInquiries // Ye upar wale EJS me jayega
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Data load nahi hua bhai!");
    }
});

// ══════════ SERVER START ══════════
const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
    console.log(`🚀 Bhilwara Textile Server running on: http://localhost:${PORT}`);
});
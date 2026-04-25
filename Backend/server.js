// External modules import kar rahe hain
const express = require('express');
const path = require('path');
const { title } = require('process');
const app = express();
// Dotenv: Port wagera secure rakhne ke liye
require('dotenv').config();

// --- PATH SETTINGS (Sabse Zaroori) ---
// Kyunki server.js 'Backend' folder mein hai aur views/public 'Frontend' mein
app.set('views', path.join(__dirname, '../Frontend/views')); // Views ka sahi rasta
app.set('view engine', 'ejs');

// Static Files: CSS aur Images 'Frontend/public' folder mein hain
app.use(express.static(path.join(__dirname, '../Frontend/public')));

// --- MIDDLEWARE ---
// Form Data read karne ke liye
app.use(express.urlencoded({ extended: true }));

// --- ROUTES ---

// Home Page Route
app.get('/', (req, res) => {
    res.render('home', { title: "Bhilwara Textile - Premium Quality" });
});

// Products Page Route
app.get('/fabrics', (req, res) => {
    res.render('fabrics', { title: 'Our Fabrics' }); 
});

//  about ka page 

app.get('/about', (req,res)=>
{
    res.render('about',{title:'Our Story'})
});


//  admin ka page 

app.get('/Dashboard', (req,res)=>
{
    res.render('admin-panel/dashboard',{title:'Our Dashboard'})
});



// Server Start karna
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Bhai server chal gaya hai: http://localhost:${PORT}`);
});
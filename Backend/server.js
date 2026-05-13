/**
 * ============================================================
 * PROJECT : BHILWARA TEXTILE - ELITE MANAGEMENT SYSTEM
 * AUTHOR  : PARIKSHIT MATHUR
 * VERSION : FINAL CLEAN STRUCTURE
 * ============================================================
 */

/* ============================================================
   [01] IMPORT REQUIRED MODULES
============================================================ */

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const app = express();

/* ============================================================
   [02] DATABASE CONNECTION
============================================================ */

const dbURI =
    process.env.MONGO_URI ||
    'mongodb://127.0.0.1:27017/bhilwaratextile';

mongoose
    .connect(dbURI)
    .then(() => {
        console.log('✅ MongoDB Connected Successfully');
    })
    .catch((err) => {
        console.log('❌ MongoDB Connection Error:', err);
    });

/* ============================================================
   [03] BASIC EXPRESS SETTINGS
============================================================ */

// View Engine
app.set('views', path.join(__dirname, '../Frontend/views'));
app.set('view engine', 'ejs');

// Static Files
app.use(express.static(path.join(__dirname, '../Frontend/public')));

// Form Handling
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookies
app.use(cookieParser());

/* ============================================================
   [04] GLOBAL VARIABLES
============================================================ */

app.use((req, res, next) => {

    res.locals.title = "Bhilwara Textile | Elite Marketplace";

    // Default User
    res.locals.user = null;

    next();
});

/* ============================================================
   [05] IMPORT DATABASE MODELS
============================================================ */

const SellerAdmin = require('./models/seller-admin-model');

const Category = require('./models/Category');

const Inquiry = require('./models/Inquiry');

const Requirement = require('./models/Requirement');

const QuickRegistration = require('./models/QuickRegistration');

const Product = require('./models/Product');

const HeroSlider = require('./models/HeroSlider');

const Testimonial = require('./models/Testimonial');

const FabricSlider = require('./models/FabricSlider');

const ContactInfo = require('./models/ContactInfo');

/* ============================================================
   [06] IMPORT ROUTES
============================================================ */

const fabricSliderRoutes = require('./routes/fabricSliderRoutes');

/* ============================================================
   [07] CUSTOM AUTH MIDDLEWARE
============================================================ */

// Seller Login Check
const isTxAuthenticated = (req, res, next) => {

    if (req.cookies && req.cookies.sellerId) {
        next();
    } else {
        res.redirect('/tx-login');
    }
};

/* ============================================================
   [08] MOUNT EXTERNAL ROUTES
============================================================ */

app.use('/', require('./routes/buyerRoutes'));

app.use('/', require('./routes/sellerRoutes'));

app.use('/', require('./routes/authRoutes'));

app.use('/', require('./routes/seller-admin-routes'));

app.use('/', require('./routes/admin-slider-routes'));


// Fabric Slider Routes
app.use('/admin/fabric-slider', fabricSliderRoutes);

// APIs
app.use('/api/category', require('./routes/category'));

app.use('/api/inquiry', require('./routes/inquiry'));

// ❌ YAHAN EK DUPLICATE SELLER ROUTE THA JO HATA DIYA HAI ❌

/* ============================================================
   [09] USER FRONTEND ROUTES
============================================================ */

/* =========================
   HOME PAGE
========================= */

app.get('/', async (req, res) => {

    try {

        // Fetch All Data Together
        const [
            slides,
            categories,
            testimonials
        ] = await Promise.all([

            HeroSlider.find()
                .sort({ slideNumber: 1 }),

            Category.find()
                .sort({ createdAt: -1 }),

            Testimonial.find()
                .sort({ createdAt: -1 })

        ]);

        res.render('user/home', {

            slides,
            categories,
            testimonials,

            title: "Bhilwara Textile | Home"

        });

    } catch (err) {

        console.error("❌ Home Page Error:", err);

        res.render('user/home', {

            slides: [],
            categories: [],
            testimonials: [],

            title: "Bhilwara Textile | Home"

        });
    }
});

/* =========================
   FABRICS PAGE
========================= */

app.get('/fabrics', async (req, res) => {

    try {

        const slides = await FabricSlider.find();

        res.render('user/fabrics', {

            slides: slides || [],

            title: "Fabrics | Bhilwara Textile"

        });

    } catch (err) {

        console.error("❌ Fabrics Page Error:", err);

        res.render('user/fabrics', {

            slides: [],

            title: "Fabrics"

        });
    }
});

/* =========================
   ALL CATEGORIES PAGE
========================= */

app.get('/all-categories', async (req, res) => {

    try {

        const categories = await Category.find()
            .sort({ createdAt: -1 });

        res.render('user/all-categrou', {

            categories,

            title: "All Categories | Bhilwara Textile"

        });

    } catch (err) {

        console.error("❌ Categories Error:", err);

        res.redirect('/');
    }
});

/* =========================
   CATEGORY DETAILS PAGE
========================= */

app.get('/category/:catName', async (req, res) => {

    try {

        const categoryName =
            decodeURIComponent(req.params.catName);

        // Find Category
        const categoryData = await Category.findOne({

            name: categoryName

        }).lean();

        // Not Found
        if (!categoryData) {

            return res
                .status(404)
                .send("Category Not Found");
        }

        // Products
        const productsList = await Product.find({

            category: categoryData._id

        })
            .populate('sellerId')
            .lean();

        // Add Products
        categoryData.products = productsList;

        // Render
        res.render('user/category-details', {

            category: categoryData

        });

    } catch (err) {

        console.error(err);

        res.redirect('/');
    }
});

/* =========================
   PRODUCTS PAGE
========================= */

app.get('/products', (req, res) => {

    res.render('user/products');
});

/* =========================
   ABOUT PAGE
========================= */

app.get('/about', (req, res) => {

    res.render('user/about');
});

/* =========================
   BECOME SELLER PAGE
========================= */

app.get('/become-seller', (req, res) => {

    res.render('user/become-seller');
});

/* =========================
   BUYER PAGE
========================= */

app.get('/buyer', async (req, res) => {

    try {

        const categories = await Category.find();

        res.render('user/buyer', {

            categories

        });

    } catch (err) {

        res.render('user/buyer', {

            categories: []

        });
    }
});



// ============================================================
// BUYER INQUIRIES PAGE
// ============================================================

app.get('/admin/buyer-inquiries', async (req, res) => {

    try {

        // FETCH ALL INQUIRIES
        const inquiries = await Requirement.find()
            .sort({ createdAt: -1 });

        // RENDER PAGE
        res.render('admin-panel/buyer-inquiries', {

            inquiries,

            title: "Buyer Inquiries"

        });

    } catch (err) {

        console.log("❌ Buyer Inquiry Error:", err);

        res.status(500).send("Error loading inquiries");
    }
});

// 🏠 MAIN ADMIN DASHBOARD (Dynamic Authority)
app.get('/admin/dashboard', async (req, res) => {
    try {
        // Ek saath saara data fetch karo performance ke liye
        const [sellerCount, productCount, inquiryCount, quickCount, recentInquiries] = await Promise.all([
            SellerAdmin.countDocuments(),
            Product.countDocuments(),
            Requirement.countDocuments(),
            QuickRegistration.countDocuments(),
            Requirement.find().sort({ createdAt: -1 }).limit(5) // Sirf top 5 dikhayenge
        ]);

        res.render('admin-panel/dashboard', {
            title: "Central Authority",
            stats: {
                sellers: sellerCount,
                products: productCount,
                inquiries: inquiryCount,
                leads: quickCount
            },
            recentInquiries: recentInquiries
        });
    } catch (err) {
        console.error("❌ Dashboard Data Error:", err);
        res.redirect('/admin/login');
    }
});





/* ============================================================
   [10] USER AUTH PAGES
============================================================ */

app.get('/join-free', (req, res) => {

    res.render('user/join-free');
});

app.get('/login', (req, res) => {

    res.render('user/login');
});

app.get('/register', (req, res) => {

    res.render('user/register');
});

app.get('/forgot-password', (req, res) => {

    res.render('user/forgot-password');
});

app.get('/reset-password', (req, res) => {

    res.render('user/reset-password');
});

/* ============================================================
   [11] VERIFIED SELLERS
============================================================ */

// Verified Sellers Page
app.get('/verified-sellers', (req, res) => {

    res.render('user/verified-sellers', {

        title: "Verified Partners | Bhilwara Textile"

    });
});

// Approved Sellers API
app.get('/api/merchants/list', async (req, res) => {

    try {

        const sellers = await SellerAdmin.find({

            status: 'Approved'

        })
            .select('-password')
            .sort({ companyName: 1 });

        res.json(sellers);

    } catch (err) {

        res.status(500).json({

            error: "Failed to load directory"

        });
    }
});

/* =========================
   SINGLE MERCHANT PROFILE
========================= */

app.get('/merchant/:id', async (req, res) => {

    try {

        const { id } = req.params;

        // Merchant Data
        const merchant =
            await SellerAdmin.findById(id)
                .select('-password')
                .lean();

        // Not Found
        if (!merchant) {

            return res.status(404).render('user/404', {

                title: "Merchant Not Found"

            });
        }

        // Merchant Products
        const products = await Product.find({

            sellerId: id

        })
            .sort({ createdAt: -1 })
            .lean();

        // Render
        res.render('user/merchant-profile', {

            title: merchant.companyName + " | Profile",

            merchant,

            products
        });

    } catch (err) {

        console.error(err);

        res.redirect('/verified-sellers');
    }
});

/* ============================================================
   [12] CONTACT PAGE
============================================================ */

// Contact Page
app.get('/contact', async (req, res) => {

    try {

        const info =
            await ContactInfo.findOne() || {

                address: "Bhilwara, Rajasthan",

                email: "admin@bhilwaratextile.com",

                phone: "+91 00000-00000"
            };

        res.render('user/contact', {

            info,

            title: "Contact Us | Bhilwara Textile"

        });

    } catch (err) {

        console.error("Contact Page Error:", err);

        res.status(500).send("Error loading page");
    }
});

/* =========================
   CONTACT FORM SUBMIT
========================= */

app.post('/api/contact/submit', async (req, res) => {

    try {

        const {
            name,
            email,
            subject,
            message
        } = req.body;

        await Requirement.create({

            name,

            email,

            message:
                `[CONTACT FORM] Subject: ${subject} | Message: ${message}`,

            mobile: "Not Provided"

        });

        res.redirect('/contact?success=true');

    } catch (err) {

        console.error(err);

        res.redirect('/contact?error=failed');
    }
});

/* ============================================================
   [13] SELLER DASHBOARD
============================================================ */

app.get('/tx-dashboard', isTxAuthenticated, async (req, res) => {
    try {
        const sellerId = req.cookies.sellerId;

        // 1. Seller ka poora data uthao
        const userData = await SellerAdmin.findById(sellerId);

        // 2. Us seller ke total products count karo
        const productCount = await Product.countDocuments({ sellerId: sellerId });

        // 3. Us seller ke liye recent business inquiries/leads uthao
        // Note: Hum Requirement model mein seller-specific filter laga rahe hain agar applicable ho
        const recentLeads = await Requirement.find({ 
            $or: [{ category: { $in: userData.businessCategories } }, { companyName: "Direct Contact" }] 
        }).sort({ createdAt: -1 }).limit(5);

        res.render('seller-admin/tx-dashboard', { 
            user: userData,
            stats: {
                totalProducts: productCount,
                leadsCount: recentLeads.length
            },
            recentLeads: recentLeads
        });
    } catch (err) {
        console.error("❌ Seller Dashboard Error:", err);
        res.redirect('/tx-login');
    }
});

// ❌ YAHAN JO CONFLICTING PROFILE UPDATE ROUTE THA, WO HATA DIYA HAI ❌
// (Kyunki wo sellerRoutes.js mein Multer ke saath already handle ho raha hai)

/* ============================================================
   [14] ADMIN PANEL ROUTES
============================================================ */

/* =========================
   SELLER REQUESTS
========================= */

app.get('/admin/seller-requests', async (req, res) => {

    res.render('admin-panel/Seller-Requests');
});

// Seller Data API
app.get('/admin/seller-requests/data',
    async (req, res) => {

        try {

            const data =
                await SellerAdmin.find()
                    .sort({ createdAt: -1 });

            res.json(data);

        } catch (e) {

            res.status(500).json({

                error: 'failed'

            });
        }
    });

/* =========================
   UPDATE SELLER STATUS
========================= */

app.post('/api/seller/update-status/:id',
    async (req, res) => {

        try {

            const { id } = req.params;

            const { status } = req.body;

            // Check ID
            if (!mongoose.Types.ObjectId.isValid(id)) {

                return res.status(400).json({

                    success: false,

                    message: 'Invalid ID Format'

                });
            }

            // Update Status
            const updatedSeller =
                await SellerAdmin.findByIdAndUpdate(

                    id,

                    { status },

                    { new: true }

                );

            // Not Found
            if (!updatedSeller) {

                return res.status(404).json({

                    success: false,

                    message: 'Seller not found'

                });
            }

            res.json({

                success: true,

                message: 'Seller Status Updated'

            });

        } catch (error) {

            console.error("❌ Status Update Error:", error);

            res.status(500).json({

                success: false,

                message: error.message

            });
        }
    });

/* ============================================================
   [15] PRODUCTS MANAGEMENT
============================================================ */

// Products Page
app.get('/admin/all-products',
    (req, res) => {

        res.render('admin-panel/All-Products');
    });

// Products API
app.get('/api/admin/all-products',
    async (req, res) => {

        try {

            const products = await Product.find()

                .populate('sellerId', 'companyName city')

                .sort({ createdAt: -1 });

            res.json(products);

        } catch (err) {

            res.status(500).json({

                error: err.message

            });
        }
    });

/* =========================
   DELETE PRODUCT
========================= */

app.post('/api/admin/delete-product/:id',
    async (req, res) => {

        try {

            await Product.findByIdAndDelete(req.params.id);

            res.json({

                success: true,

                message: "Product Removed"

            });

        } catch (err) {

            res.status(500).json({

                error: "Failed"

            });
        }
    });

/* ============================================================
   [16] ADD CATEGORY PANEL
============================================================ */

app.get('/admin/add-category',
    async (req, res) => {

        try {

            const categories =
                await Category.find()
                    .sort({ createdAt: -1 });

            res.render('admin-panel/add-category', {

                categories,

                title:
                    "Manage Categories | Admin Authority"

            });

        } catch (err) {

            console.error("❌ Category Error:", err);

            res.render('admin-panel/add-category', {

                categories: [],

                title: "Error"

            });
        }
    });

/* ============================================================
   [17] QUICK REGISTRATIONS
============================================================ */

app.get('/admin/quick-registrations',
    async (req, res) => {

        try {

            const registrations =
                await QuickRegistration.find()
                    .sort({ createdAt: -1 });

            res.render(
                'admin-panel/Quick-Registrations',

                { registrations }
            );

        } catch (err) {

            res.status(500).send("Error");
        }
    });

/* ============================================================
   [18] HERO SLIDER MANAGEMENT
============================================================ */

app.get('/admin/admin-add-silder',
    async (req, res) => {

        try {

            const slides =
                await HeroSlider.find()
                    .sort({ slideNumber: 1 });

            res.render(
                'admin-panel/admin-add-silder',

                {

                    slides,

                    title: 'Manage Hero Slider'

                }
            );

        } catch (err) {

            res.status(500).send("Slider Error");
        }
    });

/* ============================================================
   [19] TESTIMONIAL MANAGEMENT
============================================================ */

// Manage Testimonials Page
app.get('/admin/testimonials',
    async (req, res) => {

        try {

            const list =
                await Testimonial.find()
                    .sort({ createdAt: -1 });

            res.render(
                'admin-panel/manage-testimonials',

                {

                    title:
                        "Manage Testimonials | Bhilwara Textile",

                    list
                }
            );

        } catch (error) {

            console.error(error);

            res.status(500).send("Server Error");
        }
    });

/* =========================
   ADD TESTIMONIAL
========================= */

app.post('/api/admin/add-testimonial',
    async (req, res) => {

        try {

            const {
                description,
                name,
                rating
            } = req.body;

            // Validation
            if (!description || !name) {

                return res.status(400)
                    .send("Description & Name required");
            }

            await Testimonial.create({

                description,

                name,

                rating: rating || 5
            });

            console.log("✅ Testimonial Added");

            res.redirect('/admin/testimonials');

        } catch (error) {

            console.error(error);

            res.status(500).send("Error Saving");
        }
    });

/* =========================
   DELETE TESTIMONIAL
========================= */

app.get('/admin/delete-testimonial/:id',
    async (req, res) => {

        try {

            await Testimonial.findByIdAndDelete(
                req.params.id
            );

            console.log("🗑️ Testimonial Deleted");

            res.redirect('/admin/testimonials');

        } catch (error) {

            console.error(error);

            res.status(500).send("Delete Failed");
        }
    });

/* ============================================================
   [20] CONTACT ADMIN PANEL
============================================================ */

// Contact Details Page
app.get('/admin/contact-details',
    async (req, res) => {

        try {

            const allInquiries =
                await Requirement.find()
                    .sort({ createdAt: -1 });

            const info =
                await ContactInfo.findOne() || {};

            res.render(
                'admin-panel/contact-details',

                {

                    info,

                    inquiries: allInquiries,

                    title: "Contact Authority"
                }
            );

        } catch (err) {

            res.status(500)
                .send("Error fetching details");
        }
    });

/* =========================
   UPDATE CONTACT DETAILS
========================= */

app.post('/admin/contact-details/update',
    async (req, res) => {

        try {

            const {
                address,
                email,
                phone,
                mapEmbedUrl
            } = req.body;

            let info =
                await ContactInfo.findOne();

            if (info) {

                await ContactInfo.findOneAndUpdate(
                    {},

                    {
                        address,
                        email,
                        phone,
                        mapEmbedUrl
                    }
                );

            } else {

                await ContactInfo.create({

                    address,
                    email,
                    phone,
                    mapEmbedUrl
                });
            }

            res.redirect(
                '/admin/contact-details?success=true'
            );

        } catch (err) {

            res.status(500)
                .send("Update Failed");
        }
    });

/* ============================================================
   [21] QUICK REGISTER API
============================================================ */

app.post('/api/quick-register',
    async (req, res) => {

        try {

            if (!req.body.mobile) {

                return res
                    .status(400)
                    .send("Mobile Required");
            }

            await QuickRegistration.create({

                mobile: req.body.mobile

            });

            res.redirect('/join-free?success=true');

        } catch (err) {

            res.status(500).send("Error");
        }
    });

/* ============================================================
   [22] 404 PAGE
============================================================ */

app.use((req, res) => {

    res.status(404).render('user/404', {

        title: "404 - Not Found"
    });
});

/* ============================================================
   [23] START SERVER
============================================================ */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`

====================================================
🚀 SERVER ACTIVE : http://localhost:${PORT}
🏠 ENVIRONMENT   : Development
📦 DATABASE      : MongoDB Bhilwara Textile
====================================================

`);
});
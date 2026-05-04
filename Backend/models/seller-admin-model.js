const mongoose = require('mongoose');

const sellerAdminSchema = new mongoose.Schema({

    // 🔐 Auth
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // 🏢 Company Profile
    companyName: String,
    shortName: String,
    ownerName: String,
    mobile: String,
    address: String,
    city: String,
    state: String,
    description: String,
    logo: String,

    // ✅ Verification
    isVerified: { type: Boolean, default: false },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    }

}, { timestamps: true });

module.exports = mongoose.model('SellerAdmin', sellerAdminSchema);
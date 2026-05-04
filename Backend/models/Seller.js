const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    contactPerson: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    city: { type: String, required: true },
    businessType: { type: String, required: true },
    fabrics: { type: [String], default: [] },
    address: { type: String, required: true },

    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'Hold'], // ✅ HOLD added
        default: 'Pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Seller', sellerSchema);
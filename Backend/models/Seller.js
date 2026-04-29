const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    contactPerson: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    city: { type: String, required: true },
    businessType: { type: String, required: true } // e.g., Manufacturer, Wholesaler
}, { timestamps: true });

module.exports = mongoose.model('Seller', sellerSchema);
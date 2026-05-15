const mongoose = require('mongoose');

// Naya schema sirf B2B Seller Inquiries ke liye
const sellerLeadSchema = new mongoose.Schema({
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'SellerAdmin' },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    sellerCompany: { type: String }, // Jis company ke paas lead aayi hai
    productName: { type: String, required: true }, // Jis product ke liye aayi hai
    
    // Buyer ki details
    buyerName: { type: String, required: true },
    buyerPhone: { type: String, required: true },
    message: { type: String, required: true },
    
    status: { type: String, default: 'Unread' }
}, { timestamps: true });

module.exports = mongoose.model('SellerLead', sellerLeadSchema);
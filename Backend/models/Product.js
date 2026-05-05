const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'SellerAdmin', required: true },
    category: { type: String, required: true }, // Dynamic Category from Admin
    productName: { type: String, required: true },
    fabricImage: { type: String }, 
    fabricType: { type: String }, // e.g., Cotton, Silk, Denim
    bulkStock: { type: Number, default: 0 }, // Meters ya KG mein stock
    pricePerUnit: { type: Number },
    description: { type: String },
    status: { type: String, default: 'In-Stock' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
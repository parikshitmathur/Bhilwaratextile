const mongoose = require('mongoose');

const contactInfoSchema = new mongoose.Schema({
    address: { type: String, default: "Bhilwara, Rajasthan, India" },
    email: { type: String, default: "contact@bhilwaratextile.com" },
    phone: { type: String, default: "+91 98765-43210" },
    mapEmbedUrl: { type: String, default: "https://www.google.com/maps/embed?..." }
}, { timestamps: true });

module.exports = mongoose.model('ContactInfo', contactInfoSchema);
const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
    description: { type: String, required: true }, // Review ka text
    name: { type: String, required: true },        // Client ka naam
    rating: { type: Number, default: 5 },          // Star rating (1-5)
    status: { type: String, default: 'Active' }    // Taaki admin control rahe
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);
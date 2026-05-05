const mongoose = require('mongoose');

const HeroSliderSchema = new mongoose.Schema({
    slideNumber: { type: Number, required: true, unique: true }, // 1, 2, ya 3
    imagePath: { type: String, required: true },
    title: { type: String },
    subtitle: { type: String },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('HeroSlider', HeroSliderSchema);
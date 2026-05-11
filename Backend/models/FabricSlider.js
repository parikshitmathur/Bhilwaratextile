const mongoose = require('mongoose');

const fabricSliderSchema = new mongoose.Schema({
    tagline: String,
    titleMain: String,
    titleGold: String,
    description: String,
    stat1_value: String,
    stat1_label: String,
    stat2_value: String,
    stat2_label: String,
    badgeText: String,
    imageURL: String
});

module.exports = mongoose.model('FabricSlider', fabricSliderSchema);
const mongoose = require('mongoose');

const quickRegSchema = new mongoose.Schema({
    mobile: { 
        type: String, 
        required: true 
    },
    status: {
        type: String,
        default: 'Pending' // Pending, Contacted, Converted
    }
}, { timestamps: true });

module.exports = mongoose.model('QuickRegistration', quickRegSchema);
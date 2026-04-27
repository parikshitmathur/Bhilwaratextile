const mongoose = require('mongoose');

// Schema (Table Structure)
const requirementSchema = new mongoose.Schema({
    companyName: { 
        type: String, 
        required: true,
        trim: true 
    },
    mobile: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true,
        lowercase: true 
    },
    category: { 
        type: String, 
        required: true 
    },
    quantity: { 
        type: Number, 
        required: true,
        min: 1 
    },
    submittedAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Exporting the Model
module.exports = mongoose.model('Requirement', requirementSchema);
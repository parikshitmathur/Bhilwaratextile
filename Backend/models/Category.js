// models/Category.js

const mongoose = require('mongoose'); // <--- Yeh line check karo, 'mongoose' define hona chahiye

const categorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true 
  },
  description: { 
    type: String 
  },
  image: { 
    type: String 
  },
  subcategories: [{
    type: String,
    trim: true
  }],
  // Agar Step 1 follow kar rahe ho toh ye add karna:
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
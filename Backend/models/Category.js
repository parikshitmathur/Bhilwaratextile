// models/Category.js

const mongoose = require('mongoose');

// Schema: Yeh database ko batata hai ki data kaisa dikhega
const categorySchema = new mongoose.Schema({
  
  // Category ka naam (e.g., "Cotton Suitings")
  name: { 
    type: String, 
    required: true, // Yeh field khali nahi chhod sakte
    unique: true    // Ek naam ki 2 category nahi ban sakti
  },
  
  // Category ki thodi details (e.g., "Best for summer wear")
  description: { 
    type: String 
  },
// 📸 NAYA FIELD: Image ka path save karne ke liye
  image: { 
    type: String 
  }


}, { timestamps: true }); // timestamps se 'kab bani' aur 'kab update hui' apne aap save ho jayega

// Is model ko export kar rahe hain taaki routes mein use kar sakein
module.exports = mongoose.model('Category', categorySchema);
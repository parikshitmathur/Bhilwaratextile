// models/Inquiry.js

const mongoose = require('mongoose');

// Schema: Yeh database ko batata hai ki Inquiry ka data kaisa dikhega
const inquirySchema = new mongoose.Schema({
  
  // 1. Customer ka naam
  clientName: { 
    type: String, 
    required: true // Yeh likhna zaroori hai, iske bina form submit nahi hoga
  },
  
  // 2. Customer ka mobile number (Call karne ke liye)
  phone: { 
    type: String, 
    required: true 
  },
  
  // 3. Email (Optional rakha hai, agar customer ke paas na ho toh bhi chalega)
  email: { 
    type: String 
  },
  
  // 4. Customer ne kaunsa kapda pucha hai (e.g., "Premium Shirting")
  fabricName: { 
    type: String, 
    required: true 
  },
  
  // 5. Kitna maal chahiye (e.g., "500 meters")
  quantity: { 
    type: String 
  },
  
  // 6. Deal kahan tak pahnchi? (Admin apne dashboard se ise change karega)
  status: { 
    type: String, 
    enum: ['Pending', 'Reviewed', 'Completed'], // Sirf in teeno mein se ek ho sakta hai
    default: 'Pending' // Jaise hi nayi inquiry aayegi, woh automatically 'Pending' set ho jayegi
  },
  
  // 7. Inquiry kis baare mein hai? (Bulk order ya sirf Sample chahiye)
  type: { 
    type: String, 
    enum: ['Bulk Enquiry', 'Sample Request'], 
    default: 'Bulk Enquiry' 
  }

}, { timestamps: true }); // timestamps se 'kis din aur kis time' inquiry aayi, woh apne aap save ho jayega

// Is model ko export kar rahe hain taaki isko baaki jagah (routes mein) use kar sakein
module.exports = mongoose.model('Inquiry', inquirySchema);
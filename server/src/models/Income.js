const mongoose = require('mongoose');

// Define the Income Schema
const incomeSchema = new mongoose.Schema({
  user: { // Reference to the user who created the income
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // This should match the name of your user model
    required: true,
  },
  description: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
},
{ 
  collection: "income"
});

// Create the Income model
const Income = mongoose.model('Income', incomeSchema);

module.exports = Income;

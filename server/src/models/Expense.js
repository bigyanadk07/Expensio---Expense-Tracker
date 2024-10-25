const mongoose = require('mongoose');

// Define the Expense Schema
const expenseSchema = new mongoose.Schema({
  user: { // Reference to the user who created the expense
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
  }
}, 
{ 
  collection: 'expense'
});

// Create the Expense model
const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;

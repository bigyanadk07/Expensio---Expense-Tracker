const mongoose = require('mongoose');

// Define the Expense Schema
const expenseSchema = new mongoose.Schema({
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
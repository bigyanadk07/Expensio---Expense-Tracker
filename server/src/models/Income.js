// src/models/Income.js
const mongoose = require('mongoose');

// Define the Income Schema
const incomeSchema = new mongoose.Schema({
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
  collection :"income"
});

// Create the Income model
const Income = mongoose.model('Income', incomeSchema);

module.exports = Income;

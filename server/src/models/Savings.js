// src/models/Savings.js
const mongoose = require('mongoose');

// Define the Savings Schema
const savingsSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

// Create the Savings model
const Savings = mongoose.model('Savings', savingsSchema);

module.exports = Savings;

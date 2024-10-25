const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  user: { // Reference to the user who created the budget
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Ensure this matches the name of your user model
    required: true,
  },
  category: {
    type: String,
    required: true,
    unique: true
  },
  limit: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Budget', budgetSchema);

const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');

// Get all budgets
router.get('/', async (req, res) => {
  try {
    const budgets = await Budget.find();
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new budget
router.post('/', async (req, res) => {
  const budget = new Budget({
    category: req.body.category,
    limit: req.body.limit
  });

  try {
    const newBudget = await budget.save();
    res.status(201).json(newBudget);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a budget
router.delete('/:id', async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    await Budget.findByIdAndDelete(req.params.id);
    res.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid budget ID format' });
    }
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
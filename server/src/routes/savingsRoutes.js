// src/routes/savingsRoutes.js
const express = require('express');
const router = express.Router();
const Savings = require('../models/Savings'); // Ensure you create the Savings model below

// @route   GET /api/savings
// @desc    Get all savings entries
router.get('/', async (req, res) => {
  try {
    const savings = await Savings.find();
    res.json(savings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/savings
// @desc    Add a new savings entry
router.post('/', async (req, res) => {
  const { amount, date, description } = req.body;

  const newSavings = new Savings({
    amount,
    date,
    description
  });

  try {
    const savedSavings = await newSavings.save();
    res.status(201).json(savedSavings);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route   DELETE /api/savings/:id
// @desc    Delete a savings entry by ID
router.delete('/:id', async (req, res) => {
  try {
    const savings = await Savings.findById(req.params.id);
    if (!savings) return res.status(404).json({ message: 'Savings not found' });

    await savings.remove();
    res.json({ message: 'Savings removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

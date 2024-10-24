// src/routes/incomeRoutes.js
const express = require('express');
const router = express.Router();
const Income = require('../models/Income');

router.get('/', async (req, res) => {
  try {
    const incomes = await Income.find();
    res.json(incomes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const { description, amount, date, category } = req.body;

  const newIncome = new Income({
    description,
    amount,
    date,
    category
  });

  try {
    const savedIncome = await newIncome.save();
    res.status(201).json(savedIncome);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const income = await Income.findByIdAndDelete(req.params.id);
    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
    }
    res.json({ message: 'Income removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



router.put('/:id', async (req, res) => {
  try {
    const { description, amount, date, category } = req.body;
    
    const updatedIncome = await Income.findByIdAndUpdate(
      req.params.id,
      {
        description,
        amount,
        date,
        category
      },
      { new: true } // This option returns the updated document
    );

    if (!updatedIncome) {
      return res.status(404).json({ message: 'Income not found' });
    }

    res.json(updatedIncome);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

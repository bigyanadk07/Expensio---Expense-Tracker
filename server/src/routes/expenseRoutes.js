// routes/expenseRoutes.js
const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// Change from '/expenses' to '/'
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Change from '/expenses' to '/'
router.post('/', async (req, res) => {
  const { description, amount, date, category } = req.body;
  
  const newExpense = new Expense({
    description,
    amount,
    date,
    category
  });

  try {
    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Change from '/expenses/:id' to '/:id'
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    await expense.deleteOne(); // Change remove() to deleteOne()
    res.json({ message: 'Expense removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { description, amount, date, category } = req.body;
    
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      {
        description,
        amount,
        date,
        category
      },
      { new: true } // This option returns the updated document
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json(updatedExpense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
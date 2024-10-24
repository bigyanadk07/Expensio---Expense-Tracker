// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const expenseRoutes = require('./src/routes/expenseRoutes');
const incomeRoutes = require('./src/routes/incomeRoutes');
const savingsRoutes = require('./src/routes/savingsRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB with error handling
mongoose.connect('mongodb://localhost:27017/Expensetracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => {
  console.error('Could not connect to MongoDB...', err);
  process.exit(1); // Exit if cannot connect to database
});

// Routes
app.use('/expense', expenseRoutes);
app.use('/income', incomeRoutes);
app.use('/savings', savingsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
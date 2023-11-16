// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Transaction = require('./models/transaction');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost/money_tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.get('/', async (req, res) => {
  const transactions = await Transaction.find().sort({ date: 'desc' });
  res.render('index', { transactions });
});

app.post('/addTransaction', async (req, res) => {
  const { description, amount, type } = req.body;
  const newTransaction = new Transaction({ description, amount, type });

  try {
    await newTransaction.save();
    res.redirect('/');
  } catch (error) {
    res.send('Error saving transaction');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

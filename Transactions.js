const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  description: String,
  amount: Number,
  type: { type: String, enum: ['credit', 'debit'] },
  category: String
});

module.exports = mongoose.model('Transactions', transactionSchema);

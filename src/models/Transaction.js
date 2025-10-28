const mongoose = require('mongoose');
const Counter = require('../models/Counter');

const transactionSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  _id: String,
  description: String,
  accountId: String,
  amount: Number,
  type: { type: String, enum: ['credit', 'debit'] },
  category: String
});

transactionSchema.pre('save', async function(next) {
  const doc = this;
  
  if (!doc.isNew) return next();

  const counter = await Counter.findByIdAndUpdate(
    { _id: 'transactionId' }, 
    { $inc: { seq: 1 } }, 
    { new: true, upsert: true }
  );

  const seqNumber = String(counter.seq).padStart(3, '0');
  doc._id = `txn_${seqNumber}`;
  
  next();
});

module.exports = mongoose.model('Transaction', transactionSchema);

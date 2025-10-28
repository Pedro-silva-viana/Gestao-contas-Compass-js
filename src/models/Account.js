const mongoose = require('mongoose');
const Counter = require('../models/Counter');

const accountSchema = new mongoose.Schema({
  type: { type: String, enum: ['checking', 'savings'] },
  _id: String,
  branch: String,
  number: {type: String, unique: true, 
    validate: {
      validator: Number.isInteger,
      message: 'The balance must be a whole number (in cents).'
    }
  },
  open_f: {type: Boolean, default: false},
  customerId: String,
  balance: { type: Number, default: 0 },
  transactions: [{ type: String, ref: 'Transaction' }]
});

accountSchema.pre('save', async function(next) {
  const doc = this;
  
  if (!doc.isNew) return next();

  const counter = await Counter.findByIdAndUpdate(
    { _id: 'accountId' }, 
    { $inc: { seq: 1 } }, 
    { new: true, upsert: true }
  );

  const seqNumber = String(counter.seq).padStart(3, '0');
  doc._id = `acc_${seqNumber}`;
  
  next();
});

module.exports = mongoose.model('Account', accountSchema);
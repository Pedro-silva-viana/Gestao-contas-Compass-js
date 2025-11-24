const mongoose = require('mongoose');
const Counter = require('../models/Counter');

const customerSchema = new mongoose.Schema({
  _id: String,
  name: { type: String, 
    required: [true, 'Name is mandatory'],
    maxlength: [50, 'Very long name'],
    minlength: [2, 'Very short name'],
    match: [/^[a-zA-Z\s]+$/, 'Name can`t contain numbers or special characters'],
    validate: {
    validator: function(v) {
      return v && v.trim().length > 0; 
    },
    message: 'Name is mandatory'
  }
  },
  cnpj: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/^\d{14}$/, 'CNPJ must have 14 digits (numbers only)']
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email']
  },
  accounts: [{ type: String, ref: 'Account' }]
});

customerSchema.pre('save', async function(next) {
  const doc = this;
  
  if (!doc.isNew) return next();

  const counter = await Counter.findByIdAndUpdate(
    { _id: 'customerId' }, 
    { $inc: { seq: 1 } }, 
    { new: true, upsert: true }
  );

  const seqNumber = String(counter.seq).padStart(3, '0');
  doc._id = `cus_${seqNumber}`;
  
  next();
});

module.exports = mongoose.model('Customer', customerSchema);
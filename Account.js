const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  _id: String,
  type: { type: String, enum: ['checking', 'savings'] },
  branch: String,
  number: String,
  balance: { type: Number, default: 0 },
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }]
});

module.exports = mongoose.model('Account', accountSchema);
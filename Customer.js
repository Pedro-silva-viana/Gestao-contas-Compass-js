const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  _id: String,
  name: String,
  cpf: String,
  email: String,
  accounts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }]
});

module.exports = mongoose.model('Customer', customerSchema);
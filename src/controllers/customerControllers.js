const Customer = require('../models/Customer');
const Account = require('../models/Account');

exports.createCustomer = async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json(customer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.customerId);
    if (!customer) return res.status(404).json({ error: 'Custumer not found' });
      res.json(customer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getCustomerbyCnpj = async (req, res) => {
  try {
    const customer = await Customer.findOne({ cnpj: req.params.cnpj });
    if (!customer) return res.status(404).json({ error: 'Custumer not found' });
      res.json(customer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
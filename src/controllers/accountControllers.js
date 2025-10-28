const Customer = require('../models/Customer');
const Account = require('../models/Account');

exports.createAccount = async (req, res) => {
  try {
    const customerId = req.body.customerId;
    const customer = await Customer.findById(customerId);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    const account = new Account({ ...req.body, customer: customerId });
    await account.save();

    customer.accounts.push(account._id);
    await customer.save();

    res.status(201).json(account);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getBalance = async (req, res) => {
  try {
    const account = await Account.findById(req.params.accountId);
    if (!account) return res.status(404).json({ error: 'Account not found' });
    res.json({ balance: account.balance });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }

};

exports.putOpen = async (req, res) => {
  try {
    const { accountId } = req.params;
    const { open_f } = req.body;

    if (typeof open_f !== 'boolean') {
      return res.status(400).json({ error: 'The open_f field must be boolean (true or false).' });
    }

    const account = await Account.findByIdAndUpdate(
      accountId,
      { open_f },
      { new: true, runValidators: true }
    );

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    res.json({ message: 'Account status updated successfully.', account });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

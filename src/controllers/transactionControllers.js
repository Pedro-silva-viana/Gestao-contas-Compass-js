const Transaction = require('../models/Transaction');
const Account = require('../models/Account');

exports.createTransaction = async (req, res) => {
  try {
    const accountId = req.body.accountId;
    const data = req.body;

    const account = await Account.findById(accountId);
    if (!account) return res.status(404).json({ error: 'Account not found' });

    if (!['credit', 'debit'].includes(data.type))
      return res.status(400).json({ error: 'Invalid type' });
    if (data.amount <= 0)
      return res.status(400).json({ error: 'Amount must be positive' });
    if (data.type === 'debit' && account.balance < data.amount)
      return res.status(400).json({ error: 'Insufficient funds' });

    const transaction = new Transaction({ ...data, account: accountId });
    await transaction.save();

    account.balance += data.type === 'credit' ? data.amount : -data.amount;
    account.transactions.push(transaction._id);
    await account.save();

    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.listTransactions = async (req, res) => {
  try {
    const accountId = req.params.accountId;

    const account = await Account.findById(accountId).populate('transactions');
    if (!account) return res.status(404).json({ error: 'Account not found' });

    res.json({ transactions: account.transactions });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
const http = require('http');
const mongoose = require('mongoose');
require('dotenv').config();

const Customer = require('./Customer');
const Account = require('./Account');
const Transaction = require('./Transactions');
console.log("PORT:", process.env.PORT);
console.log("MONGO_URI:", process.env.MONGO_URI);

const MONGO_URI = process.env.MONGO_URI;

async function start(){
  await mongoose.connect(MONGO_URI);
  console.log('MongoDB conectado.');

  const server = http.createServer(async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const method = req.method;
    const url = req.url.split('?')[0];
    const parts = url.split('/').filter(Boolean);

    function readBody(){
      return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
          if (!body) return resolve({});
          try { resolve(JSON.parse(body)); }
          catch (e) { reject(new Error('Invalid JSON body')); }
        });
        req.on('error', reject);
      });
    }

    try {
      if (parts[0] === 'customers' && parts.length === 1 && method === 'POST') {
        const data = await readBody();
        const customer = new Customer(data);
        await customer.save();
        res.writeHead(201);
        res.end(JSON.stringify(customer));
        return;
      }

      if (parts[0] === 'customers' && parts[2] === 'accounts' && parts.length === 3 && method === 'POST') {
        const customerId = parts[1];
        const data = await readBody();
        const customer = await Customer.findById(customerId);
        if (!customer) { res.writeHead(404); res.end(JSON.stringify({ error: 'Customer not found' })); return; }

        data.customer = customerId;
        const account = new Account(data);
        await account.save();

        customer.accounts.push(account._id);
        await customer.save();

        res.writeHead(201);
        res.end(JSON.stringify(account));
        return;
      }

      if (parts[0] === 'accounts' && parts[2] === 'balance' && parts.length === 3 && method === 'GET'){
        const account = await Account.findById(parts[1]);
        if (!account) { res.writeHead(404); res.end(JSON.stringify({ error: 'Account not found' }));
         return; 
        }
        res.end(JSON.stringify({ balance: account.balance }));
        return;
      }

      if (parts[0] === 'accounts' && parts[2] === 'transactions' && parts.length === 3 && method === 'POST') {
        const accountId = parts[1];
        const data = await readBody();
        const account = await Account.findById(accountId);
        if (!account) { res.writeHead(404); res.end(JSON.stringify({ error: 'Account not found' })); return; }

        if (!data.type || !['credit','debit'].includes(data.type)) {
          res.writeHead(400); res.end(JSON.stringify({ error: 'type must be credit or debit' })); return;
        }
        if (typeof data.amount !== 'number' || data.amount <= 0) {
          res.writeHead(400); res.end(JSON.stringify({ error: 'amount must be a positive number' })); return;
        }
        if (data.type === 'debit' && account.balance < data.amount) {
          res.writeHead(400); res.end(JSON.stringify({ error: 'Insufficient funds' })); return;
        }

        data.account = accountId;
        const tx = new Transaction(data);
        await tx.save();

        account.balance += (data.type === 'credit' ? data.amount : -data.amount);
        account.transactions.push(tx._id);
        await account.save();

        res.writeHead(201);
        res.end(JSON.stringify(tx));
        return;
      }

      if (parts[0] === 'accounts' && parts[2] === 'transactions' && parts.length === 3 && method === 'GET') {
        const account = await Account.findById(parts[1]);
        if (!account) { res.writeHead(404); res.end(JSON.stringify({ error: 'Account not found' }));
         return; 
        }
        const transactions = await Transaction.find({
        _id: { $in: account.transactions }});
        res.end(JSON.stringify({ transactions }));
        return;
      }

      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Route not found' }));
    } catch (err) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: err.message }));
    }
  });

  const PORT = process.env.PORT;
  server.listen(PORT, () => console.log(`Server rodando na porta ${PORT}`));
}

start().catch(err => {
  console.error('Erro inicializando servidor:', err);
  process.exit(1);
});
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const customerRoutes = require('./src/routes/customers');
const accountRoutes = require('./src/routes/accounts');
const transactionRoutes = require('./src/routes/transactions');

const app = express();
app.use(express.json());

app.use('/customers', customerRoutes);
app.use('/accounts', accountRoutes);
app.use('/transactions', transactionRoutes);

app.get('/', (req, res) => res.send('API funcionando'));

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected.');

    const db = mongoose.connection.db;
    await db.collection('customers').createIndex({ cpf: 1 }, { unique: true });
    await db.collection('customers').createIndex({ email: 1 }, { unique: true });

    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

  } catch (err) {
    console.error('Error initializing server:', err);
    process.exit(1);
  }
}

start();
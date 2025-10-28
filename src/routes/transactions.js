const express = require('express');
const router = express.Router();
const { createTransaction, listTransactions } = require('../controllers/transactionControllers');

router.post('/', createTransaction);
router.get('/:accountId', listTransactions);

module.exports = router; 
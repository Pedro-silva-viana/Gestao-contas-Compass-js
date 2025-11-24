const express = require('express');
const router = express.Router();
const { createTransaction, listTransactions } = require('../controllers/transactionControllers');
const checkAccountOpen = require('../middleware/accountMiddleware');

router.post('/', createTransaction);
router.get('/:accountId', checkAccountOpen, listTransactions);

module.exports = router; 
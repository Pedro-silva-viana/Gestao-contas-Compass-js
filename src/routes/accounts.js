const express = require('express');
const router = express.Router();
const { createAccount, getBalance, putOpen} = require('../controllers/accountControllers');

router.post('/', createAccount);
router.get('/:accountId/balance', getBalance);
router.patch('/:accountId/open', putOpen);

module.exports = router;
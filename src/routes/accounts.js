const express = require('express');
const router = express.Router();
const { createAccount, getBalance, putOpen, getAccount} = require('../controllers/accountControllers');
const checkAccountOpen = require('../middleware/accountMiddleware');

router.post('/', createAccount);
router.get('/:accountId', checkAccountOpen, getAccount);
router.get('/:accountId/balance', checkAccountOpen, getBalance);
router.patch('/:accountId/open', putOpen);

module.exports = router;
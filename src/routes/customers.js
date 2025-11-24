const express = require('express');
const router = express.Router();
const { createCustomer, getCustomer, getCustomerbyCnpj} = require('../controllers/customerControllers');

router.post('/', createCustomer);
router.get('/:customerId', getCustomer);
router.get('/:cnpj/cnpj', getCustomerbyCnpj);

module.exports = router;
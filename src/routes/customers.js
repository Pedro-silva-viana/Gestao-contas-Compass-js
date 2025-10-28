const express = require('express');
const router = express.Router();
const { createCustomer } = require('../controllers/customerControllers');

router.post('/', createCustomer);

module.exports = router;
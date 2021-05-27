const express = require('express');
const router = express.Router();

let controller = require('./checkoutC');

router.post('/', controller.paymentMethod);

module.exports = router;
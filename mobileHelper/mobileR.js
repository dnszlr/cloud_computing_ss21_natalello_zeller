const express = require('express');
const router = express.Router();

let controller = require('./mobileC');

router.post('/checkout', controller.paymentMethod);
router.get('createuser', controller.createUser);
router.get('/clienttoken', controller.getClientToken);

module.exports = router;
var express = require('express');
var router = express.Router();

let controller = require('../controllers/registrationC');

router.get('/', controller.getRegistration);
router.post('/', controller.register);

module.exports = router;
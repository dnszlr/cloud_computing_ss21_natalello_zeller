var express = require('express');
var router = express.Router();

let registration = require('../controllers/registration');

/* GET home page. */
router.get('/', registration.getRegistration);

module.exports = router;
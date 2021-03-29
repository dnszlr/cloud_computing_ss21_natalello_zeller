var express = require('express');
var router = express.Router();

let registrationC = require('../controllers/registrationC');

/* GET home page. */
router.get('/registration', registrationC.getRegistration);
router.get('/registration/credentials', registrationC.submitCredentails);

module.exports = router;
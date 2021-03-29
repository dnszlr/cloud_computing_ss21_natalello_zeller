var express = require('express');
var router = express.Router();

let loginC = require('../controllers/loginC');

/* GET home page. */
router.get('/login', loginC.getLogin);

module.exports = router;
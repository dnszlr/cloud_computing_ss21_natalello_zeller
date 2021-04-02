var express = require('express');
var router = express.Router();
const tokenVerificator = require('../auth/tokenVerificator');

let chatC = require('../controllers/chatC');

router.get('/', tokenVerificator.verify, chatC.getChat);

module.exports = router;
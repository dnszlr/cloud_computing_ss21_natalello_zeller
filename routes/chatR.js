var express = require('express');
var router = express.Router();

let chatC = require('../controllers/chatC');

/* GET home page. */
router.get('/chat', chatC.getChat);

module.exports = router;
var express = require('express');
var router = express.Router();

let chat = require('../controllers/chat');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('chat', {title: 'Chatroom'});
});

module.exports = router;
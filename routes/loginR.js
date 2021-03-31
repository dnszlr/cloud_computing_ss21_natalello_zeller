var express = require('express');
var router = express.Router();

let controller = require('../controllers/loginC');

router.get("/", controller.getLogin);
router.post("/verification", controller.verification)

module.exports = router;
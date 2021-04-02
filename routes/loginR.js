const express = require('express');
const router = express.Router();

let controller = require('../controllers/loginC');

router.get("/", controller.getLogin);
router.post("/verification", controller.verification)
router.get("/logout", controller.logout);

module.exports = router;
let express = require('express');
let router = express.Router();

let controller = require('../controllers/registrationC');

router.get('/', controller.getRegistration);
router.post('/', controller.register);

module.exports = router;
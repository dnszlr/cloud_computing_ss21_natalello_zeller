let express = require('express');
let router = express.Router();
const multer = require('multer');
const upload = multer({ dest: "../public/images"});
let controller = require('../controllers/registrationC');
let visualRecognition = require('../ibmServices/visualRecognition');

router.get('/', controller.getRegistration);
router.post('/', controller.register);
router.post('/visualRecognition', upload.array("image"), visualRecognition.shaedVisualRecognition);

module.exports = router;
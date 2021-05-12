const express = require('express');
const router = express.Router();
const auth = require('../middleware/Auth');

const messageController = require('../controllers/message');

router.post('/create', auth, messageController.create);
router.post('/createMedia', auth, messageController.createMedia);

module.exports = router
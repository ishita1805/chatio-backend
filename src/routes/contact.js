const express = require("express");
const router = express.Router();
const auth = require('../middleware/Auth')

const contactController = require("../controllers/contact.js");

router.post('/create', auth, contactController.createContact);
router.post('/update', auth, contactController.updateContact);
router.get('/get', auth, contactController.getContacts);
router.post('/getOne', auth, contactController.getContact);
router.post('/getOneMedia', auth, contactController.getContactMedia);

module.exports = router;
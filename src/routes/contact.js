const express = require("express");
const router = express.Router();
const auth = require('../middleware/Auth')

const contactController = require("../controllers/contact.js");

router.post('/create', auth, contactController.createContact);
router.post('/update', auth, contactController.updateContact);
router.post('/updateNotification', auth, contactController.updateNotification);
router.get('/get', auth, contactController.getContacts);
router.get('/getConversation',auth,contactController.getConversations);
router.post('/getOne', auth, contactController.getContact);
router.post('/getOneMedia', auth, contactController.getContactMedia);

module.exports = router;
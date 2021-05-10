const express = require("express");
const router = express.Router();
const auth = require('../middleware/Auth')

const reqController = require("../controllers/request");

router.post('/create', auth, reqController.createRequest);
router.post('/delete', auth, reqController.deleteRequest);
router.post('/reject', auth, reqController.rejectRequest);
router.get('/received', auth, reqController.receivedRequests);
router.get('/sent', auth, reqController.sentRequests);

module.exports = router;
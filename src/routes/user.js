const express = require("express");
const router = express.Router();
const auth = require('../middleware/Auth')

const userController = require("../controllers/user");

router.post('/login', userController.login);
router.post('/signup', userController.signup);
router.post('/logout', auth, userController.logout);

module.exports = router;
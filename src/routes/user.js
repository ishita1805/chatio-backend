const express = require("express");
const router = express.Router();
const auth = require('../middleware/Auth')

const userController = require("../controllers/user");

router.post('/login', userController.login);
router.get('/user',auth, userController.getUser);
router.post('/signup', userController.signup);
router.post('/updateProfile', auth, userController.updateProfile);
router.post('/logout', auth, userController.logout);
router.post('/update',userController.updateUser);

module.exports = router;
const express = require('express');
const authController = require('./../controller/authController');
const router = express.Router();

router.post('/sigunup', authController.signUpUser);
module.exports = router;
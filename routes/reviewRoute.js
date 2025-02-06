const express = require('express');
const reviewController = require('./../controller/reviewController');
const authController = require('./../controller/authController');

const router = express.Router();

router.post('/reviewadd', authController.protectRoutes, reviewController.createReviews);
router.get('/reviewsall', reviewController.getAllReviews);

module.exports = router;
const express = require('express');
const reviewController = require('./../controller/reviewController');
const authController = require('./../controller/authController');

const route = express.Router({ mergeParams: true });

route.post('/reviewadd', authController.protectRoutes, authController.restrictUserRoles('user'), reviewController.reviewTouruIdUserIdSetup, reviewController.createReviews);
route.get('/reviewsall', reviewController.getAllReviews);
route.get('/:id', authController.protectRoutes, authController.restrictUserRoles('user'), reviewController.getReview);
route.patch('/reviewUpdate/:id', authController.protectRoutes, authController.restrictUserRoles('user'), reviewController.updateReview);
route.delete('/reviewDelete/:id', authController.protectRoutes, authController.restrictUserRoles('user'), reviewController.deleteReview);
route.delete('/reviewDeletes', authController.protectRoutes, authController.restrictUserRoles('admin'), reviewController.deleteAllReviews);

module.exports = route;
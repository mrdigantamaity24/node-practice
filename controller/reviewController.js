// const mongoose = require('mongoose');
const Review = require('./../models/reviewsModel');
const asychCathHandeler = require('./../utils/asyncErrorhandle');
const helperFactory = require('./helperController');

// setup the tourid and user id when create a review
exports.reviewTouruIdUserIdSetup = (req, res, next) => {
    if (!req.body.tour) {
        req.body.tour = req.params.tourId;
    }
    if (!req.body.user) {
        req.body.user = req.user._id;
    }

    next();
}

// get all reviews
exports.getAllReviews = helperFactory.getAllDocument(Review);

// create revires
exports.createReviews = helperFactory.addDocument(Review);

// get revie by id
exports.getReview = helperFactory.getDocumentOneByID(Review);

// update review
exports.updateReview = helperFactory.updateDocument(Review);

// delete review
exports.deleteReview = helperFactory.deleteDocumentOne(Review);

// delete all reviews
exports.deleteAllReviews = helperFactory.deleteDocumentsAll(Review);
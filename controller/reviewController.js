// const mongoose = require('mongoose');
const Review = require('./../models/reviewsModel');
const asychCathHandeler = require('./../utils/asyncErrorhandle');

exports.getAllReviews = asychCathHandeler(async (req, res, next) => {
    const allreviews = await Review.find();

    if (allreviews.length > 0) {
        res.status(200).json({
            status: 'Successfull',
            message: `${allreviews.length} reviews found`,
            data: {
                allreviews
            }
        });
    } else {
        res.status(200).json({
            status: 'Successfull',
            message: `No reviews found`,
        });
    }
})

exports.createReviews = asychCathHandeler(async (req, res, next) => {
    if (!req.body.tour) {
        req.body.tour = req.params.tourId;
    }
    if (!req.body.user) {
        req.body.user = req.user._id;
    }

    const review = await Review.create(req.body);

    res.status(200).json({
        status: 'Successfull',
        message: 'Review Create Successfull',
        data: {
            review
        }
    });
});
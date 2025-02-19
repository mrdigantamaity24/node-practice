const mongoose = require('mongoose');
const Tour = require('./tourModel');

const ReviewSchema = new mongoose.Schema(
    {
        review: {
            type: String,
            required: [true, 'Review must be filled'],
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        tour: {
            type: mongoose.Schema.ObjectId,
            ref: 'Tour',
            required: [true, 'Tour must be present']
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'User must be present']
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Query middleware

/** for populate the tour and user */
ReviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'tour',
        select: '__id'
    }).populate({
        path: 'user',  // Fixed typo here
        select: 'name'
    });

    next();
});

// calculate the avarage review rating
ReviewSchema.statics.calculateReviewAvg = async function (tourID) {
    const staReportReview = await this.aggregate([
        {
            $match: { tour: tourID }
        },
        {
            $group: {
                _id: '$tour',
                noOfRating: { $sum: 1 },
                ratingAvg: { $avg: '$rating' }
            }
        }
    ]);

    // console.log(staReportReview);
    // get the tour by the id and update the ratings quantity and rating
    await Tour.findByIdAndUpdate(tourID, {
        ratingsAverage: Math.ceil(staReportReview[0].ratingAvg * 10) / 10,
        ratingsQuantity: staReportReview[0].noOfRating
    });
}

// save it in the middleware
ReviewSchema.post('save', function () {
    this.constructor.calculateReviewAvg(this.tour); // "this.constructor" is used for the review model
})


const Review = mongoose.model('Review', ReviewSchema);
module.exports = Review;
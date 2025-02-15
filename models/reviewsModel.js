const mongoose = require('mongoose');

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


const Review = mongoose.model('Review', ReviewSchema);
module.exports = Review;
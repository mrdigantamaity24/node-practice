const mongoose = require('mongoose');
const validator = require('validator');
const User = require('./userModel');

const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A tour must have a name'],
            unique: true,
            trim: true,
        },
        duration: {
            type: Number,
            required: [true, 'A tour must have a duration']
        },
        maxGroupSize: {
            type: Number,
            required: [true, 'A tour must have a group size']
        },
        difficulty: {
            type: String,
            required: [true, 'A tour must have a difficulty'],
            enum: {
                values: ['easy', 'medium', 'difficult'],
                message: 'Difficulty is either easy, medium or difficult'
            }
        },
        ratingsAverage: {
            type: Number
        },
        ratingsQuantity: {
            type: Number
        },
        price: {
            type: Number,
            required: [true, 'A tour must have price']
        },
        salePrice: {
            type: Number,
            validate: {
                validator: function (val) {
                    return val < this.price;
                },
                message: 'Sale price ({VALUE}) must be less than the regular price'
            }
        },
        discount: {
            type: Number,
            default: 0
        },
        summary: {
            type: String,
            trim: true,
            required: [true, 'A tour must have a summary']
        },
        description: {
            type: String,
            trim: true
        },
        imageCover: {
            type: String,
            required: true
        },
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false
        },
        startDates: [Date],
        startLocation: {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            cordinate: [Number],
            address: String,
            description: String
        },
        location: [
            {
                type: {
                    type: String,
                    default: 'Point',
                    enum: ['Point']
                },
                cordinate: [Number],
                address: String,
                description: String,
                day: Number
            }
        ],
        guids: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'User'
            }
        ]
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// virtual middleware
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
});

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'guids',
        select: '-__v -passwordChangedAt'
    })
    next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
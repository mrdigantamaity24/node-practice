const fs = require('fs');
const Tour = require(`./../models/tourModel`);
const asyncError = require(`./../utils/asyncErrorhandle`);
const AppError = require('../utils/appError');
const helperFactory = require('./helperController');

// top 4 tours alais
exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '4';  // how many tours to show
    req.query.sort = '-ratingsAverage,price';   // get tour basis of which fields are you want to show
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';  // which fields are you want to show
    next();
};

// get all tour
exports.getAllTours = helperFactory.getAllDocument(Tour);

// add a new tour
exports.addTour = helperFactory.addDocument(Tour);

// get a tour by id
exports.getTour = helperFactory.getDocumentOneByID(Tour, { path: 'reviews' });

// update a tour
exports.updateTour = helperFactory.updateDocument(Tour);

// delete a tour
exports.deleteTour = helperFactory.deleteDocumentOne(Tour);

// delete all tours
exports.allToursDelete = helperFactory.deleteDocumentsAll(Tour);

// data aggrigation
exports.getTourStatus = asyncError(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } }
        },
        {
            $group: {
                _id: '$difficulty',
                totalTour: { $sum: 1 },
                totalRatings: { $sum: '$ratingsQuantity' },
                totalPrice: { $sum: '$price' },
                avarageRating: { $avg: '$ratingsAverage' },
                avaragePrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' }
            }
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            stats
        }
    });
});
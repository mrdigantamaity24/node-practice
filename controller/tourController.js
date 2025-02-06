const fs = require('fs');
const Tour = require(`./../models/tourModel`);
const TourAPIfeatures = require(`./../utils/apiFetauresTour`);
const asyncError = require(`./../utils/asyncErrorhandle`);
const AppError = require('../utils/appError');

// top 4 tours alais
const aliasTopTours = (req, res, next) => {
    req.query.limit = '4';  // how many tours to show
    req.query.sort = '-ratingsAverage,price';   // get tour basis of which fields are you want to show
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';  // which fields are you want to show
    next();
};

// get all tour
const getAllTours = asyncError(async (req, res, next) => {
    const apiFeatures = new TourAPIfeatures(Tour.find(), req.query).filter().sort().fieldlimit().pagination();

    const allTours = await apiFeatures.query;

    res.status(200).json({
        status: 'success',
        results: allTours.length,
        data: {
            allTours
        }
    });
});

// add a new tour
const addTour = asyncError(async (req, res, next) => {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            tours: newTour
        }
    })
});

// get a tour by id
const getTour = asyncError(async (req, res, next) => {
    const getTour = await Tour.findById(req.params.id).populate('reviews');

    // get tour by ID
    if (!getTour) {
        return next(new AppError('No tour found with this Id', 404));
    }

    res.status(200).json({
        status: 'success',
        message: 'Tour found',
        data: {
            getTour
        }
    });
});

// update a tour
const updateTour = asyncError(async (req, res, next) => {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    // tours upadte by Id
    if (!updatedTour) {
        return next(new AppError('No tour found with this Id', 404));
    }

    res.status(200).json({
        status: 'success',
        message: 'Tour Updated',
        data: {
            updatedTour
        }
    });
});

// delete a tour
const deleteTour = asyncError(async (req, res, next) => {
    const tourDelete = await Tour.findByIdAndDelete(req.params.id);

    // tours delete by id
    if (!tourDelete) {
        return next(new AppError('No tour found with this Id', 404));
    }

    res.status(200).json({
        status: 'success',
        message: 'Tour Successfully Deleted'
    });
});

// delete all tours
const allToursDelete = asyncError(async (req, res, next) => {
    const allTours = await Tour.deleteMany();

    // all tours delete
    if (!allTours) {
        return next(new AppError('No tour found with this Id', 404));
    }

    res.status(200).json({
        status: 'success',
        message: 'All Tours Successfully Deleted'
    });
});

// data aggrigation
const getTourStatus = asyncError(async (req, res, next) => {
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




// exports all methods
module.exports = {
    getAllTours,
    addTour,
    getTour,
    updateTour,
    deleteTour,
    allToursDelete,
    aliasTopTours,
    getTourStatus
}
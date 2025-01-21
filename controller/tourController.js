const fs = require('fs');
const Tour = require(`./../models/tourModel`);
const TourAPIfeatures = require(`./../utils/apiFetauresTour`);

// top 4 tours alais
const aliasTopTours = (req, res, next) => {
    req.query.limit = '4';  // how many tours to show
    req.query.sort = '-ratingsAverage,price';   // get tour basis of which fields are you want to show
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';  // which fields are you want to show
    next();
}

// get all tour
const getAllTours = async (req, res) => {
    try {
        const apiFeatures = new TourAPIfeatures(Tour.find(), req.query).filter().sort().fieldlimit().pagination();

        const allTours = await apiFeatures.query;
        if (allTours.length > 0) {
            res.status(200).json({
                status: 'success',
                results: allTours.length,
                data: {
                    allTours
                }
            });
        } else {
            res.status(404).json({
                status: 'fail',
                message: "No Tour Found"
            });
        }
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: "Somthing want wrong!"
        });
    }
}

// add a new tour
const addTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                tours: newTour
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
}

// get a tour by id
const getTour = async (req, res) => {
    try {
        const getTour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            message: 'Tour found',
            data: {
                getTour
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: "No tours found"
        });
    }
}

// update a tour
const updateTour = async (req, res) => {
    try {
        const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: 'success',
            message: 'Tour Updated',
            data: {
                updatedTour
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: "No tours found"
        });
    }
}

// delete a tour
const deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);
        res.status(200).json({
            status: 'success',
            message: 'Tour Successfully Deleted'
        });
    } catch (err) {
        res.status(404).json({
            status: 'false',
            message: "Not Deleted. SOmething is wrong!"
        })
    }
};

// delete all tours
const allToursDelete = async (req, res) => {
    try {
        await Tour.deleteMany();
        res.status(200).json({
            status: 'success',
            message: 'All Tours Successfully Deleted'
        });
    } catch (err) {
        res.status(404).json({
            status: 'false',
            message: "Not Deleted. SOmething is wrong!"
        })
    }
};

// dada aggrigation
const getTourStatus = async (req, res) => {
    try {
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
    } catch (error) {
        res.status(404).json({
            status: 'false',
            message: err
        })
    }
}








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
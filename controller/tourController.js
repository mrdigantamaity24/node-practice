const fs = require('fs');
const Tour = require(`./../models/tourModel`);

// get all tour
const getAllTours = async (req, res) => {
    try {
        // filter
        const queryObj = { ...req.query }; // copy query object [here '...' this three dots is called spread operator]
        const execludeFiled = ['page', 'limit', 'sort', 'fields'];  // exelude fileds which i don't want to be query
        execludeFiled.forEach(el => delete queryObj[el]);   // delete the fields which i don't want to be query

        // Advanced filter
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, matche => `$${matche}`);

        // const query = Tour.find(JSON.parse(queryStr)); // for filtering
        const query = Tour.find(JSON.parse(queryStr));  // for advance filtering

        const allTours = await query;
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
        res.status(204).json({
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
        res.status(204).json({
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

module.exports = {
    getAllTours,
    addTour,
    getTour,
    updateTour,
    deleteTour,
    allToursDelete
}
const fs = require('fs');
const User = require('./../models/userModel');
const catchAsyncHandel = require('./../utils/asyncErrorhandle');
const AppError = require('../utils/appError');
const helperFactory = require('./helperController');


// get all user
exports.getAllUsers = helperFactory.getAllDocument(User);

exports.getMe = (req, res, next) => {
    req.params.id = req.user._id;
    next();
}

// get user by id
exports.getUser = helperFactory.getDocumentOneByID(User);


const filterData = (obj, ...upadatedFileds) => {
    // console.log(Object.keys(obj));
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (upadatedFileds.includes(el)) {
            newObj[el] = obj[el];
        }
    })
    return newObj;
}

// update user data
exports.updateUserData = catchAsyncHandel(async (req, res, next) => {
    // if user want to try to update password from this route
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('You can\'t change your password from here', 400));
    }

    // filter the need field
    const filteredUserData = filterData(req.body, 'name', 'email')

    // update the user
    const updateUser = await User.findByIdAndUpdate(req.user._id, filteredUserData, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        status: 'Successfull',
        message: 'User data update successfull',
        data: {
            updateUser
        }
    })
})

// delete a user (not delete make it false)
exports.deleteUserData = catchAsyncHandel(async (req, res, next) => {
    const deleteUser = await User.findByIdAndUpdate(req.user._id, { active: false });
    res.status(204).json({
        status: 'Successfull',
        message: 'User delete successfull',
        data: {
            deleteUser
        }
    })
});

// delete user by id
exports.deleteUserById = catchAsyncHandel(async (req, res, next) => {
    const deleteUser = await User.findByIdAndUpdate(req.params.id, { active: false });
    res.status(204).json({
        status: 'Successfull',
        message: 'User delete successfull',
        data: {
            deleteUser
        }
    })
})
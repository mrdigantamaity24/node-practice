const fs = require('fs');
const User = require('./../models/userModel');
const catchAsyncHandel = require('./../utils/asyncErrorhandle');
const AppError = require('../utils/appError');

// get all user
exports.getAllUsers = catchAsyncHandel(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        status: 'success',
        length: users.length,
        message: 'Users fetched successfully',
        data: {
            users
        }
    });
})

// get user by id
exports.getUser = catchAsyncHandel(async (req, res, next) => {
    const getuser = await User.findById(req.params.id);
    res.status(201).json({
        status: 'Success',
        message: 'User found',
        data: {
            getuser
        }
    });
})

// update user data
exports.updateUserData = catchAsyncHandel(async (req, res, next) => {
    // if user want to try to update password from this route
    // if (req.body.password || req.body.passwordConfirm) {
    //     return next(new AppError('For change password please use the update password route', 400));
    // }

    const updateUser = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(204).json({
        status: 'Successfull',
        message: 'User update successfull',
        data: {
            updateUser
        }
    })
})

// delete a user
exports.deleteUserData = catchAsyncHandel(async (req, res, next) => {
    const deleteUser = await User.findByIdAndDelete(req.params.id);
    res.status(204).json({
        status: 'Successfull',
        message: 'User delete successfull',
        data: {
            deleteUser
        }
    })
})
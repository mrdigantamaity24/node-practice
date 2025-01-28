const fs = require('fs');
const User = require('./../models/userModel');
const catchAsyncHandel = require('./../utils/asyncErrorhandle');
const AppError = require('../utils/appError');


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
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('You can\'t change your password from here', 400));
    }

    // filter the need field
    const filteredUserData = filterData(req.body, 'name', 'email')

    // update the user
    const updateUser = await User.findByIdAndUpdate(req.params.id, filteredUserData, {
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
    const deleteUser = await User.findByIdAndUpdate(req.params.id, { active: false });
    res.status(204).json({
        status: 'Successfull',
        message: 'User delete successfull',
        data: {
            deleteUser
        }
    })
})
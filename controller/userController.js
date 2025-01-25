const fs = require('fs');
const User = require('./../models/userModel');
const catchAsyncHandel = require('./../utils/asyncErrorhandle');

// get all user
const getAllUsers = catchAsyncHandel(async (req, res, next) => {
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

// add a new user
// const addUsers = async (req, res) => {
//     try{
//         const usersAdd = await User.create(req.body);
//         res.status(201).json({
//             status: 'success',
//             message: 'Users add successfully',
//             data: {
//                 usersAdd
//             }
//         })
//     }catch(err){
//         res.status(404).json({
//             status: 'fail',
//             message: "Users add unsuccessfully"
//         });
//     }
// }

// get user by id
const getUser = catchAsyncHandel(async (req, res, next) => {
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
const updateUserData = catchAsyncHandel(async (req, res, next) => {
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
const deleteUserData = catchAsyncHandel(async (req, res, next) => {
    const deleteUser = await User.findByIdAndDelete(req.params.id);
    res.status(204).json({
        status: 'Successfull',
        message: 'User delete successfull',
        data: {
            deleteUser
        }
    })
})

module.exports = {
    getAllUsers,
    // addUsers,
    getUser,
    updateUserData,
    deleteUserData
}
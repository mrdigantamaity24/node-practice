const fs = require('fs');
const User = require('./../models/userModel');

// get all user
const getAllUsers = async (req, res) => {
    try{
        const users = await User.find();
        res.status(200).json({
            status: 'success',
            length: users.length,
            message: 'Users fetched successfully',
            data: {
                users
            }
        })
    }catch(err){
        res.status(404).json({
            status: 'fail',
            message: "No users found"
        });
    }
}

// add a new user
const addUsers = async (req, res) => {
    try{
        const usersAdd = await User.create(req.body);
        res.status(201).json({
            status: 'success',
            message: 'Users add successfully',
            data: {
                usersAdd
            }
        })
    }catch(err){
        res.status(404).json({
            status: 'fail',
            message: "Users add unsuccessfully"
        });
    }
}

// get user by id
const getUser = async (req, res) => {
    try{
        const getuser = await User.findById(req.params.id);
        res.status(201).json({
            status: 'Success',
            message: 'User found',
            data: {
                getuser
            }
        });
    }catch(err){
        res.status(404).json({
            status: 'Failed',
            message: 'User not found'
        });
    }
}

// update user data
const updateUserData = async (req, res) => {
    try{
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
    }catch(err){
        res.status(404).json({
            status: 'Failed',
            message: 'User not found'
        });
    }
}

// delete a user
const deleteUserData = async (req, res) => {
    try{
        const deleteUser = await User.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'Successfull',
            message: 'User delete successfull',
            data: {
                deleteUser
            }
        })
    }catch(err){
        res.status(404).json({
            status: 'Failed',
            message: 'User not found'
        });
    }
}

module.exports = {
    getAllUsers,
    addUsers,
    getUser,
    updateUserData,
    deleteUserData
}
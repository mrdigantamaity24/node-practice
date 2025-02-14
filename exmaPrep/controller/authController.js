const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./../model/userModel');
const aychHendle = require('./../middleware/asychController');


const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_TOKEN, {
        expiresIn: process.env.JWT_EXPIRE_IN
    });
};

exports.signUpUser = aychHendle(async (req, res) => {
    const user = await User.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        role: req.body.role,
        password: req.body.password
    });

    const token = signToken(user._id);

    res.status(200).json({
        status: 'Success',
        message: 'User create successfull',
        token: token,
        data: {
            user
        }
    })
});
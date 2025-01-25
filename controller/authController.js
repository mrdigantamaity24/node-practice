const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsyncHandel = require('./../utils/asyncErrorhandle');
const AppError = require('../utils/appError');

// generate the token
const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_TOKEN, {
        expiresIn: process.env.JWT_EXPIRE_IN
    });
};

// sign up auth for user
exports.signUpUserAuth = catchAsyncHandel(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt
    });

    // generate the auth token
    const authToken = signToken(newUser._id);

    res.status(200).json({
        status: 'Success',
        authToken,
        message: 'User created successfully',
        data: {
            user: newUser
        }
    });
});

// login auth for user
exports.userSignInAuth = catchAsyncHandel(async (req, res, next) => {
    const { email, password } = req.body;

    // check email and password is set or not
    if (!email || !password) {
        return next(new AppError('Please enter your email and password', 400));
    }

    // check if user exists && password is correct
    const userData = await User.findOne({ email }).select('+password'); // select the user
    // const checkPassword = await userData.checkPasssword(password, userData.password); // compare the password

    if (!userData || !(await userData.checkPasssword(password, userData.password))) {
        return next(new AppError('Invalid credential', 401));
    }

    const token = signToken(userData._id);

    res.status(200).json({
        status: 'Success',
        token,
        message: 'User login successfully'
    });
});

// protect the route
exports.protectRoutes = catchAsyncHandel(async (req, res, next) => {
    // check if the user is login or not
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('You are not logged in! Please login to get access.', 401));
    }

    // verify the token
    const decooded = await promisify(jwt.verify)(token, process.env.JWT_TOKEN);

    // check if the user is exist or not
    const freshUser = await User.findById(decooded.id);
    if (!freshUser) {
        return next(new AppError('The user is no longer exist.', 401));
    }

    // by any chance the user has changed the password after the token was issued
    if (freshUser.passwordChangedAfter(decooded.iat)) {
        return next(new AppError('User recently changed the password. Please login again.', 401));
    }

    // grant access to the protected route
    req.user = freshUser;
    next();
});
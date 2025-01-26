const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsyncHandel = require('./../utils/asyncErrorhandle');
const AppError = require('../utils/appError');
const sendEmail = require('./../utils/email');

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
        role: req.body.role,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt,
        passwordResetToken: req.body.passwordResetToken,
        passwordResetExpires: req.body.passwordResetExpires
    });

    // const newUser = await User.create(req.body);

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

// authorization the user roles [admin and the lead-guid only have the permission to change]
exports.restrictUserRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You don\'t have permission to access', 403));
        }

        next();
    }
}

// forget password
exports.forgetPassword = catchAsyncHandel(async (req, res, next) => {
    // check the user email is exists or not in database
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('This email is not exists', 403));
    }

    // genarate the random reset token
    const resetToken = user.createForgetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // send the email
    const resetUrl = `${req.protocol}://${req.get('host')}/api/users/resetPassword/${resetToken}`;

    const message = `To reset your password click the following link ${resetUrl} Otherwise you can ignore this email`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Reset Password (Valid for 10 min)',
            message
        });

        res.status(200).json({
            status: 'success',
            message: 'Email send to your email. Please check your email'
        })
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new AppError('Something is wrong to send the eamil', 500));
    }
});

// reset password
exports.resetPassword = (req, res, next) => {

}
const { crypto } = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
var fs = require('fs');
var path = require('path');
const User = require('./../models/userModel');
const catchAsyncHandel = require('./../utils/asyncErrorhandle');
const AppError = require('../utils/appError');
const MailSend = require('./../utils/email');


// generate the token
const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_TOKEN, {
        expiresIn: process.env.JWT_EXPIRE_IN
    });
};

// create and set token in cookies token
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOCKIE_EXPIRE_DAY * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);

    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};

// sign up auth for user
exports.signUpUserAuth = catchAsyncHandel(async (req, res, next) => {
    let photoPath = null;

    if (req.file) {
        photoPath = `uploads/${req.file.filename}`; // Store file path, not binary
    }

    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        photo: photoPath,  // Only set if file is uploaded
        role: req.body.role,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt,
        passwordResetToken: req.body.passwordResetToken,
        passwordResetExpires: req.body.passwordResetExpires
    });

    const message = 'Your account has been successfully created!';

    // Create and send token
    createSendToken(newUser, 200, res);

    // Send welcome email
    try {
        await MailSend({
            email: newUser.email,
            subject: 'Welcome to Our Platform!',
            message: message
        });
    } catch (error) {
        console.error('Email sending failed:', error);
    }
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

    createSendToken(userData, 200, res);
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
    const resetUrl = `${req.protocol}://${req.get('host')}/api/users/resetpass/${resetToken}`;

    const message = `To reset your password click the following link ${resetUrl} Otherwise you can ignore this email`;

    // try {
    //     await MailSend({
    //         email: user.email,
    //         subject: 'Reset Password (Valid for 10 min)',
    //         message
    //     });

    //     res.status(200).json({
    //         status: 'success',
    //         message: 'Email send to your email. Please check your email'
    //     })
    // } catch (err) {
    //     user.passwordResetToken = undefined;
    //     user.passwordResetExpires = undefined;

    //     await user.save({ validateBeforeSave: false });

    //     return next(new AppError('Something is wrong to send the eamil', 500));
    // }

    try {
        await MailSend({
            email: user.email,
            subject: 'Reset Password (Valid for 10 min)',
            message: message
        });

        res.status(200).json({
            status: 'success',
            message: 'Email send to your email. Please check your email'
        })
    } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new AppError('Something is wrong to send the eamil', 500));
    }
});

// reset password
exports.resetPassword = catchAsyncHandel(async (req, res, next) => {
    // get user by the token which we have sent in the email
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });

    // check the token is valid or not or expired or not
    if (!user) {
        return next(new AppError('Invalide token', 400))
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    const token = signToken(user._id);

    res.status(200).json({
        status: 'Success',
        token,
        message: 'Password reset successfull'
    });
})

// password change
exports.passwordUpdate = catchAsyncHandel(async (req, res, next) => {
    // const { _id, password } = req.body;
    const loginUserData = await User.findById(req.user._id).select('+password');

    // check the current password is it correct or not
    if (!(await loginUserData.checkPasssword(req.body.passwordCurrent, loginUserData.password))) {
        return next(new AppError('Current password is not matched', 401));
    }

    // after get the data and check the password then update the password field
    loginUserData.password = req.body.password;
    loginUserData.passwordConfirm = req.body.passwordConfirm;
    await loginUserData.save();

    // generate the token
    createSendToken(loginUserData, 200, res);
});
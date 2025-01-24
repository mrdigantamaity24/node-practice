const User = require('./../models/userModel');
const catchAsyncHandel = require('./../utils/asyncErrorhandle');

// sign up auth for user
const signUpUserAuth = catchAsyncHandel(async (req, res, next) => {
    const userData = await User.create(req.body);

    res.status(200).json({
        status: 'Success',
        data: {
            user: userData
        }
    });
});

module.exports = { signUpUserAuth };
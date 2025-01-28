const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
var bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'I think you have a Name which is given by your parents :('],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'You don\'t have any email. uooooooo :('],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Your email is not wright formate']
    },
    photo: String,
    role: {
        type: String,
        enum: ['admin', 'user', 'leade-guid', 'guid'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Ashwhole put a Password. :('],
        minlength: 6,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Confirm your password dum ash. :('],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'Both password should be same'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
});

// password encryption when user created
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // run the code if the code was codified

    // hash the password
    this.password = await bcrypt.hash(this.password, 12);
    // delete the confirm password after password match
    this.passwordConfirm = undefined;

    next();
});

// save the password when reset password is happening
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || this.isNew) return next(); // run the code if the code was codified

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

// returen all user but not the deactive one
userSchema.pre(/^find/, function (next) {
    // this points to the current query
    this.find({ active: { $ne: false } });
    next();
});


// compare the password when user login [in the below methods 'userpassword' is the password which is given by the user and 'dbpassword' is the password which is stored in the database]
userSchema.methods.checkPasssword = async function (userpassword, dbpassword) {
    return await bcrypt.compare(userpassword, dbpassword);
}

// check the password is changed after the token was issued
userSchema.methods.passwordChangedAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const passwordChangedTime = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < passwordChangedTime; // if the password was changed after the token was issued
    }

    // if the password was not changed
    return false;
}

// create token in forget password
userSchema.methods.createForgetPasswordToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    console.log({ resetToken }, this.passwordResetToken);

    this.passwordResetExpires = Data.now() + 10 * 60 * 100;

    return resetToken;
}


const User = mongoose.model('User', userSchema);

module.exports = User; 
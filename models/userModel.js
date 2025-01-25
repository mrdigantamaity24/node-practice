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
    passwordChangedAt: Date
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

const User = mongoose.model('User', userSchema);

module.exports = User; 
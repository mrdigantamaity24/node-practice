const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: [true, 'First Name is required']
    },
    last_name: {
        type: String,
        required: [true, 'Last Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        validate: [validator.isEmail, 'Email formate dosen\'t match'],
        unique: true
    },
    role: {
        type: String,
        enum: ['admin', 'author', 'user'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Password required'],
        minlength: 6,
        select: false
    },
    passwordConfirm: {
        type: String,
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'Both Password sholud be same'
        }
    }
});

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;

    next();
})

const User = mongoose.model('User', UserSchema);
module.exports = User;
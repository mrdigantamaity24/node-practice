const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A user must have a name'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'A user must have an email'],
        unique: true
    },
    role: String,
    status: Boolean
});

const User = mongoose.model('User', userSchema);

module.exports = User;
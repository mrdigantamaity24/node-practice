const AppError = require("../utils/appError");

// cast error or Invalid Id
const handleInvalidId = err => {
    const message = `Invalid ID`;
    return new AppError(message, 400);
}
// dupliacte value
const handelDuplicateValue = err => {
    const message = `"${err.errorResponse.keyValue.name}" is already exists.`;
    return new AppError(message, 400);
}
// validation error
const handleValidationError = err => {
    const errors = Object.values(err.errors).map(ele => ele.message);

    const message = `Invalid data. ${errors.join('. ')}`;
    return new AppError(message, 400);
}

const errorHandelMiddleware = (err, req, res, next) => {
    // console.log(err.stack);

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'Error From Global Middileware';

    // cast error or Invalid Id
    if (err.name === 'CastError') {
        err = handleInvalidId(err);
    }
    // dupliacte value
    if (err.errorResponse && err.errorResponse.code === 11000) {
        err = handelDuplicateValue(err);
    }
    // validation error
    if (err.name === 'ValidationError') {
        err = handleValidationError(err);
    }


    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err
    });
};

module.exports = errorHandelMiddleware;
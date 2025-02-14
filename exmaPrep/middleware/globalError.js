const globalError = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'Error from global middleware';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err
    });
}

module.exports = globalError;
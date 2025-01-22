const express = require('express');
const morgan = require('morgan');

const tourRouter = require(`${__dirname}/routes/tour-route`);
const userRouter = require(`${__dirname}/routes/user-route`);

const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(express.json());    // express file read

app.use(express.static(`${__dirname}/public`)); // serve static files

// =================================routing============================
app.use('/api/tours', tourRouter);
app.use('/api/users', userRouter);

// when the route is not define
app.all('*', (req, res, next) => {
    // res.status(404).json({
    //     status: 'false',
    //     message: "404 Not Found"
    // });
    // next();

    const err = new Error(`Can't find ${req.originalUrl} route`);
    err.statusCode = 404;
    err.status = 'Failed';

    next(err);
})

// error handleing middleware global
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'Error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    })
})
// =================================routing============================

module.exports = app;

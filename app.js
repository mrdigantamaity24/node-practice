const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalError = require('./controller/errorController');
const tourRouter = require(`./routes/tour-route`);
const userRouter = require(`./routes/user-route`);

const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(express.json());    // express file read

app.use(express.static(`${__dirname}/public`)); // serve static files

app.use((req, res, next) => {
    console.log('Hello from the middleware (app js)');
    // console.log(req.headers);
    next();
})

// =================================routing============================
app.use('/api/tours', tourRouter);
app.use('/api/users', userRouter);

// when the route is not define
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} this route on the server. Please check again`, 404));
})

// error handleing middleware global
app.use(globalError);
// =================================routing============================

module.exports = app;

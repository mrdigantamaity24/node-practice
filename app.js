const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitilization = require('express-mongo-sanitize');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalError = require('./controller/errorController');
const tourRouter = require(`./routes/tour-route`);
const userRouter = require(`./routes/user-route`);

const app = express();

// security of https
app.use(helmet());

// development middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// limit in all route
const limiter = rateLimit({
    max: 10,
    window: 60 * 60 * 100,
    message: 'Bohot ho gaya tera nikal lourahe. 1 ghonte bad fir ana.'
});

app.use('/api', limiter);

// read data in req.body
app.use(express.json());    // express file read

// sanitilize the middleware using NO-SQL injection
app.use(mongoSanitilization());

// preventing parameter
app.use(hpp({
    whitelist: ['duration', 'maxGroupSize', 'difficulty', 'ratingsAverage', 'ratingsQuantity', 'price']
}))

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

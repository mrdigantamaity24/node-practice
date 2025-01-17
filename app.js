const express = require('express');
const morgan = require('morgan');

const tourRouter = require(`${__dirname}/routes/tour-route`);
const userRouter = require(`${__dirname}/routes/user-route`);

const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(express.json());

app.use(express.static(`${__dirname}/public`));
// =================================routing in a better way============================

app.use('/api/tours', tourRouter);
app.use('/api/users', userRouter);

module.exports = app;

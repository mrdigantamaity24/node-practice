const express = require('express');
const app = express();

const AppError = require('./middleware/appError');
const globalError = require('./middleware/globalError');
const userRoute = require('./route/userRoute');
app.use(express.json());

app.use('/api/v2/user', userRoute);
app.all('*', (req, res, next) => {
    return next(new AppError(`Can't find ${req.originalUrl} this on the server`, 404));
});
app.use(globalError);

module.exports = app;
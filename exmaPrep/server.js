const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const DBURL = process.env.DBURL;
mongoose.connect(DBURL).then(() => {
    console.log(`Database connetect on ${process.env.PORT}`);
});

const app = require('./app');
app.listen(process.env.PORT, () => {
    console.log("Server Running");
});

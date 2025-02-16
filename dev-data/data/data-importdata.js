/** ====================================================DB COnnection======================================== */
const fs = require('fs'); // Require the flie system module
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewsModel');
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE;
mongoose.connect(DB)
    .then(() => console.log(`Database connected successfully on port ${process.env.PORT}`))
    .catch(err => console.log(err));
/** ====================================================DB COnnection======================================== */

// read the tour file from the tour smiple json data
const tours = JSON.parse(fs.readFileSync(`./dev-data/data/tours.json`, 'utf8'));
const users = JSON.parse(fs.readFileSync(`./dev-data/data/users.json`, 'utf8'));
const reviews = JSON.parse(fs.readFileSync(`./dev-data/data/reviews.json`, 'utf8'));

/** Import data from file */
const tourImportData = async () => {
    try {
        await Tour.create(tours);
        await User.create(users);
        await Review.create(reviews);
        console.log('All Data Import Successfully');
        process.exit();
    } catch (err) {
        console.log(err);
    }
}
/** Import data from file */

if (process.argv[2] === '--import') {
    tourImportData();
}
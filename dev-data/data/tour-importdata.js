/** ====================================================DB COnnection======================================== */
const fs = require('fs'); // Require the flie system module
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE;
mongoose.connect(DB)
    .then(() => console.log(`Database connected successfully on port ${process.env.PORT}`))
    .catch(err => console.log(err));
/** ====================================================DB COnnection======================================== */

// read the tour file from the tour smiple json data
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf8'));

/** Import data from file */
const tourImportData = async () => {
    try {
        await Tour.create(tours);
        console.log('All Tours Data Import Successfully');
        process.exit();
    } catch (err) {
        console.log(err);
    }
}
/** Import data from file */

if (process.argv[2] === '--import') {
    tourImportData();
}
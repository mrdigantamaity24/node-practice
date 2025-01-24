/** ====================================================DB COnnection======================================== */
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// for bad auth error or auth falied error
process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log("Unhandle Rejection. Server Shutting down.");
    process.exit(1);
});

// process.on('uncaughtException', err => {
//     console.log(err.name, err.message);
//     console.log("UnCatch Exception. Server Shutting down.");
//     process.exit(1);
// });

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE;
mongoose.connect(DB)
    .then(() => console.log(`Database connected on port ${process.env.PORT}`));
/** ====================================================DB COnnection======================================== */

const app = require(`${__dirname}/app`);    // include app as a module from app.js file
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log("Server Running");
});


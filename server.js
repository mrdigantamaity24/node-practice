/** ====================================================DB COnnection======================================== */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE;
mongoose.connect(DB)
    .then(() => console.log(`Database connected on port ${process.env.PORT}`))
    .catch(err => console.log(err));
/** ====================================================DB COnnection======================================== */

/** ====================================================Connection to the port======================================== */
const app = require(`${__dirname}/app`);    // include app as a module from app.js file
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server Running");
});
/** ====================================================Connection to the port======================================== */
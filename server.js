const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE;
1
mongoose.connect(DB)
    .then(() => console.log(`Database connected successfully on port ${process.env.PORT}`))
    .catch(err => console.log(err));



// const tourtesting = new Tour({
//     name: 'Test Tour three',
//     rating: 2.3,
//     price: 2000
// });

// tourtesting.save()
//     .then(() => console.log('Document Saved to the DB'))
//     .catch(err => console.log(err));

// server file

const app = require(`${__dirname}/app`);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server Running");
});
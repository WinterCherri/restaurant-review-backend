const dotenv = require('dotenv');
dotenv.config();

const express = require('express')
const bodyParser = require('body-parser')

//local imports
const connectDb = require('./db.js');
const app = express();


const mongoose = require('mongoose');


//middleware
app.use(bodyParser.json());

// handle JSON requests and responses nicely
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//this is a dummy GET request
app.get('/dummy', (req, res) => {
    res.send('Hello World');
});

// start the application so that it listens at port 8081
const port = process?.env?.PORT || 8081;

//http://localhost:8081/dummy
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});

connectDb()
    .then(() => {
        console.log('Successfully connect to MongoDB.');
    })
    .catch((err) => {
        console.error('Connection error', err);
        process.exit();
    });
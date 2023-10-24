import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import OpenAI from 'openai';



/*CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true}));
app.use(cors());


/* OPENAI CONFIG */

export const openai = new OpenAI({
  apiKey: process.env.OPEN_API_KEY // This is also the default, can be omitted
});



app.post('/', async (req, res) => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            max_tokens: 7,
            messages: [{role: "user", content: req.body.message}],
        });
        
        // Extract the assistant's reply from the OpenAI response
        const assistantReply = response.choices[0].message.content

        // Send the response back to the client
        res.json({ message: assistantReply });
    } catch (error) {
        console.log(error)
        res.status(500).send("An error occurred while processing your request.");
    }

})
/*SERVER SETUP */

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log('example app listening at', PORT)
})
// const dotenv = require('dotenv');
// dotenv.config();

// const express = require('express')
// const bodyParser = require('body-parser')

// //local imports
// const connectDb = require('./db.js');
// const app = express();


// const mongoose = require('mongoose');


// //middleware
// app.use(bodyParser.json());

// // handle JSON requests and responses nicely
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// //this is a dummy GET request
// app.get('/dummy', (req, res) => {
//     res.send('Hello World');
// });

// // start the application so that it listens at port 8081
// const port = process?.env?.PORT || 8081;

// //http://localhost:8081/dummy
// app.listen(port, () => {
//     console.log(`Example app listening on port ${port}`)
// });

// connectDb()
//     .then(() => {
//         console.log('Successfully connect to MongoDB.');
//     })
//     .catch((err) => {
//         console.error('Connection error', err);
//         process.exit();
//     });
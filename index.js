import MongoStore from 'connect-mongo';
import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import checkIfAuthorized from './components/checkIfAuthorized.js';
import connectDb from './components/db.js';
import './components/env.js';
import AuthRouter from './routes/auth.js';
import BusinessRouter from './routes/business.js';

await connectDb();

const app = express();
app.use(express.json());

// TODO: deal with production implementations of this
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        client: mongoose.connection.getClient(),
        collectionName: 'sessions',
    })
}))

app.use('/api/auth', AuthRouter);
app.use('/api/business', checkIfAuthorized, BusinessRouter);

app.get('/', (req, res) => {
    res.send(JSON.stringify(req.session));
})

app.listen(process.env.PORT || 8080, () => {
    console.log(`Server is running on port ${process.env.PORT || 8080}`);
});
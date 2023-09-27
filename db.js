const mongoose = require('mongoose')

const MONGO_DB_URI = process.env.MONGODB_URI;

module.exports = () => {
    return mongoose.connect(MONGO_DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
}
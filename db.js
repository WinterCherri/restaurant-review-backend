const mongoose = require('mongoose')

const MONGO_DB_URI = `mongodb+srv://admin:${process.env.DB_PASSWORD}@cluster0.hg4uaq2.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(MONGO_DB_URI);

module.exports = ()=> {
    return mongoose.connect(MONGO_DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
}
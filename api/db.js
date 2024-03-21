const mongoose = require('mongoose');

const mongoDB = (URI) => {
    return mongoose.connect(URI)
}

module.exports =  {mongoDB};
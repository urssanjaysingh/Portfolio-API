const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const requestSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});

module.exports  = mongoose.model('Request', requestSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    salt:  {
        type: String,
        required: true
    },
    hash: {
        type: String,
        required: true
    },
    auth: {
        type: Object
    },
    authId: {
        type: String
    }
});

module.exports = mongoose.model('User', User);
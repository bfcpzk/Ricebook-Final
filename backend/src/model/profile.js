const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Profile = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    display_name: {
        type: String,
    },
    email:  {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    dob: {
        type: String,
        required: true
    },
    zipcode: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
    },
    headline: {
        type: String,
    },
    following: {
        type: [String],
    }
});

module.exports = mongoose.model('Profile', Profile);



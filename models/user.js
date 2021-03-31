const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for User Data
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    superpower: {
        type: String
    },
    password: {
        type: String,
        required: true
    }
}, {timestamps: true});

// Model based on userSchema
const User = mongoose.model('User', userSchema);
module.exports = User;
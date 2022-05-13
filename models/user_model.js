// this is the schema for user model

const mongoose = require('mongoose');
var Schema = mongoose.Schema;
// const location = require('./location_model');

const UserSchema = new mongoose.Schema({
    user_id: {type: Number, require: true, unique: true},
    username: {type: String, require: true, unique: true},
    password: {type: String, require: true},
    user_type: {type: String, default: 'user'},
    fav_loc: [{type: Number}]
})

module.exports = mongoose.model('user', UserSchema);
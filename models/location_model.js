// This is the schema for location model

const mongoose = require('mongoose');
var Schema = mongoose.Schema;
// const location = require('./location_model');

const LocationSchema = new mongoose.Schema({
    loc_id: {type: Number, require: true, unique: true},
    name: {type: String, require: true},
    region: {type: String},
    country: {type: String},
    latitude: {type: Number},
    longitude: {type: Number},
    timezone_id: {type: String},
    comments: [{type: Schema.Types.ObjectId, ref: 'comment'}]
})

module.exports = mongoose.model('location', LocationSchema);
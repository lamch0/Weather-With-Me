// This is the schema for location model

const mongoose = require('mongoose');
var Schema = mongoose.Schema;
// const location = require('./location_model');

const LocationSchema = new mongoose.Schema({
    loc_id: {type: Number, require: true, unique: true},
    name: {type: String, require: true},
    lat: {type: Number, require: true},
    lon: {type: Number, require: true},
    comments: [{type: Schema.Types.ObjectId, ref: 'comment'}]
})

module.exports = mongoose.model('location', LocationSchema);

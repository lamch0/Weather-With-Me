// 1155143373 Lam Lok Hin 
// 1155143281 Choi Chung Yu 
// 1155142376 Cheung King Wa 
// 1155110159 Cheung Hing Wing 
// 1155142672 Kwok Chun Yin
// 1155143825 Lam Cheuk Hin
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

// 1155143373 Lam Lok Hin 
// 1155143281 Choi Chung Yu 
// 1155142376 Cheung King Wa 
// 1155110159 Cheung Hing Wing 
// 1155142672 Kwok Chun Yin
// 1155143825 Lam Cheuk Hin
// this is the schema for user model

const mongoose = require('mongoose');
var Schema = mongoose.Schema;
// const location = require('./location_model');

const UserSchema = new mongoose.Schema({
    user_id: {type: Number, require: true, unique: true},
    username: {type: String, require: true, unique: true, minLength: 4, maxLength: 20},
    password: {type: String, require: true},
    user_type: {type: String, default: 'user'},
    fav_loc: [{type: Schema.Types.ObjectId, ref: 'location'}]
})

module.exports = mongoose.model('user', UserSchema);

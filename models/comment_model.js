// 1155143373 Lam Lok Hin 
// 1155143281 Choi Chung Yu 
// 1155142376 Cheung King Wa 
// 1155110159 Cheung Hing Wing 
// 1155142672 Kwok Chun Yin
// 1155143825 Lam Cheuk Hin
const mongoose = require('mongoose');
var Schema = mongoose.Schema;
// const location = require('./location_model');

const CommentSchema = new mongoose.Schema({
    comment_id: {type: Number,require: true, unique: true},
    user_id: {type: Number,require: true},
    content: {type: String}
})

module.exports = mongoose.model('comment', CommentSchema);

const mongoose = require('mongoose');
var Schema = mongoose.Schema;
// const location = require('./location_model');

const CommentSchema = new mongoose.Schema({
    comment_id: {type: Number,require: true, unique: true},
    user_id: {type: Number,require: true},
    content: {type: String}
})

module.exports = mongoose.model('comment', CommentSchema);

const mongoose = require('mongoose');
var Schema = mongoose.Schema;
// const location = require('./location_model');

const CommentSchema = new mongoose.Schema({
    comment_id: {type: Number},
    user_id: {type: Number},
    content: {type: String}
})

module.exports = mongoose.model('comment', CommentSchema);
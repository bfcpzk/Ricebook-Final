const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    author:{
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    update_time: {
        type: Number,
        required: true
    }
});

CommentSchema.virtual('commentId').get(() => this._id);
CommentSchema.set('toJSON', {
    virtual: true
});

const Article = new Schema({
    author: {
        type: String,
        required: true
    },
    update_time: {
        type: Number,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    pic:{
        type: String,
        required: false
    },
    comments: [CommentSchema]
});

module.exports = mongoose.model('Article', Article);
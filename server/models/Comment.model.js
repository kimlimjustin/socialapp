const User = require('./User.model');
const Post = require('./Post.model');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    commenter:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    comment: {
        type: String,
        required: true,
        maxlength: 2500
    },
    commentTo: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true
    }
}, {
    timestamps: true
})

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
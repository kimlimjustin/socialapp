const User = require('./User.model');
const Post = require('./Post.model');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likeSchema = new Schema({
    liker:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    likeTo: {
        type: Schema.Types.ObjectId,
        ref: "Post"
    }
}, {
    timestamps: true
})

const Like = mongoose.model("Like", likeSchema);
module.exports = Like;
const mongoose = require('mongoose');
const User = require('./User.model');

const Schema = mongoose.Schema;

const postSchema = new Schema({
    image: {
        type: Object,
        required: true
    },
    description: {
        type: String,
        maxlength: 5000,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    hashtags: {
        type: Array,
        required: false
    },
    tags: {
        type: Array,
        required: false
    }
}, {
    timestamps: true
})

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
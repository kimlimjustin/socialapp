const mongoose = require('mongoose');
const User = require('./User.model');

const Schema = mongoose.Schema;

const ChatSchema = new Schema({
    chat: {
        type: String,
        maxlength: 20000,
    },
    from: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
}, {
    timestamps: true
})

const Chat = mongoose.model("Chat", ChatSchema);
module.exports = Chat;
const express = require('express');
const router = express.Router();
const Chat = require('../../models/Chat.model');
const chatsRouter = require('./chatsRouter');

router.get('/info/:user', (req, res) => {
    const user = req.params.user;
    let Chats = [];
    const chatInfo = [];
    Chat.find({from: user})
    .then(messages => {
        messages.forEach((chat) => Chats.push(chat));
        Chat.find({to:user})
        .then(messages => {
            messages.forEach((chat) => Chats.push(chat));
            Chats = Chats.sort((a, b) => (a._id > a._id) ? 1: ((b._id > a._id)?-1: 0));
            Chats.forEach((chat) => {
                if(!chatInfo.includes({from:chat.from}) && String(chat.from) !== String(user)) chatInfo.push({from:chat.from, id: chat._id, at: chat.createdAt});
            })
            res.json(chatInfo);
        })
    });
})

module.exports = router;
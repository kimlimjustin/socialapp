const User = require('../../models/User.model');
const Chat = require('../../models/Chat.model');

const sendMessage = ({message, from, to}) => {
    User.findOne({_id:from}, (err, user) => {
        if(err) return err;
        else if(!user) return null;
        else{
            User.findOne({_id: to}, (err, user) => {
                if(err) return err;
                else if(!user) return null;
                else{
                    const newChat = new Chat({chat:message, from, to})
                    newChat.save()
                    .then(() => {return newChat})
                    .catch(err => {return err});
                }
            })
        }
    })
}


module.exports = {sendMessage, Chat};
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const User = require('../models/User.model');
const Post = require('../models/Post.model');
const Comment = require('../models/Comment.model');

router.get('/get/:post/all', (req, res) => {
    Comment.find({commentTo: req.params.post})
    .then(comments => res.json(comments))
    .catch(err => res.status(400).json(err))
})

router.post('/add/', jsonParser, (req, res) => {
    User.findOne({_id: req.body.commenter}, (err, user) => {
        if(err) res.status(400).json("Error: "+err);
        else if(!user) res.status(403).json("User not found")
        else{
            Post.findOne({_id: req.body.post}, (err, post) => {
                if(err) res.status(400).json("Error: "+err);
                else if(!post) res.status(403).json("User not found")
                else{
                    const comment = new Comment({commenter: req.body.commenter, commentTo: req.body.post, comment: req.body.comment})
                    comment.save()
                    .then(() => res.json({message:"Comment added", info: comment}))
                    .catch(err => res.status(400).json(err))
                }
            })
        }
    })
})

router.delete('/comment/:comment', (req, res) => {
    Comment.findById(req.params.comment)
    .then(comment => {
        User.find({id: comment.commenter, token: req.body.token})
        .then(user => {
            if(!user) res.status(403).json("Permission denied.")
            else{
                comment.delete()
                .then(() => res.json("Comment deleted."))
                .catch(err => res.status(400).json(err));
            }
        })
    })
    .catch(err => res.status(400).json(err))
})

module.exports = router;
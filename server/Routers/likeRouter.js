const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const User = require('../models/User.model');
const Post = require('../models/Post.model');
const Like = require('../models/Like.model');

router.get('/get/:post/all', jsonParser, (req, res) =>{
    Like.find({likeTo: req.params.post})
    .then(likes => {
        res.json(likes)
    })
    .catch(() => res.status(500).json("None"))
})

router.post('/add/', jsonParser, (req, res) => {
    User.findOne({_id: req.body.liker}, (err, user) => {
        if(err) res.status(400).json("Error: "+err);
        else if(!user) res.status(403).json("User not found")
        else{
            Post.findOne({_id: req.body.post}, (err, post) => {
                if(err) res.status(400).json("Error: "+err);
                else if(!post) res.status(403).json("User not found")
                else{
                    Like.findOne({liker: req.body.liker, likeTo: req.body.post}, (err, like) => {
                        if(!like){
                            const newLike = new Like({liker: req.body.liker, likeTo : req.body.post })
                            newLike.save()
                            .then(() => res.json({message:"Like created.", "id": newLike._id}))
                            .catch(err => res.status(400).json("Error: "+err))
                        }
                        else{
                            res.status(500).json("Already liked.")
                        }
                    })
                }
            })
        }
    })
})

router.delete('/remove/:like', jsonParser, (req, res) => {
    Like.findById(req.params.like)
    .then(like => {
        like.delete()
        .then(() => res.json("Like deleted."))
    })
    .catch(err => res.status(400).json("Error: "+err))
})

module.exports = router;
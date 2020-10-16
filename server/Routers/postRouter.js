const express = require('express');
const router = express.Router();
const Post = require("../models/Post.model");
const User = require("../models/User.model");
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const fs = require('fs');

router.post("/create", jsonParser,(req, res)=> {
    const storage = multer.diskStorage({
        destination: "./public/",
        filename: function(req, file, cb){
           cb(null,"POST-IMAGE-" + Date.now() + path.extname(file.originalname));
        }
    });
    const upload = multer({
        storage: storage,
        limits: {fileSize: 1048576},
    }).single("image");

    upload(req, res, () => {
        if(!req.body.token) res.status(403);
        else{
            User.findOne({_id: req.body.user, token: req.body.token}, (err, user) => {
                if(err) res.status(400).json("Error: "+err);
                else if(!user) res.status(403).json("User not found")
                else{
                    const hashtags = req.body.hashtags.split(",");
                    const tags = req.body.tags.split(",")
                    const newPost = new Post({user: req.body.user, description: req.body.description, hashtags, tags, image: req.file})
                    newPost.save()
                    .then(() => res.json({message:"Post created.", id: newPost._id}))
                    .catch(err => res.status(400).json("Error: "+err))
                }
            });
        }
    })
})

router.get('/get/tagged/:user', (req, res) => {
    let tagged_list = []
    const user = req.params.user
    Post.find()
    .sort({_id: -1})
    .then(posts => {
        posts.forEach((post) => {
            if(post.tags.includes(user)){
                tagged_list.push(post)
            }
        })
        res.json(tagged_list);
    })
    .catch(err => res.status(400).json("Error: "+err));
})

router.get("/get/:user", (req, res)=> {
    const skip = req.query.skip && /^\d+$/.test(req.query.skip) ? Number(req.query.skip) : 0
    Post.find({user: req.params.user}, undefined, {skip, limit: 1}).sort({_id: -1})
    .then(result => res.json(result))
    .catch(err => res.status(400).json("Error: "+err));
})

router.get("/get/:user/all", (req, res) => {
    Post.find({user: req.params.user})
    .then(result => res.json(result))
    .catch(err => res.status(400).json("Error: "+err));
})

router.get("/:id", (req, res)=> {
    Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(400).json("Error: "+err));
})

router.post("/update/:id", jsonParser, (req, res)=> {
    Post.findById(req.params.id)
    .then(post => {
        if(!post) res.status(404).json("Post not found.")
        else{
            User.findById(post.user)
            .then(user => {
                if(!user) res.status(403).json("Permission denied.")
                else if(user.token !== req.body.token) res.status(403).json("Permission denied")
                else{
                    post.description = req.body.description;
                    post.tags = req.body.tags;
                    post.hashtags = req.body.hashtags;
                    post.save()
                    .then(()=> res.json("Post updated."))
                    .catch(err => res.status(400).json("Error: "+err));
                }
            })
        }
    })
    .catch(err => res.status(400).json("Error: "+err));
})

router.post("/delete/:id", jsonParser, (req, res)=> {
    Post.findById(req.params.id)
    .then(post => {
        if(!post) res.status(404).json("Post not found.");
        else{
            User.find({_id: post.user})
            .then(user => {
                if(!user) res.status(403).json("Permission denied.")
                else if(user.token === req.body.token) res.status(403).json("Permission denied.")
                else{
                    if(post.image){
                        fs.unlink(post.image.destination + post.image.filename, (err)=> {if(err) console.log(err)})
                    }
                    post.delete();
                    res.json("Post deleted.");
                }
            })
        }
    })
    .catch(err => res.status(400).json("Error: "+err));

})


module.exports = router;
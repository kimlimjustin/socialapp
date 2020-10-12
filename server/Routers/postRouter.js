const express = require('express');
const router = express.Router();
const Post = require("../models/Post.model");
const User = require("../models/User.model");
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

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
                    const newPost = new Post({user: req.body.user, description: req.body.description, hashtags: req.body.hashtags, tags: req.body.tags, image: req.file})
                    newPost.save()
                    .then(() => res.json("Post created."))
                    .catch(err => res.status(400).json("Error: "+err))
                }
            });
        }
    })

    /*const description = req.body.description;
    const user = req.body.user;
    const hashtags = req.body.hashtags;
    const tags = req.body.tags;
    const token = req.body.token;
    const image = req.body.image;
    if(!token) res.status(403).json("Permission denied.")
    else{
        User.findOne({_id: user, token}, (err, user) => {
            if(err) res.status(400).json("Error: "+err);
            else if(!user) res.status(403).json("User not found")
            else{
                const newPost = new Post({user, description, hashtags, tags, image})
                newPost.save()
                .then(() => res.json("Post created."))
                .catch(err => res.status(400).json("Error: "+err))
            }
        })
    }*/
})

router.get("/get/:user", (req, res)=> {
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
                    post.delete();
                    res.json("Post deleted.");
                }
            })
        }
    })
    .catch(err => res.status(400).json("Error: "+err));

})


module.exports = router;
const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const User = require("../models/User.model");
const Follow = require("../models/Follows.model");
const { json } = require("express");


router.post("/add", jsonParser, (req, res)=> {
    const follower = req.body.follower;
    const following = req.body.following;
    const token = req.body.token;
    User.findOne({_id: follower}, (err, user)=> {
        if(user.token !== token) res.status(403).json("Permission denied.")
        else{
            if(err) res.status(400).json("User not found.");
            else{
                User.findOne({_id: following}, (err, user)=> {
                    if(err) {res.status(400).json("User not found.")}
                    else{
                        const newFollow = Follow({"follower": follower, "following": following})
                        newFollow.save()
                        .then(() => res.json("Success"));
                        
                    }
                })
            }
        }
    })
})

router.get("/get", jsonParser, (req, res) => {
    const user = req.query.user;
    const result = {};
    Follow.find({follower: user}, (err, user)=> {
        if(err) res.status(400).json("User not found.");
        else result["following"] = user;
    })
    .then(() => {
        Follow.find({following: user}, (err, user)=> {
            if(err) res.status("400").json("User not found.");
            else result["follower"] = user;
            res.json(result);
        })
    })
})

router.post("/delete", jsonParser, (req, res)=> {
    const follower = req.body.follower;
    const following = req.body.following;
    const token = req.body.token;
    User.findOne({_id: follower, token: token}, (err, user)=> {
        if(err) res.status(403).json("Permission denied.")
        else{
            if(!user) res.status(400).json("User not found.")
            else{
                Follow.findOne({follower, following}, (err, follow)=> {
                    if(err) res.status(400).json("Error: "+err);
                    else{
                        follow.delete()
                        .then(()=>res.json("Success"))
                        .catch(err => res.status(400).json("Error: ")+err);
                    }
                })
            }
            
        }
    })
    .catch(err => res.status(400).json("Error: "+err));
})

module.exports = router;
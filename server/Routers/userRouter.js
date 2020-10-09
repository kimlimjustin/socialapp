const express = require("express");
const multer = require('multer');
const path = require('path');
const User = require('../models/User.model');
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const router = express.Router();
const fs = require('fs');

router.get('/', (req, res) => {
    User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json("Error" + err));
})

router.post('/register',jsonParser, (req, res)=>{
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const token = req.body.token;
    const newUser = new User({'username': username, 'password': password, "token":token, "email": email});
    newUser.save()
    .then(()=> res.json('User added!'))
    .then(err => res.status(400).json('Error: '+err));
})

router.post('/login', jsonParser, (req, res)=> {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({username: username}, (err, user)=>{
        if(err){
            res.status(400).json("Error: "+err);
        }
        if(user){
            user.comparePassword(password, (err, isMatch)=>{
                if(err){
                    res.status(400).json("Error: "+err);
                }
                if(isMatch){
                    res.json(user.token);
                }
                else{
                    res.status(400).json('Password not match');
                }
            })
        }else res.status(400).json("Error: "+err);
    }).catch(err => res.status(400).json("Error: " + err));
})

router.post('/profile_picture', jsonParser, (req, res)=> {
    const storage = multer.diskStorage({
        destination: "./public/",
        filename: function(req, file, cb){
           cb(null,"IMAGE-" + Date.now() + path.extname(file.originalname));
        }
    });

    const upload = multer({
        storage: storage,
        limits: {fileSize: 1000000},
    }).single("myfile")

    upload(req, res, () => {
        if(!req.body.token) res.status(403);
        User.findOne({token: req.body.token}, (err, user)=> {
            if(user.profile_picture) {
                fs.unlink(user.profile_picture.destination + user.profile_picture.filename,  (err)=> console.log(err))
            }
            if(err) res.status(400).json("Error: "+err);
            user.profile_picture = req.file;
            user.save();
            
        }).catch(err => res.status(400).json("Error: "+arr));
        res.json(req.file.filename);
    });

    
})

module.exports = router;
const express = require("express");
const multer = require('multer');
const path = require('path');
const User = require('../models/User.model');
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const router = express.Router();
const fs = require('fs');
const sharp = require('sharp');

router.get('/', (req, res) => {
    User.find()
    .sort({_id: -1})
    .then(users => res.json(users))
    .catch(err => res.status(400).json("Error" + err));
})

router.post('/register',jsonParser, (req, res)=>{
    const randomToken = require('random-token').create('@j1ijq&4u+t(a@8@7wv#)$fb!9ce#3+1azsi#6dc$0^d1g^svt');
    const token = randomToken(50);
    const username = req.body.username.toLowerCase();
    const password = req.body.password;
    const email = req.body.email;
    const newUser = new User({'username': username, 'password': password, "token":token, "email": email});
    newUser.save()
    .then(()=> res.json({"message": "User added!", "token":token}))
    .catch(()=> res.status(400).json("The username has been taken"))
})

router.post('/login', jsonParser, (req, res)=> {
    const username = req.body.username.toLowerCase();
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
                    const randomToken = require('random-token').create('@j1ijq&4u+t(a@8@7wv#)$fb!9ce#3+1azsi#6dc$0^d1g^svt');
                    const token = randomToken(50);
                    user.token = token;
                    user.save()
                    .then(() => res.json(token));
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
           cb(null,"PROFILE-PICTURE-" + Date.now() + path.extname(file.originalname));
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
                fs.unlink(user.profile_picture.destination + user.profile_picture.filename,  (err)=> {if(err)console.log(err)})
            }
            if(err) res.status(400).json("Error: "+err);
            const resize = async function(){
                await sharp(req.file.destination + req.file.filename)
                .resize(900, 900)
                .toBuffer((err, buffer) => fs.writeFile(req.file.destination + req.file.filename, buffer, (e) => {}))
            }
            resize()
            .then(result => user.profile_picture = req.file)
            .then(result => user.save())
            .then(result => res.json(req.file.filename))
        }).catch(err => res.status(400).json("Error: "+err));
    });
})

router.post('/profile', jsonParser, (req, res)=> {
    User.findOne({token: req.body.token}, (err, user)=> {
        if(err) res.status(400).json("Error: "+err);
        user.username = req.body.username;
        user.email = req.body.email;
        user.name = req.body.name;
        user.website = req.body.website;
        user.bio = req.body.bio;
        user.save()
        res.json("Profile saved")
    }).catch(err => res.status(400).json("Error: "+err));
})

router.get('/get_newest', (req, res) => {
    User.find()
    .sort({_id: -1})
    .limit(3)
    .then(users => res.json(users))
    .catch(err => res.status(400).json("Error: "+err));
})

router.post('/change_pass', jsonParser,(req, res) => {
    User.findOne({_id: req.body.user, token: req.body.token}, (err, user) => {
        if(err) res.status(400).json("Error: "+err);
        if(user){
            user.comparePassword(req.body.oldPassword, (err, isMatch) => {
                if(err) res.status(400).json("Error: "+err);
                else if(isMatch){
                    user.password = req.body.newPassword;
                    user.save()
                    .then(() => res.json("Password updated"))
                }
                else{
                    res.status(402).json("Old Password Doesn't match")
                }
            })
        }
        else{
            res.status(400).json("User not found")
        }
    })
})

module.exports = router;
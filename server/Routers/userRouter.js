const router = require('express').Router();
let User = require('../models/User.model');
const bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

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
    }).catch(err => res.status(400).json("Error" + err));
})
module.exports = router;
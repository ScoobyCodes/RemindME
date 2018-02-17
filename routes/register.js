const express = require('express');
const router = express.Router();
const bp = require('body-parser');
const passport = require('../Auth/passport.js');
const users = require('../Models/userdb').users;
const flash = require('connect-flash')
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.use(bp.urlencoded({extended: true}));
router.use(bp.json());
router.use(flash());

router.post('/',function(req,res,next) {
    users.findOne({
        where:{
            email:req.body.email
        }
    }).then(function(user){
        if(user){
            req.flash('signUpMessage','email already registered');
            res.send({message:req.flash('signUpMessage')});
        }
        else{
            bcrypt.hash(req.body.password, saltRounds).then(function(hash) {
                users.create({
                    fullname:req.body.fullname,
                    email:req.body.email,
                    passwordhash:hash,
                    dob:req.body.dob
                }).then(function(){
                    users.findOne({
                        where:{
                            email:req.body.email
                        }
                    }).then(function(user){
                        req.login(user,(err)=>{
                            res.send({redirect:'/private'});
                        })
                    }).catch(function(err){
                        throw err;
                    })
                }).catch(function(err){
                    throw err;
                })
            })
        }
    }).catch(function(err){
        throw err;
    })
})

module.exports = router;
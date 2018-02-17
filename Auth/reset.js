const express = require('express');
const path = require('path');
const users = require('../Models/userdb').users;
const Router = express.Router();
const async = require('async');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const saltRounds = 10;

Router.use('/:token',express.static(path.join(__dirname,"../public/ResetPassword")));

Router.get('/:token', function(req, res) {
    users.findOne({
        where:{
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        }
    }).then(function(user){
        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            res.redirect('/forgot');
        }
        res.redirect('/reset/'+req.params.token);
    })
});

Router.post('/:token', function(req, res) {
    async.waterfall([
        function(done){
            users.findOne({
                where:{
                    resetPasswordToken: req.params.token,
                    resetPasswordExpires: { $gt: Date.now() }
                }
            }).then(function(user){
                if (!user) {
                    req.flash('error', 'Password reset token is invalid or has expired.');
                    return res.send({message:req.flash('error')});
                }

                bcrypt.hash(req.body.password, saltRounds).then(function(hash) {
                    user.passwordhash = hash;
                    user.resetPasswordToken = null;
                    user.resetPasswordExpires = null;
                    user.save().then(function(){
                        req.login(user, function(err) {
                            if (err) { return next(err); }
                            return res.redirect('/private');
                        });
                    })

                })
            }).catch(function(err){
                done(err);
            })
        },
        function(user, done) {
            var smtpTransport = nodemailer.createTransport('SMTP', {
                service: "gmail",
                auth: {
                    user: "remindmecommunity@gmail.com",
                    pass: process.env.PASS
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'remindmecommunity@gmail.com',
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' +
                'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                req.flash('success', 'Success! Your password has been changed.');
                done(err);
            });
        }
    ], function(err) {
        if(err){
            throw err;
        }
    });
});

module.exports = Router;
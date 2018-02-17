const express = require('express');
const path = require('path');
const users = require('../Models/userdb').users;
const Router = express.Router();
const async = require('async');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

Router.use('/',express.static(path.join(__dirname,"../public/ForgotPassword/forgotPassword.html")));

Router.post('/', function(req, res, next) {
    async.waterfall([
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done) {

            users.findOne({
                    email:req.body.email
            }).then(function(user){
                if(!user){
                    req.flash('error', 'No account with that email address exists.');
                    return res.send({message:req.flash('error')});
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000;
                user.save().then(function(){
                    done(null, token, user);
                })
            }).catch(function(err){
                throw err;
            })
        },
        function(token, user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "remindmecommunity@gmail.com",
                    pass: process.env.PASS
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'remindmecommunity@gmail.com',
                subject: 'Reminde Me Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                done(err, 'done');
            });
        }
    ], function(err) {
        if (err) throw err;
        res.send({message:req.flash('info')})
    });
});

module.exports = Router;
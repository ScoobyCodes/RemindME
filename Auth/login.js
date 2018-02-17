const express = require('express');
const Router = express.Router();
const passport = require('./passport.js');


Router.post('/', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.send({message:req.flash('loginMessage')}); }
        req.login(user, function(err) {
            if (err) { return next(err); }
            return res.send({redirect:"/private"});
        });
    })(req, res, next);
});

module.exports = Router;
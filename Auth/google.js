const express = require('express');
const Router = express.Router();
const passport = require('passport');

Router.get('/',
    passport.authenticate('google', { scope: ['profile','email'] }));

Router.get('/callback',passport.authenticate('google', { failureRedirect: '/',
    successRedirect: '/private',
    failureFlash: true })
);

module.exports = Router;
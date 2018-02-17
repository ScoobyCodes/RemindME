const express = require('express');
const Router = express.Router();

Router.get('/',function(req,res){
    req.logout();
    res.redirect('/')
})

module.exports = Router;
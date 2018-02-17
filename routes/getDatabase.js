const express = require('express');
const Router = express.Router();
const users = require('../Models/userdb').users;
const dbData = require('../Models/userdb').userData;

Router.get('/datainfo',function(req,res){

    users.findAll({
        where : {
            id : req.user.id
        }
    }).then(function(database){
        res.send(database);
    }).catch(function(err){
        console.log(err);
    })
})

Router.get('/retrieveData',function(req,res){
    dbData.findOne({
        where: {
            userdbId : req.user.id
        }
    }).then(function(data){
        if(data != null) {
            res.send(data);
        }
    }).catch(function(err){
        console.log(err);
    })
})


Router.get('/retrievePieChart',function (req,res) {
    dbData.findOne({
        where : {
           userdbId : req.user.id
        }
    }).then(function(data){
        if(data != null) {
            res.send(data);
        }
    }).catch(function(err){
        console.log(err);
    })
})

Router.get('/numOfUsers',function (req, res) {
    users.count().then( function (data){
        if(data>=0)
            res.status(200).send(data.toString());
    }).catch(function (err) {
        console.log(err);
    })
})

module.exports = Router;
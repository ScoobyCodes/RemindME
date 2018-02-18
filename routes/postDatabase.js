const express = require('express');
const Router = express.Router();
const users = require('../Models/userdb').users;
const nodemailer = require('nodemailer');
const dbData = require('../Models/userdb').userData;

const MAX_TIME_FOR_LONG_MAIL = 2147482647;
const TIME_DEPRECIATED_FOR_LONG_MAIL = 864000000;

var timerIdListTask = [];


var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "remindmecommunity@gmail.com",
        pass: process.env.PASS
    }
});

Router.post('/storeDatabase',function(req,res) {
    dbData.findOne({
        where : {
            userdbId : req.user.id
        }
    }).then(function(database){
        if(database == null){
            dbData.create({
                userdbId: req.user.id,
                userListName: req.body.name,
                userListCounter: req.body.counterList,
                userListData: req.body.Tasks,
                userListTaskCounter: req.body.counter
            }).then(function () {
                res.send({success: true});
            })
        }
        else
            res.send({success: false});
    });
});

Router.post('/updateDatabase',function(req,res) {
    dbData.findOne({
        where:{
            userdbId : req.user.id
        }
    }).then(function (data) {
        data.update({
            userListName: req.body.name,
            userListCounter: req.body.counterList,
            userListData: req.body.Tasks,
            userListTaskCounter: req.body.counter
        }).then(function () {
            res.send({success: true});
        })
    })
})

Router.post('/updateTasks',function(req,res) {
    dbData.findOne({
        where:{
            userdbId : req.user.id
        }
    }).then(function (data) {
        data.update({
            userListTaskCounter: req.body.counterList,
            userListData: req.body.Tasks,
        }).then(function () {
            res.send({success: true});
        })
    })
})

Router.post('/sendMail',function(req,res) {
    var emailUser;
    users.findAll({
        where: {
            id: req.user.id
        }
    }).then(function (database) {
        emailUser = database[0].email;

        const arr = req.body.id.split('T');
        const listId = parseInt(arr[0]);
        const taskId = parseInt(arr[1]);

        if(timerIdListTask[req.user.id] == null) {
            timerIdListTask[req.user.id] = [];
        }

        if(timerIdListTask[req.user.id][listId] == null) {
            timerIdListTask[req.user.id][listId] = [];
        }

        timerIdListTask[req.user.id][listId][taskId] = setTimeout(function() {
            sendMail(listId, req, res, emailUser);
        },req.body.residualTime);
    })
});

Router.post('/deleteTimeOut',function(req,res){
    arr = req.body.id.split('T');
    arr[0] = parseInt(arr[0]);
    arr[1] = parseInt(arr[1]);

    if(timerIdListTask[req.user.id][arr[0]][arr[1]] != null) {
        clearTimeout(timerIdListTask[req.user.id][arr[0]][arr[1]]);
        clearInterval(timerIdListTask[req.user.id][arr[0]][arr[1]]);
        res.send({success : true});
    }else{
        res.send({success : false});
    }
})

Router.post('/sendLongMail',function(req,res) {
    const arr = req.body.id.split('T');
    const listId = parseInt(arr[0]);
    const taskId = parseInt(arr[1]);

    var emailUser;
    users.findAll({
        where: {
            id: req.user.id
        }
    }).then(function (database) {
        emailUser = database[0].email;
        var R_Time = parseInt(req.body.residualTime);
        if (timerIdListTask[req.user.id] == null) {
            timerIdListTask[req.user.id] = [];
        }
        if (timerIdListTask[req.user.id][listId] == null) {
            timerIdListTask[req.user.id][listId] = [];
        }

        timerIdListTask[req.user.id][listId][taskId] = setInterval(function () {
            if (R_Time - TIME_DEPRECIATED_FOR_LONG_MAIL < MAX_TIME_FOR_LONG_MAIL) {
                R_Time = R_Time - TIME_DEPRECIATED_FOR_LONG_MAIL;
                sendEmailForLong(req,res,R_Time,listId,taskId,emailUser)
            }
            R_Time = R_Time - TIME_DEPRECIATED_FOR_LONG_MAIL;
        }, TIME_DEPRECIATED_FOR_LONG_MAIL)
    })
})

Router.post('/updatePieChart',function (req,res) {
    dbData.findOne({
        where : {
            userdbId : req.user.id
        }
    }).then(function(data){
        data.update({
            TaskDoneCounter: req.body.doneTasks,
            TaskNotDoneCounter: req.body.pendingTasks
        }).then(function(){
            res.send({success: true});
        })
    }).catch(function (err) {
        console.log(err);
    })
})

function sendEmailForLong(req,res,R_Time,listId,taskId,emailUser){
    clearInterval(timerIdListTask[req.user.id][listId][taskId]);

    timerIdListTask[id][listId][taskId] = setTimeout(function() {
        sendMail(listId, req, res, emailUser);
    },R_Time);
}

function sendMail(listId,req,res,emailUser) {
    var mailOptions = {
        from: 'remindmecommunity@gmail.com',
        to: emailUser,
        subject: "REMINDER",
        text:  req.body.taskName
    }

    smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
            res.end("error");
        }
    });

    updateDatabases(req,res,listId);
}

function updateDatabases(req,res,listId) {
    dbData.findOne({
        where: {
            userdbId : req.user.id
        }
    }).then(function(data){
        counterList = JSON.parse(data.userListCounter);
        listTasks = JSON.parse(data.userListData);
        listName = JSON.parse(data.userListName);
        taskCounter = JSON.parse(data.userListTaskCounter);

        let listArrayIds = listName.map(x => x.id);
        let listSequenceId = listArrayIds.indexOf(listId);

        if (listSequenceId != -1) {
            let taskArrayIds = listTasks[listSequenceId].map(x => x.id);
            let taskSequenceId = taskArrayIds.indexOf(req.body.id);

            if (taskSequenceId != -1) {
                listTasks[listSequenceId].splice(taskSequenceId, 1);
                taskCounter[listSequenceId]--;
                listTasks = JSON.stringify(listTasks);
                taskCounter = JSON.stringify(taskCounter);
                pendingTasks = data.TaskNotDoneCounter--;
                completedTasks = data.TaskDoneCounter++;

                updateDatabase(res,data,listTasks,taskCounter,pendingTasks,completedTasks);
            }
            else
                res.send({success:false});
        }
        else
            res.send({success:false});
    }).catch(function(err){
        console.log(err);
    })
}

function updateDatabase(res,data,listTasks,taskCounter,pendingTasks,completedTasks) {
    data.update({
        userListData : listTasks,
        userListTaskCounter : taskCounter,
        TaskDoneCounter: completedTasks,
        TaskNotDoneCounter: pendingTasks
    }).then(function() {
        }).catch(function(err){
            console.log(err);
        })

        res.send({success:true})
}

module.exports = Router;
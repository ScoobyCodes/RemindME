function retrieveData() {

    $.get('/getdatabase/datainfo',function (data) {
        $('.usernameSideNav').html(`${data[0].fullname}`);
        $('.emailSideNav').html(`${data[0].email}`)
    })

    $.get('/getdatabase/retrieveData',function(data){
        if(data != null) {
            counterList = data.userListCounter;
            listName = JSON.parse(data.userListName)
            listTasks = JSON.parse(data.userListData);
            taskCounter = JSON.parse(data.userListTaskCounter);
            refreshSystem();
        }
    })

    $.get('/getdatabase/retrievePieChart',function (data) {
        if(data != null) {
            doneTasks=data.TaskDoneCounter;
            pendingTasks=data.TaskNotDoneCounter;
            refreshSystem()
        }
    })

    $.get('/getdatabase/numOfUsers',function (data) {
        if(data!=null && data>=0) {
            numOfUsers=parseInt(data);
            refreshSystem()
        }
    })
}
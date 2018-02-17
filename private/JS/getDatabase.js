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
        console.log(data);
        if(data != null) {
            done_tasks=data.TaskDoneCounter;
            pending_tasks=data.TaskNotDoneCounter;
            refreshSystem()
        }
    })

    $.get('/getdatabase/numOfUsers',function (data) {
        if(data!=null && data>=0) {
            num_of_users=parseInt(data);
            refreshSystem()
        }
    })
}
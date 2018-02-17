function storeData(a,b,c,d){
    $.post('/postdatabase/storeDatabase',{name : a,counter : b, Tasks : c, counterList: d},function(data){
        if(data.success == true) {
            refreshSystem();
        }
        else  {
            updateData(a,b,c,d);
        }
    });
}

function updateData(a,b,c,d) {
    $.post('/postdatabase/updateDatabase',{name : a,counter : b, Tasks : c, counterList: d},function(data){
        if(data.success != true) {
            console.log("Error");
        }
    });
    refreshSystem();
}

function updateTask(a,b){
    $.post('/postdatabase/updateTasks',{Tasks : a,counterList: b},function(data){
        if(data.success != true) {
          console.log("error");
        }
    })
}

function update_piechart(a,b){
    $.post('/postdatabase/updatePieChart',{ done_tasks: a,pending_tasks : b},function(data){
        if(data.success == true) {
            drawChart1();
            drawChart2();
        }
    });
}

function linkTimeTask(a) {
    if (a.sent == false) {
        a.sent = true;
        updateTask(JSON.stringify(listTasks),JSON.stringify(counterList));
        var correctFormatDate = correctFormat(a.date);

        var R_Time = createResidualTime(correctFormatDate, a.time);
        if (R_Time < 2147482647) {
            $.post('/postdatabase/sendMail', {taskName: a.task, residualTime: R_Time, id : a.id}, function (data) {
                if (data.success != true) {
                    console.log("Error");
                }
            })
        }
        else {
            $.post('/postdatabase/sendLongMail',{taskName : a.task, residualTime : R_Time , id:a.id},function(data){
                if(data.success != true) {
                    console.log("Error");
                }
            })
        }
    }
}

function deleteLinkTimeTask(a){
    $.post('/postdatabase/deleteTimeOut', {id: a.id}, function (data) {
        if (data.success != true) {
            console.log("error");
        }
    })
}
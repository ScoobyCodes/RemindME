var counterList = 0;
var listName = [];
var listTasks = [];
var taskCounter = [];
var pending_tasks = 0;
var done_tasks = 0;
var num_of_users=0;

$(function () {

    retrieveData();

    $('.addListBtn').click(function() {
        $('.listHeadingContent').css("display","none");
        $('.contentHomePage').css("display","block");
        listId = 0;
        flag = true;

        while(true){
            listId++;
            for(var i=0;i<counterList;i++){
                flag = true;
                if(parseInt(listName[i].id) == listId){
                    flag = false;
                    break;
                }
            }
            if(flag)
                break;
        }
        var listValue = $('.addList').val();
        listName[counterList] = {
            name : listValue,
            id : listId
        };
        taskCounter[counterList] = 0;
        listTasks[counterList] = [];
        counterList++;
        if(counterList == 1)
            storeData(JSON.stringify(listName),JSON.stringify(taskCounter),JSON.stringify(listTasks),counterList);
        else
            updateData(JSON.stringify(listName),JSON.stringify(taskCounter),JSON.stringify(listTasks),counterList);
    });

});


function showContentTask(a) {
    if (taskCounter[a - 1] == 0)
        $('.contentTask').css("display", "none");
    else {
        $('.contentTask').empty();

        for (let j in listTasks[a - 1]) {
            console.log(listTasks[a-1][j]);
            $('.contentTask').css("display","block");
            $('.contentTask').append(`    <li id="list${parseInt(a-1)+1}Task${parseInt(j)+1}">
             <div class="collapsible-header" style="background-color: #a1887f"><img class="brand-logo responsive-img" src="images/logo2.png" height="30" width="30">&nbsp; &nbsp; ${listTasks[a-1][j].task}
             <div style="position: absolute; right: 10px; cursor: pointer" id="deleteList${parseInt(a-1)+1}Task${parseInt(j)+1}"><i class="fa fa-times"></i></div></div>
             <div class="collapsible-body" style="background-color: white"><span><b>Date</b> : ${listTasks[a-1][j].date}</span><span style="float: right"><b>Time:</b> ${listTasks[a-1][j].time}</span></div>
            </li>
            `);
            linkTimeTask(listTasks[a-1][j],a-1,j);
            console.log("letse eee")
            $(`#deleteList${parseInt(a-1)+1}Task${parseInt(j)+1}`).click(function(){
                var workingId = jQuery(this).attr("id");
                let ListId = '';

                for (var j = 10; j < workingId.length; j++)
                {
                    if(isNaN(Number(workingId[j])))
                        break;
                    ListId += workingId[j];
                }
                let taskId = '';
                let k = workingId.length - 1;
                while(!isNaN(workingId[k])){
                    taskId += workingId[k];
                    k--;
                }
                taskId = reverseString(taskId);
                ListId = parseInt(ListId);
                taskId = parseInt(taskId);
                deleteLinkTimeTask(listTasks[ListId - 1][taskId -1 ]); //ONLY NEW ADDITION IN SHOW CONTENT TASK.
                listTasks[ListId - 1].splice(taskId - 1,1);
                taskCounter[ListId - 1]--;
                console.log(taskCounter[ListId-1]);
                showContentTask(ListId);
                updateTask(JSON.stringify(listTasks),JSON.stringify(taskCounter));
                pending_tasks--;
                update_piechart(done_tasks,pending_tasks);
            })
        }
    }
}

function refreshSystem() {
    $('.allLists').empty();

    for (var i in listName) {

        $('.allLists').append(`
                        <li id= "list${parseInt(i) + 1}"><a id = "listDelete${parseInt(i) + 1}" style="float: right; cursor: pointer"><i class="fa fa-times"></i></a><a href="#!"><i class="fa fa-list"  aria-hidden="true"></i>
                            ${listName[i].name}</a></li>`);
        showContentTask(parseInt(i) + 1);

        $(`#list${parseInt(i) + 1}`).click(function (event) {
            $('.contentHomePage').css("display", "none");
            var currentListId = jQuery(this).attr("id");
            $('.listHeadingContent').css("display", "block");

            let sequenceListId = '';
            for (var j = 4; j < currentListId.length; j++)
                sequenceListId += currentListId[j];

            sequenceListId = parseInt(sequenceListId);
            $('.listHeadingContent').children()[0].children[0].innerText = listName[sequenceListId - 1].name;
            $('.addTaskBtn').attr("id", "click" + sequenceListId);

            showContentTask(sequenceListId);

            var clickObject = document.getElementsByClassName('addTaskBtn');
            console.log(clickObject)
            clickObject[0].onclick = function (event) {
                var currentClickId = event.target.parentElement.id;
                // console.log(event.target.parent);
                let sequenceClickId = '';
                for (var j = 5; j < currentClickId.length; j++)
                    sequenceClickId += currentClickId[j];
                sequenceClickId = parseInt(sequenceClickId);
                console.log(sequenceClickId);
                if (validateFields(($('#taskAdder').val()), $('#DateAdder').val(), $('#TimeAdder').val())) {
                    //  console.log("2");
                    listTasks[sequenceClickId - 1][taskCounter[sequenceClickId - 1]] = new Task($('#taskAdder').val(), $('#DateAdder').val(), $('#TimeAdder').val());
                    console.log(listTasks);
                    listId = listName[sequenceClickId - 1].id
                    taskId = 0
                    flag = true;
                    while (true) {
                        taskId++;
                        flag = true
                        for (var i = 0; i < taskCounter[sequenceClickId - 1]; i++) {
                            var arr = listTasks[sequenceClickId - 1][i].id.split('T');
                            arr[1] = parseInt(arr[1])
                            if (arr[1] == taskId) {
                                flag = false;
                                break;
                            }
                        }
                        if (flag)
                            break;
                    }
                    listTasks[sequenceClickId - 1][taskCounter[sequenceClickId - 1]].id = String(listId) + "T" + String(taskId);
                    taskCounter[sequenceClickId - 1]++;
                    showContentTask(sequenceClickId);
                    updateTask(JSON.stringify(listTasks), JSON.stringify(taskCounter));
                    pending_tasks++
                    console.log("here are pending tasks " + pending_tasks);
                    update_piechart(done_tasks, pending_tasks)
                }
                //console.log(listTasks);

            };
        })


        $(`#listDelete${parseInt(i) + 1}`).click(function (event) {
            $('.listHeadingContent').css("display", "none");
            $('.contentHomePage').css("display", "block");
            var currentListId = jQuery(this).attr("id");
            let sequenceListId = '';
            for (var j = 10; j < currentListId.length; j++)
                sequenceListId += currentListId[j];
            sequenceListId = parseInt(sequenceListId);

            for(let k=0;k<taskCounter[sequenceListId-1];k++){
                deleteLinkTimeTask(listTasks[sequenceListId-1][k]);
            }
            //     console.log(sequenceListId);
            for (var i in listName) {
                if (i == sequenceListId - 1) {
                    listName.splice(i, 1);
                    counterList--;
                    listTasks.splice(i, 1);
                    pending_tasks -= taskCounter[i];
                    update_piechart(done_tasks, pending_tasks)
                    taskCounter.splice(i, 1);
                    break;
                }
            }
            //  console.log(listName);
            updateData(JSON.stringify(listName), JSON.stringify(taskCounter), JSON.stringify(listTasks), counterList);
            drawTable();

        })
    }

    $("#statistic_num1").html($(`<div><p id="statistic_num">${num_of_users}</p></div>`));
    $("#statistic_num1").css("font-size", "60px");
    $('#statistic_num1').each(function () {
        $(this).prop('Counter',0).animate({
            Counter: $(this).text()
        }, {
            duration: 100,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now));
            }
        });
    });

    $("#statistic_num2").html($(`<div><p id="statistic_num">${num_of_users}</p></div>`));
    $("#statistic_num2").css("font-size", "60px");
    $('#statistic_num2').each(function () {
        $(this).prop('Counter',0).animate({
            Counter: $(this).text()
        }, {
            duration: 100,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now));
            }
        });
    });

    printImpTasks();
}



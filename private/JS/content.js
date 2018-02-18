var counterList = 0;
var listName = [];
var listTasks = [];
var taskCounter = [];
var pendingTasks = 0;
var doneTasks = 0;
var numOfUsers=0;

$(function () {

    retrieveData();

    $('.addListBtn').click(function() {
        $('.listHeadingContent').css("display","none");
        $('.contentHomePage').css("display","block");
        let listId = 1;
        let idsArray = listName.map(x => x.id);
        for(var i=1;i<=counterList+1;i++) {
            if(!idsArray.includes(i)) {
                listId = i;
                break;
            }
        }

        var listValue = $('.addList').val();
        listName[counterList] = new list(listValue,listId);
        updateDataBaseThroughList();
    });

});


function showContentTask(a) {
    displaySupportedTask(a);
    for (let j in listTasks[a - 1]) {
        $('.contentTask').css("display", "block");
        $('.contentTask').append(createTaskElement(a, j));
        linkTimeTask(listTasks[a - 1][j]);

        $(`#deleteList${parseInt(a - 1) + 1}Task${parseInt(j) + 1}`).click(function () {
            let workingId = jQuery(this).attr("id");
            let listId = +workingId.substring(10,workingId.indexOf('T'));
            let taskId = +workingId.substring(workingId.indexOf('k')+1,workingId.length);
            deleteTaskAfterWards(listId,taskId)
        })
    }
}

function refreshSystem() {
    displaySupportedRefresh();
    for (var i in listName) {
        $('.allLists').append(createListElement(i));
        showContentTask(parseInt(i) + 1);
        settingListClickNav(i);
        settingDeleteListNav(i);
    }
    settingChartDisplays();
}

function updateDataBaseThroughList() {
    taskCounter[counterList] = 0;
    listTasks[counterList] = [];
    counterList++;

    if(counterList == 1)
        storeData(JSON.stringify(listName),JSON.stringify(taskCounter),JSON.stringify(listTasks),counterList);
    else
        updateData(JSON.stringify(listName),JSON.stringify(taskCounter),JSON.stringify(listTasks),counterList);
}

function deleteTaskAfterWards(listId,taskId) {
    deleteLinkTimeTask(listTasks[+listId - 1][+taskId - 1]);
    listTasks[+listId - 1].splice(+taskId - 1, 1);
    taskCounter[+listId - 1]--;
    console.log(taskCounter[+listId - 1]);
    showContentTask(+listId);
    updateTask(JSON.stringify(listTasks), JSON.stringify(taskCounter));
    pendingTasks--;
    update_piechart(doneTasks, pendingTasks);
}

function settingListClickNav(i) {
    $(`#list${parseInt(i) + 1}`).click(function (event) {

        let workingListId = jQuery(this).attr("id");
        let sequenceListId = +workingListId.substring(4,workingListId.length);
        displayListSelection(sequenceListId);
        showContentTask(sequenceListId);

        var clickObject = document.getElementsByClassName('addTaskBtn');
        clickObject[0].onclick = function (event) {
            let workingClickId = event.target.parentElement.id;
            let sequenceClickId = +workingClickId.substring(5,workingClickId.length);

            if (validateFields(($('#taskAdder').val()), $('#DateAdder').val(), $('#TimeAdder').val())) {

                let listId = listName[sequenceClickId - 1].id;
                let taskId = 1;

                let taskArrayId = (listTasks[sequenceClickId-1].map(x => x.id))
                    .map(x => +x.split('T')[1]);

                for(let itr=1;itr<=taskCounter[sequenceClickId-1]+1;itr++) {
                    if(!(taskArrayId.includes(itr))) {
                        taskId = itr;
                        break;
                    }
                }

                listTasks[sequenceClickId - 1][taskCounter[sequenceClickId - 1]]
                    = new Task($('#taskAdder').val(), $('#DateAdder').val(), $('#TimeAdder').val());
                listTasks[sequenceClickId - 1][taskCounter[sequenceClickId - 1]].id = String(listId) + "T" + String(taskId);
                console.log(listTasks[sequenceClickId - 1][taskCounter[sequenceClickId - 1]].id)
                taskCounter[sequenceClickId - 1]++;
                showContentTask(sequenceClickId);
                updateTask(JSON.stringify(listTasks), JSON.stringify(taskCounter));
                pendingTasks++;
                update_piechart(doneTasks, pendingTasks);
            }
        };
    })
}

function settingDeleteListNav(i) {

    $(`#listDelete${parseInt(i) + 1}`).click(function (event) {
        displayListDeletion();
        let workingListId = jQuery(this).attr("id");
        let sequenceListId = workingListId.substring(10,workingListId.length);

        for(let k=0;k<taskCounter[sequenceListId-1];k++){
            deleteLinkTimeTask(listTasks[sequenceListId-1][k]);
        }

        for (var i in listName) {
            if (i == sequenceListId - 1) {
                listName.splice(i, 1);
                counterList--;
                listTasks.splice(i, 1);
                pendingTasks -= taskCounter[i];
                update_piechart(doneTasks, pendingTasks)
                taskCounter.splice(i, 1);
                break;
            }
        }

        updateData(JSON.stringify(listName), JSON.stringify(taskCounter), JSON.stringify(listTasks), counterList);
        drawTable();
    })
}



function settingChartDisplays() {
    $("#statistic_num1").html($(`<div><p id="statistic_num">${numOfUsers}</p></div>`));
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

    $("#statistic_num2").html($(`<div><p id="statistic_num">${numOfUsers}</p></div>`));
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

function displayListDeletion() {
    $('.listHeadingContent').css("display", "none");
    $('.contentHomePage').css("display", "block");
}

function displayListSelection(id) {
    $('.contentHomePage').css("display", "none");
    $('.listHeadingContent').css("display", "block");
    $('.listHeadingContent').children()[0].children[0].innerText = listName[id - 1].name;
    $('.addTaskBtn').attr("id", "click" + id);
}

function displaySupportedRefresh() {
    $('.allLists').empty();
}

function displaySupportedTask(a) {
    if (taskCounter[a - 1] == 0)
        $('.contentTask').css("display", "none");
    else {
        $('.contentTask').empty();
    }
}
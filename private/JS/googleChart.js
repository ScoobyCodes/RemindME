$(function() {

    google.charts.load('current', {'packages':['corechart']});

    google.charts.load('current', {'packages':['table']});

    google.charts.setOnLoadCallback(drawChart1);
    google.charts.setOnLoadCallback(drawChart2);
    google.charts.setOnLoadCallback(drawTable);
});

function drawChart1() {

    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Task Type');
    data.addColumn('number', 'Count');
    data.addRows([
        ['Pending Tasks', pendingTasks],
        ['Completed Tasks', doneTasks]
    ]);

    var options = {'title':'YOUR TASK STATISTICS',
        'is3D':true,
        'width':500,
        'height':250,
        'backgroundColor': { fill:'transparent' },
        'sliceVisibilityThreshold': .0001
    };

    var chart1 = new google.visualization.PieChart(document.getElementById('chart_div1'));
    chart1.draw(data, options);
}

function cal_table_stats(name_of_list,task_in_lists) {
    e=[];
    for ( var i=0;i<name_of_list.length;i++) { e[i] = [name_of_list[i].name,task_in_lists[i]] }
    e.sort(function descc(a,b){return (b[1]-a[1])});
    f=[];
    for(var i=0; i<5 && i<e.length;i++){f[i]=e[i]}
    console.log("This  is F being returned");
    console.log(f);
    return f;
}

function drawChart2() {

    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Task Type');
    data.addColumn('number', 'Count');
    data.addRows([
        ['Pending Tasks', pendingTasks],
        ['Completed Tasks', doneTasks]
    ]);

    var options = {'title':'YOUR TASK STATISTICS',
        'is3D':true,
        'width':310,
        'height':250,
        'backgroundColor': { fill:'transparent' },
        'sliceVisibilityThreshold': .0001
    };

    var chart2 = new google.visualization.PieChart(document.getElementById('chart_div2'));
    chart2.draw(data, options);
}

function drawTable() {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'LIST NAMES WITH MOST TASKS');
    data.addColumn('number', 'COUNT IN DESC ORDER');
    data.addRows(cal_table_stats(listName,taskCounter));

    var table1 = new google.visualization.Table(document.getElementById('table_div1'));
    var table2 = new google.visualization.Table(document.getElementById('table_div2'));

    table1.draw(data, {showRowNumber: true, width: '100%', height: '100%'});
    table2.draw(data, {showRowNumber: true, width: '100%', height: '50%'});
}

function MyCompare(a,b) {
    var correctFormatDate1 = correctFormat(a.date);
    var t1 = createResidualTime(correctFormatDate1, a.tim);
    var correctFormatDate2 = correctFormat(b.date);
    var t2 = createResidualTime(correctFormatDate2, b.tim);

    return t1-t2;
}

function printImpTasks() {

    var arr = new Array();
    for(let x=0;x<listTasks.length;x++)
        for(let y=0;y<listTasks[x].length;y++)
            arr.push({msg:listTasks[x][y].task, date:listTasks[x][y].date, tim: listTasks[x][y].time});

    arr.sort(MyCompare);

    for(let i=1;i<=5 && i<=arr.length;i++) {
        $('#imp' + i).html($(`<span id="${i}"><b><u>TASK: </u></b>${arr[i - 1].msg}<br><b><u>DATE: </u></b>${arr[i - 1].date}
                              <br><b><u>TIME: </u></b>${arr[i-1].tim}</span>
        `));
    }
}
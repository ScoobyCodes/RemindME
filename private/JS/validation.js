function Task(a,b,c)
{
    this.task = a;
    this.date = b;
    this.time = c;
    this.sent = false;
    this.id = 0;
}

function validateFields(a,b,c) {
    if(a.length==0) {
        alert("Task Field Empty");
        return 0;
    }
    else {
        return validateTimeandDate(b,c);
    };
}

function list(name,id) {
    this.name = name;
    this.id = id;
}

function validateTimeandDate(date,time) {
    if(date.length != 8) {
        alert("Date is not in Valid Form")
        return 0;
    }

    var year = date.substring(6,8);
    if(year)
        date = date.substring(0,6);

    date += "20" + year;

    if(!checkTime(time))
        return 0;
    else {
        date = new Date(date);
        date = moment(date);
        if(!date.isValid()) {
            alert("Date not in valid Form");
            return 0;
        }
        else
            return checkForNegativeResidual(date,time);
    }
}

function checkForNegativeResidual(givenDate,givenTime){
    var currentTime = Date.now();

    currentTime  = new Date(currentTime);
    currentTime = moment(currentTime);
    currentTime = currentTime.tz("Asia/Kolkata")._d;

    currentTime = Date.parse(currentTime);

    givenDate = new Date(givenDate);
    givenDate = moment(givenDate);

    givenDate = moment(givenDate).add(1,'days')._d;
    givenDate.setUTCHours(0,0,0);

    givenDate = Date.parse(givenDate);

    var givenArray = givenTime.split(':');
    givenTime = givenArray[0]*60*60*1000 + givenArray[1]*60*1000;

    var residualTime = givenDate - currentTime + givenTime;

    if(residualTime > 0)
        return 1;
    else {
        alert("Current Time cannot be greater than GivenDateTime")
        return 0;
    }
}

function checkTime(time) {
    var arrayTime = time.split(':');
    arrayTime[0] = parseInt(arrayTime[0]);
    arrayTime[1] = parseInt(arrayTime[1]);

    if(arrayTime.length != 2 || !(0<=arrayTime[0]&&arrayTime[0]<=23) || !(0<=arrayTime[1]&&arrayTime[1]<=59)) {
        alert("Time is not in Proper Format");
        return 0;
    }
    return 1;
}

function reverseString(st) {
    var splitString = st.split("");
    var reverseArray = splitString.reverse();
    var joinString = reverseArray.join("");

    return joinString;
}

function correctFormat(date){
    var splitArray = date.split('/');
    splitArray[2] = "20" + splitArray[2];
    return splitArray.join('/');
}

function createResidualTime(date,time){
    var currentTime = Date.now();

    currentTime  = new Date(currentTime);
    currentTime = moment(currentTime);
    currentTime = currentTime.tz("Asia/Kolkata")._d;
    currentTime = Date.parse(currentTime);

    var givenDate = String(date);
    givenDate = new Date(givenDate);
    givenDate = moment(givenDate);
    givenDate = moment(givenDate).add(1,'days')._d;
    givenDate.setUTCHours(0,0,0);
    givenDate = Date.parse(givenDate);

    var givenTime = String(time);
    var givenArray = givenTime.split(':');
    givenTime = givenArray[0]*60*60*1000 + givenArray[1]*60*1000;

    var residualTime = givenDate - currentTime + givenTime;
    return residualTime;
}
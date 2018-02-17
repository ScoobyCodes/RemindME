$(function() {
    $('.homeImg').click(function(){
        window.location.reload();

        $('.listHeadingContent').css("display","none");
        $('.contentHomePage').css("display","block");
        retrieveData();
        drawTable();
        printImpTasks();
    });

    $('.listHeadingContent').css("display","none");

})
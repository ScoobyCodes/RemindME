
$(function() {
    $('.button-collapse').sideNav({
        menuWidth: 250,
        edge: 'left',
        closeOnClick: true,
        draggable: true,
        onOpen: function(el) {  },
        onClose: function(el) {  },
    });

    $('.button3-collapse').sideNav({
        menuWidth: 300,
        edge: 'left',
        closeOnClick: true,
        draggable: true,
        onOpen: function(el) {  },
        onClose: function(el) { },
    });

    $('.collapsible').collapsible();

    $('.dropdown-button').dropdown({
            constrainWidth: false,
            hover: true,
            gutter: 3,
            belowOrigin: true,
            alignment: 'right',
            stopPropagation: false
        }
    );

    $('.collapsible').collapsible();

    $('.modal').modal();

    $('.modalDemo').click(function() {
        $('#modal1').modal('open');
    });

    $(window).resize(function() {
        setHeight();
    });

    setHeight();
});


function setHeight() {
    windowHeight = $(window).innerHeight();
    $('.contentHomePage').css('min-height', windowHeight);
};
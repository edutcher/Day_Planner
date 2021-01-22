// grab jquery references to various components
const workDate = $('#workingDate');
const hours = $('.hour');
const calOvers = $('.calOver');
const titles = $(".eventTitle");

// global variables
var curHour = moment().hour();
var prevHour = moment().hour();
var allEvents = [];

// theme info
const themes = [{
    name: "beach",
    video: './assets/beach.mp4',
    color: "#00FFFF",
    modal: "./assets/beach2.jpg",
    sideImage: "./assets/beach3.jpg"
}, {
    name: "blossom",
    video: "./assets/blossom.mp4",
    color: "#ffb7c5",
    modal: "./assets/cherry3.jpg",
    sideImage: "./assets/cherry.jpg"
}, {
    name: "waterfall",
    video: "./assets/waterfall.mp4",
    color: "#00CED1",
    modal: "./assets/water1.jpg",
    sideImage: "./assets/water2.jpg"
}, {
    name: "enchanted",
    video: "./assets/enchanted.mp4",
    color: "#00c853",
    modal: "./assets/enchanted1.jpg",
    sideImage: "./assets/enchanted2.jpg"
}]

// Starts clock on page
function startClock() {
    var interval = setInterval(() => {
        if (moment().hour() > prevHour) {
            checkCalOverlays();
        }
        $('#clock').text(moment()._d.toLocaleTimeString());
        prevHour = moment().hour();
    }, 1000)
}

// places overlays on past hours, bolds current hour
function checkCalOverlays() {
    curHour = moment().hour();

    calOvers.each(function(i, el) {
        if ($(this).data("hour") < curHour) {
            $(this).addClass('calOverlay');
        } else {
            $(this).removeClass('calOverlay');
        }
    })

    hours.each(function(i, el) {
        if ($(this).data("hour") === curHour) {
            $(this).css('font-size', '18px');
            $(this).css('font-weight', 'bold');
        } else {
            $(this).css('font-size', '14px');
            $(this).css('font-weight', 'normal');
        }
    })
}

// loads overlays and events to calendar
function loadCal() {
    checkCalOverlays()


    if (localStorage.getItem("allEvents") === null) {

        titles.text('');
        hours.data('event', false);
        calOvers.data('event', false);
        titles.data('event', false);
        titles.removeClass('eventStyle');
        return
    }

    allEvents = JSON.parse(localStorage.getItem("allEvents"));

    for (var i = 0; i < allEvents.length; i++) {
        var hour = (parseInt(allEvents[i].time) - 9);
        $(".eventTitle").eq(hour).text(allEvents[i].title);
        $('.hour').eq(hour).data('event', true);
        $('.calOver').eq(hour).data('event', true);
        $('.eventTitle').eq(hour).data('event', true);
        $('.eventTitle').eq(hour).addClass('eventStyle');
    }
}

// saves new event to array and pushes to local storage
function saveEvent() {

    var newEvent = {
        time: $("#hourSel").val(),
        title: $("#titleInput").val(),
        desc: $("#eventDesc").val()
    };

    allEvents.push(newEvent);

    localStorage.setItem("allEvents", JSON.stringify(allEvents));

    $("#titleInput").val("");
    $("#eventDesc").val("");

    M.toast({ html: 'Saved!' });
    loadCal();
}

// deletes an event from the array and localstorage
function delEvent() {

    var eventHour = ($('#hourSel').val() - 9);

    for (var i = 0; i < allEvents.length; i++) {
        if (allEvents[i].time == (eventHour + 9)) {
            allEvents.splice(i, 1);
        }
    }

    localStorage.setItem("allEvents", JSON.stringify(allEvents));

    M.toast({ html: 'Deleted!' });

    titles.eq(eventHour).text('');
    hours.eq(eventHour).data('event', false);
    calOvers.eq(eventHour).data('event', false);
    titles.eq(eventHour).data('event', false);
    titles.eq(eventHour).removeClass('eventStyle');

    loadCal();
}

// change theme to chosen theme
function setTheme() {
    var root = document.documentElement;
    $('#backVid').animate({ 'opacity': 0 })

    setTimeout(function() {
        $('#backVid').attr('src', themes[curTheme].video)
    }, 350)


    setTimeout(function() {
        $('#modalImg').attr('src', themes[curTheme].modal);
        root.style.setProperty('--theme-color', themes[curTheme].color);
        $('#backVid').animate({ 'opacity': 1 });
        $('#sidebarImage').attr('src', themes[curTheme].sideImage);
    }, 400)
}

// when the page has finished loading, initialize all components, add event listeners, start the clock, and load the calendar
$(document).ready(function() {
    var side = document.querySelector('.sidenav');
    var sideBar = M.Sidenav.init(side);
    var mod = document.querySelectorAll('.modal');
    var modal = M.Modal.init(mod);
    var sel = document.querySelectorAll('select');
    var select = M.FormSelect.init(sel);

    hours.each(function(i, el) {
        $(this).data("hour", i + 9);
    })

    calOvers.each(function(i, el) {
        $(this).data("hour", i + 9);
    })

    titles.each(function(i, el) {
        $(this).data("hour", i + 9);
    })

    $('#clock').text(moment()._d.toLocaleTimeString());

    $('.sidenav').sidenav();

    $('.tooltipped').tooltip();

    $('.modal').modal();

    $('select').formSelect();

    $("#calBtn").click(() => {
        if (sideBar.isOpen) {
            sideBar.close();
        } else {
            loadCal();
            sideBar.open()
        }
    })

    $('#themeBtn').click(() => {

        if (curTheme < themes.length - 1) {
            curTheme++;
        } else {
            curTheme = 0;
        }

        localStorage.setItem("curTheme", curTheme);

        setTheme();
    })

    $(".modal-trigger").click(function() {
        var sel = document.querySelectorAll('select');

        $('#hourSel').find('option:selected').removeAttr('selected');

        var ind2 = $(this).data("hour");

        $($('option').get(ind2 - 9)).attr('selected', 'selected');

        M.FormSelect.init(sel);

        if ($(this).data('event') == true) {

            for (var i = 0; i < allEvents.length; i++) {
                if (allEvents[i].time == $(this).data('hour')) {
                    $('#eventHead').text('Edit Event');
                    $("#titleLabel").addClass('active');
                    $("#titleInput").val(allEvents[i].title);
                    $("#descLabel").addClass('active');
                    $("#eventDesc").val(allEvents[i].desc);
                    $('#delBtn').removeClass('hidden');
                }
            }

        } else {
            $('#eventHead').text('Add Event');
            $("#titleInput").val("");
            $("#eventDesc").val("");
            $('#delBtn').addClass('hidden');
            $("#descLabel").removeClass('active');
            $("#titleLabel").removeClass('active');
        }
    })

    if (localStorage.getItem("curTheme") != null) {
        curTheme = localStorage.getItem("curTheme");
        setTheme();
    } else {
        curTheme = 1;
    }

    workDate.text(moment()._d.toDateString())
    startClock();
    checkCalOverlays()
    loadCal();
});
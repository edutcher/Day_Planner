const workDate = $('#workingDate');
const hours = $('.hour');
const calOvers = $('.calOver');
const titles = $(".eventTitle");


var curHour = moment().hour();
var prevHour = moment().hour();
var allEvents = [];

if (localStorage.getItem("allEvents") == null) {
    localStorage.setItem("allEvents", JSON.stringify(allEvents));
}

var curTheme = 1;

const themes = [{
    name: "beach",
    video: './assets/beach.mp4',
    color: "#00FFFF",
    modal: "url(./assets/beach2.jpg)",
    sideImage: "./assets/beach3.jpg"
}, {
    name: "blossom",
    video: "./assets/blossom.mp4",
    color: "#ffb7c5",
    modal: "url(./assets/cherry3.jpg)",
    sideImage: "./assets/cherry.jpg"
}, {
    name: "waterfall",
    video: "./assets/waterfall.mp4",
    color: "#00CED1",
    modal: "url(./assets/water1.jpg)",
    sideImage: "./assets/water2.jpg"
}, {
    name: "enchanted",
    video: "./assets/enchanted.mp4",
    color: "#00c853",
    modal: "url(./assets/enchanted1.jpg)",
    sideImage: "./assets/enchanted2.jpg"
}]

function startClock() {
    var interval = setInterval(() => {
        if (moment().hour() > prevHour) {
            checkCalOverlays();
        }
        $('#clock').text(moment()._d.toLocaleTimeString());
        prevHour = moment().hour();
    }, 1000)
}

function checkCalOverlays() {
    curHour = moment().hour();
    //curHour = 12;

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

function loadCal() {
    checkCalOverlays()


    if (localStorage.getItem("allEvents") === null) {
        for (var i = 0; i <= 9; i++) {
            $(".eventTitle")[i].textContent = '';
            $('.hour')[i].dataset.hasEvent = 'false';
            $('.calOver')[i].dataset.hasEvent = 'false';
            $('.eventTitle')[i].dataset.hasEvent = 'false';
            $('.eventTitle')[i].classList.remove('eventStyle');
        }
        return
    }

    allEvents = JSON.parse(localStorage.getItem("allEvents"));

    for (var i = 0; i < allEvents.length; i++) {
        var hour = parseInt(allEvents[i].time);
        $(".eventTitle")[hour - 9].textContent = allEvents[i].title;
        $('.hour')[hour - 9].dataset.hasEvent = 'true';
        $('.calOver')[hour - 9].dataset.hasEvent = 'true';
        $('.eventTitle')[hour - 9].dataset.hasEvent = 'true';
        $('.eventTitle')[hour - 9].classList.add('eventStyle');
    }
}

function saveEvent() {

    var newEvent = {
        time: $("#hourSel").val(),
        title: $("#titleInput").val(),
        desc: $("#eventDesc").val()
    }

    allEvents.push(newEvent);

    localStorage.setItem("allEvents", JSON.stringify(allEvents));

    $("#titleInput").val("");
    $("#eventDesc").val("");

    loadCal();
}

function delEvent() {

    var eventHour = $('#hourSel').val();

    for (var i = 0; i < allEvents.length; i++) {
        if (allEvents[i].time == eventHour) {
            allEvents.splice(i, 1);
        }
    }

    localStorage.setItem("allEvents", JSON.stringify(allEvents));

    $(".eventTitle")[eventHour - 9].textContent = '';
    $('.hour')[eventHour - 9].dataset.hasEvent = 'false';
    $('.calOver')[eventHour - 9].dataset.hasEvent = 'false';
    $('.eventTitle')[eventHour - 9].dataset.hasEvent = 'false';
    $('.eventTitle')[eventHour - 9].classList.remove('eventStyle');

    loadCal();
}

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
        var root = document.documentElement;
        if (curTheme < themes.length - 1) {
            curTheme++;
        } else {
            curTheme = 0;
        }

        $('#backVid').animate({ 'opacity': 0 })

        setTimeout(function() {
            $('#backVid').attr('src', themes[curTheme].video)
        }, 350)


        setTimeout(function() {
            $('.modal').css('background-image', themes[curTheme].modal);
            root.style.setProperty('--theme-color', themes[curTheme].color);
            $('#backVid').animate({ 'opacity': 1 });
            $('#sidebarImage').attr('src', themes[curTheme].sideImage);
        }, 400)
    })

    $(".modal-trigger").click(function() {
        var sel = document.querySelectorAll('select');
        $("#titleInput").val("");
        $("#eventDesc").val("");
        $('#delBtn').addClass('hidden');
        $("#descLabel").removeClass('active');
        $("#titleLabel").removeClass('active');

        $('#hourSel').find('option:selected').removeAttr('selected');

        var ind2 = $(this).data("hour");

        $($('option').get(ind2 - 9)).attr('selected', 'selected');

        M.FormSelect.init(sel);

        if (this.dataset.hasEvent == "true") {

            for (var i = 0; i < allEvents.length; i++) {
                if (allEvents[i].time == this.dataset.hour) {
                    $("#titleLabel").addClass('active');
                    $("#titleInput").val(allEvents[i].title);
                    $("#descLabel").addClass('active');
                    $("#eventDesc").val(allEvents[i].desc);
                    $('#delBtn').removeClass('hidden');
                }
            }

        }
    })

    workDate.text(moment()._d.toDateString())
    startClock();
    checkCalOverlays()
    loadCal();
});
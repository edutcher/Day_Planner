const workDate = $('#workingDate');

var curHour = moment().hour();
var prevHour = moment().hour();
var allEvents = [];


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

    if ((curHour >= 9) && (curHour <= 17)) {
        for (var i = 9; i <= 17; i++) {
            if (curHour > i) {
                $('.calOver')[i - 9].classList.add('calOverlay');
            } else {
                $('.calOver')[i - 9].classList.remove('calOverlay');
            }
            if (curHour === i) {
                $('.hour')[i - 9].style.fontSize = '18px';
                $('.hour')[i - 9].style.fontWeight = 'bold';
            } else {
                $('.hour')[i - 9].style.fontSize = '14px';
                $('.hour')[i - 9].style.fontWeight = 'normal';
            }
        }
    } else if (curHour > 17) {
        for (var i = 9; i <= 17; i++) {
            $('.hour')[i - 9].style.fontSize = '14px';
            $('.hour')[i - 9].style.fontWeight = 'normal';
            $('.calOver')[i - 9].classList.add('calOverlay');
        }
    } else {
        for (var i = 9; i <= 17; i++) {
            $('.hour')[i - 9].style.fontSize = '14px';
            $('.hour')[i - 9].style.fontWeight = 'normal';
            $('.calOver')[i - 9].classList.remove('calOverlay');
        }
    }
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

    console.log('huh?');

    var eventHour = $('#hourSel').val();

    for (var i = 0; i < allEvents.length; i++) {
        if (allEvents[i].time == eventHour) {
            allEvents.splice(i, 1);
        }
    }

    console.log(allEvents);

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

    $(".modal-trigger").click(function() {
        var sel = document.querySelectorAll('select');
        $("#titleInput").val("");
        $("#eventDesc").val("");
        $('#delBtn').addClass('hidden');
        $("#descLabel").removeClass('active');
        $("#titleLabel").removeClass('active');

        $('#hourSel').find('option:selected').removeAttr('selected');

        var ind = this.dataset.hour;

        var opt = document.getElementById("sel" + ind);

        opt.setAttribute('selected', 'selected');

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
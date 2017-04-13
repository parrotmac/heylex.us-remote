var haveInitializedAnnyang = false;

var serviceUrl = window.location.origin;

var socket = io(serviceUrl);

var sendRequest = function(message) {
    console.log("Requesting: ", message);
    socket.emit('client-request', message);
}

var RS = {
    remoteStartOff: function() {
        sendRequest("remote-start:engine:off");
    },
    remoteStartOn: function() {
        sendRequest("remote-start:engine:on");
        Materialize.toast('Requesting engine start...', 2000);
    },
    remoteStartTime: function (duration) {
        sendRequest("remote-start:engine:duration:" + duration);
    },
    remoteStartLock: function() {
        sendRequest("remote-start:security:lock");
        Materialize.toast('Requesting doors to lock', 2000);
    },
    remoteStartUnlock: function() {
        sendRequest("remote-start:security:unlock");
        Materialize.toast('Requesting doors to unlock', 2000);
    },
    remoteStartTrunk: function() {
        sendRequest("remote-start:security:trunk");
    },
    remoteStartParty: function() {
        sendRequest("remote-start:party");
    },
}
                                  
var initAnnyang = function() {

    if (annyang) {
        // Let's define our first command. First the text we expect, and then the function it should call
        var annyangCommands = {
          
            // # RS ON Commands
            'Jarvis start (the)(my) engine': function () {
                RS.remoteStartOn();
            },
            'Jarvis remote start': function () {
                RS.remoteStartOn();
            },
            'Jarvis (remote) start for *duration minutes': function (duration) {
                RS.remoteStartTime(duration);
            },

            // # RS OFF Commands
            'Jarvis stop (the)(my) engine': function () {
                RS.remoteStartOff();
            },
            'Jarvis kill (the)(my) engine': function () {
                RS.remoteStartOff();
            },
            'Jarvis shutdown (the)(my) engine': function () {
                RS.remoteStartOff();
            },

            // # RS Security Commands
            'Jarvis unlock (the)(my) doors': function () {
                RS.remoteStartUnlock();
            },
            'Jarvis lock (the)(my) doors': function () {
                RS.remoteStartLock();
            },

            'Jarvis open (the)(my) trunk': function () {
                RS.remoteStartTrunk();
            },
            'Jarvis pop (the)(my) trunk': function () {
                RS.remoteStartTrunk();
            },

            ':nomatch': function (message) {
                // recognized(message);
                Materialize.toast('Sorry, I don\'t understand this action', 1000);
            }
        };

        // Add our commands to annyang
        annyang.addCommands(annyangCommands);

        // Start listening. You can call this here, or attach this call to an event, button, etc.
        annyang.start();
    }

    annyang.addCallback('error', function () {
        console.error("annyang had an issue -- quietly ignoring");
    });
}

socket.on('connect', function(){
    console.log("Connected");
    if(!haveInitializedAnnyang) {
        initAnnyang();
        console.log("Annyang initialized");
    }
});


socket.on('client-notify-confirm', function(data){
    Materialize.toast("Confirmed action " + data.action, 1000);
});


socket.on('client-notify-error', function(data){
    Materialize.toast("Action " + data.requestedAction + " failed. (Error: " + data.reason + ")", 5000);
});

socket.on('client-command', function(data){
    console.log("We're supposed to ", data);
});

socket.on('client-notification', function(data){
    Materialize.toast(data, 4000);
});
socket.on('disconnect', function(){
    console.log("Disconnected");
});

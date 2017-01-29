/**
 * Created by HiTech_OWC_B on 26.01.2017.
 */
$(document).ready(function(){
    //console.log('ready');
});

var localConnection;
var remoteConnection;

var signalingpacket = new function() {
    this.sdp = "-";
    this.type = "-"; //offer, answer
    this.getThisJSONStr = function () {
        return JSON.stringify(this);
    };
};


var WS_conn = new WebSocket('ws://webrtc.cn:8080');
WS_conn.onopen = function(e) {
    console.log("WS Connection established!");
};

WS_conn.onmessage = function(e) {
    console.log(e.data);
    var e2 = JSON.parse(e.data); //e.data; // //new Object();
    if (e2.type === 'offer') {
        trace('we get an OFFER!!!');
        //localConnection.setRemoteDescription(new RTCSessionDescription((e2.sdp), function (){trace('success setremotedesc')}, function (){trace('error setremotedesc')}));
        //createAnswer();

        remoteConnection.createAnswer().then(
            function(answer){
                remoteConnection.setRemoteDescription(new RTCSessionDescription((e2.sdp), function (){trace('success setremotedesc')}, function (){trace('error setremotedesc')}));


                trace('answer created successfully!');
                signalingpacket.type = 'answer';
                signalingpacket.sdp = answer;
            },
            onCreateSessionDescriptionError
        );


    }
    else if (e2.type === 'answer') {
        trace('we get an ANSWER!!!');
        localConnection.setLocalDescription(e2.sdp);
    }
    else if (e2.type === 'candidate') {
        trace('we get an IceCandidate!!!');
        var candidate = new IceCandidate({sdpMLineIndex: e2.label, candidate: e2.candidate});
        pc.addIceCandidate(candidate);
    }
};





//alert(signalingpacket.getObj());

trace = function (data) {
    console.log(data);
    $('#rtc').html($('#rtc').html() + '<br>' + data);
};
var servers = null;
pcConstraint = null;

//bytesToSend = Math.round(megsToSend.value) * 1024 * 1024;

// Add localConnection to global scope to make it visible
// from the browser console.
window.localConnection = localConnection = new webkitRTCPeerConnection(servers, pcConstraint);
trace('Created local peer connection object localConnection');


//var remoteConnection;
window.remoteConnection = remoteConnection = new webkitRTCPeerConnection(servers, pcConstraint);
trace('Created remote peer connection object remoteConnection');


localConnection.createOffer().then(
    gotDescription1,
    onCreateSessionDescriptionError
);

function gotDescription1(desc) {
    //trace('EMPTY Offer from localConnection \n' + desc.sdp);
    localConnection.setLocalDescription(desc);
    trace('Offer from localConnection \n' + desc.sdp);
    signalingpacket.sdp = desc;
    signalingpacket.type = 'offer';

    trace('sending via websockets...');
    WS_conn.send(signalingpacket.getThisJSONStr());

    //trace(desc);
    /*remoteConnection.setRemoteDescription(desc);
    remoteConnection.createAnswer().then(
        gotDescription2,
        onCreateSessionDescriptionError
    );*/
}

function onCreateSessionDescriptionError(error) {
    trace('Failed to create session description: ' + error.toString());
}



/*
servers =  { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };
var pc = new webkitRTCPeerConnection(servers,
    {optional: [{RtpDataChannels: true}]});

pc.ondatachannel = function(event) {
    console.log('on channel');
    receiveChannel = event.channel;
    receiveChannel.onmessage = function(event){
        document.querySelector("div#receive").innerHTML = event.data;
    };
};

sendChannel = pc.createDataChannel("sendDataChannel", {reliable: false});

document.querySelector("button#send").onclick = function (){
    var data = document.querySelector("textarea#send2").value;
    sendChannel.send(data);
    console.log('sending:' + data);
};*/
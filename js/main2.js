/**
 * Created by Lime on 28.01.2017.
 */
'use strict';
$(document).ready(function(){
    trace('send btn binded');
    $('#send').on('click', function(){
        if (sendChannel == null) receiveChannel.send($('#send2').val());
        if (sendChannel != null) sendChannel.send($('#send2').val());
        $('#send2').val('').focus();
    });


    $('#makecon').on('click', function(){
        MakeConn();
    });
});

function trace(arg) {
    var now = (window.performance.now() / 1000).toFixed(3);
    console.log(now + ': ', arg);
}
trace = console.log;


var localConnection;
var remoteConnection;
var local_offer_stringified;
var servers = null;
//servers = { "iceServers": [{ "urls": "stun:stun.example.org" }] };
var pcConstraint = null; //its 1?
//its 2
var constraints = window.constraints = {
    audio: true,
    video: {width: {exact: 320}, height: {exact: 240}}
};
//its 3d
var qvgaConstraints = {
    video: {width: {exact: 320}, height: {exact: 240}}
};
var sendChannel = null;
var receiveChannel = null;
var dataConstraint = null;




window.remoteConnection = remoteConnection = new RTCPeerConnection(servers, pcConstraint);
trace('Created remote peer connection object remoteConnection');

function MakeConn(){

    //1. Alice creates an RTCPeerConnection object.
    window.localConnection = localConnection = new RTCPeerConnection(servers, pcConstraint);
    trace('Created local peer connection object localConnection');

    sendChannel = localConnection.createDataChannel('sendDataChannel', dataConstraint);
    trace('Created send data channel on localConnection');
    sendChannel.onmessage = onReceiveMessageCallback;
    trace('Added onrecievemessage callback to sendChannel');

    navigator.mediaDevices.getUserMedia(constraints)
        .then(handlegetUserMediaSuccess).catch(handlegetUserMediaError);




}

function MakeStep2()
{
    //2. Alice creates an offer (an SDP session description)
// with the RTCPeerConnection createOffer() method.
    localConnection.createOffer().then(
        onSuccessOfferCreation,
        onCreateSessionDescriptionError
    );

    localConnection.onicecandidate = function(e) {
        onIceCandidate(localConnection, e);
    };
}

var WS_conn = new WebSocket('ws://' + window.location.host + ':8080'); //'ws://webrtc.cn:8080'
WS_conn.onopen = function(e) {
    trace("WS Connection established!");


};
WS_conn.onmessage = function(e) {
    //console.log(e.data);
    var e2 = JSON.parse(e.data); //e.data; // //new Object();
    if (e2.type === 'offer') {
        trace('we get an OFFER!!!');

        //sendChannel = remoteConnection.createDataChannel('sendDataChannel', dataConstraint);
        //trace('Created send data channel on remoteConnection');

        //v2
        //new RTCSessionDescription(e2)

        //5.Eve calls setRemoteDescription() with Alice's offer, so that her
        // RTCPeerConnection knows about Alice's setup.

        remoteConnection.onicecandidate = function(e) {
            onIceCandidate(remoteConnection, e);
        };
        remoteConnection.ondatachannel = receiveChannelCallback;
        remoteConnection.onaddstream = gotRemoteStream;

        remoteConnection.setRemoteDescription(new RTCSessionDescription(e2),
            function (){
                trace('success setremotedesc');
            },
            function (error){
                trace('error setremotedesc' + error);
            });
        //6. Eve calls createAnswer(), and the success callback for this is passed a local
        // session description: Eve's answer.
        remoteConnection.createAnswer().then(
            OnSuccessCreateAnswerToOffer,
            onCreateSessionDescriptionError
        );
    }
    else if (e2.type === 'answer') {
        trace('we get an ANSWER!!!');
        localConnection.setRemoteDescription(e2);
    }
    else if (e2.type === 'candidate') {

        var candidate = new RTCIceCandidate({sdpMLineIndex: e2.sdpMLineIndex, candidate: e2.candidate});

        trace('WE GET an IceCandidate!!!' + e2.candidate);
        remoteConnection.addIceCandidate(e2.candidate).then(
            function() {
                onAddIceCandidateSuccess(remoteConnection);
            },
            function(err) {
                onAddIceCandidateError(remoteConnection, err);
            }
        );
    }
};


function OnSuccessCreateAnswerToOffer(_answer) {
    //7
    remoteConnection.setLocalDescription(_answer);
    //8
    WS_conn.send(JSON.stringify(_answer));
    //trace('Answer from remoteConnection \n' + _answer.sdp);
    //localConnection.setRemoteDescription(_answer);
}

function onCreateSessionDescriptionError(error) {
    trace('Failed to create session description: ' + error.toString());
}

function onSuccessOfferCreation(_offer) {
    //3. Alice calls setLocalDescription() with his offer.
    localConnection.setLocalDescription(_offer);
    trace('Offer from localConnection \n' + JSON.stringify(_offer));


    trace('serializing, sending via websockets...');
    //4. Alice stringifies the offer and uses a signaling mechanism to send it to Eve.
    local_offer_stringified = JSON.stringify(_offer);
    WS_conn.send(local_offer_stringified);
    trace('offer was sent via websockets.');
}

function receiveChannelCallback(event) {
    trace('Receive Channel Callback');
    receiveChannel = event.channel;
    //sendChannel = event.channel;
    receiveChannel.onmessage = onReceiveMessageCallback;

    //receiveChannel.onopen = onReceiveChannelStateChange;
    //receiveChannel.onclose = onReceiveChannelStateChange;
}

function onReceiveMessageCallback(event) {
    trace('Received Message');
    //dataChannelReceive.value = event.data;
    $('#receive').append('<span><span style="color: red;">someone:</span> '+event.data+'</span><br>');
}

function onIceCandidate(pc, event) {

    trace(getName(pc) + ' ICE candidate: \n' + (event.candidate ?
            event.candidate.candidate : '(null)'));
    if (event.candidate == null)
                return;

    trace('sending candidate via websockets...');
    //WS_conn.send(JSON.stringify(event.candidate));
    WS_conn.send(JSON.stringify({
        'type': 'candidate',
        'candidate': event.candidate
    }));
    trace('candidate sent');
    //trace('ice event?' + event.candidate);
    /*getOtherPc(pc).addIceCandidate(event.candidate)
        .then(
            function() {
                onAddIceCandidateSuccess(pc);
            },
            function(err) {
                onAddIceCandidateError(pc, err);
            }
        );*/

}

function onAddIceCandidateSuccess() {
    trace('AddIceCandidate success.');
}

function onAddIceCandidateError(pc, error) {
    trace('Failed to add Ice Candidate: ' + error.toString());
}

function getOtherPc(pc) {
    return (pc === localConnection) ? remoteConnection : localConnection;
}


function getName(pc) {
    return (pc === localConnection) ? 'localPeerConnection' :
        'remotePeerConnection';
}

function handlegetUserMediaSuccess(stream) {
    var videoTracks = stream.getVideoTracks();
    //console.log('Got stream with constraints:', constraints);
    trace('Using video device: ' + videoTracks[0].label);
    stream.oninactive = function() {
        trace('Stream inactive');
    };
    //window.stream = stream; // make variable available to browser console
    localConnection.addStream(stream);
    $('#gum-local')[0].srcObject = stream;

    MakeStep2();
}

function handlegetUserMediaError(error) {
    if (error.name === 'ConstraintNotSatisfiedError') {
        errorMsg('The resolution ' + constraints.video.width.exact + 'x' +
            constraints.video.width.exact + ' px is not supported by your device.');
    } else if (error.name === 'PermissionDeniedError') {
        errorMsg('Permissions have not been granted to use your camera and ' +
            'microphone, you need to allow the page access to your devices in ' +
            'order for the demo to work.');
    }
    errorMsg('getUserMedia error: ' + error.name, error);

    MakeStep2();
}
function errorMsg(msg, error) {
    $('#rtc').append('<p>' + msg + '</p>');
    if (typeof error !== 'undefined') {
        console.error(error);
    }
}
function gotRemoteStream(e) {
    //video.srcObject = e.stream;
    $('#gum-remote')[0].srcObject = e.stream;
    trace('remoteconn received remote stream');
}

String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10);
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
};
var x = 100;
console.log("Тест временной функции:" + ("" + x).toHHMMSS());
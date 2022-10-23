// ==UserScript==
// @name         lichess sounds moves
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://lichess.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lichess.org
// @grant        GM_xmlhttpRequest
// @require http://code.jquery.com/jquery-3.4.1.min.js
// ==/UserScript==


var whitelist = ["O-O", "O-O-O", "Rb7"]

function get_latest_move() {
    return $("l4x").children().last().text()
}

function playFromBuffer( context, buffer ) {
    var source = context.createBufferSource();
    source.buffer = buffer;
    source.connect( context.destination );
    source.start( 0 );
}


function playMusic(soundname) {

    if(!(whitelist.includes(soundname))) {

        console.log(soundname + " was not in whitelist")

        return;
    }

    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    let context = new AudioContext();
    GM_xmlhttpRequest( {
        method: "GET",
        url: 'https://keinerspieltmitmir.de/chess-move-sounds/'+soundname+'.mp3',
        responseType: 'arraybuffer',
        onerror: function( response) {
             console.log("error")
        },
        onload: function( response ) {
            try {
                if(response.status == "200") {
                    context.decodeAudioData( response.response, buffer => playFromBuffer( context, buffer ), console.err );
                }
                //else {
                //    console.log(soundname+".mp3 not found")
                //}
            }
            catch( e ) {
                console.log("Could not load mp3")
            }
        }
    } );
}

$("l4x").bind("DOMNodeInserted",function(){
    var mv = get_latest_move()
		alert(mv)

    playMusic(mv)


});

$(document).ready(function() {


})

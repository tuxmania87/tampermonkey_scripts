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

var isplaying = false

var chess_moves = ["chess_move_1", "chess_move_2", "chess_move_3", "chess_move_4"]
var knight_edge_moves = ["knight_edge_1", "knight_edge_2", "knight_edge_3", "knight_edge_4"]
var knight_edge_moves_list = ["Na2","Na3","Na4","Na5","Na6","Na7","Nh2","Nh3","Nh4","Nh5","Nh6","Nh7"]

function get_latest_move() {
    return $("l4x").children().last().text()
}

function setplayingfalse() {
    isplaying = false
}

function playFromBuffer( context, buffer ) {
    isplaying = true
    var source = context.createBufferSource();
    source.buffer = buffer;
    source.connect( context.destination );
    source.start( 0 );
    setTimeout(setplayingfalse, 3000)
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function playMusic(soundname) {

    /*if(!(whitelist.includes(soundname))) {

        console.log(soundname + " was not in whitelist")

        return;
    }*/

    if (!(isNaN(soundname))) {
         return;
    }

    if(isplaying) {
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
                } else if(soundname.slice(-1) == "+") {
                     var chosen = getRandomInt(4)
                     playMusic(chess_moves[chosen])
                } else if(knight_edge_moves_list.includes(soundname)) {
                     var chosen2 = getRandomInt(4)
                     playMusic(knight_edge_moves[chosen2])
                }
                else {
                    var istriggered = getRandomInt(100)
                    if(istriggered < 20) {
                          var chosen3 = getRandomInt(15) + 1
                          playMusic("rand_"+chosen3)
                    }
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


    playMusic(mv)


});

$(document).ready(function() {



})

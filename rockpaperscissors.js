var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var express = require('express');
app.use(express.static('public'));

app.get('/', function(req, res){ res.sendFile('F:/node.js/rockpaperscissors/rockpaperscissors.html');
});

//var roomName;
var roomData = {roomName : '', noOfPlayers : 0};
var noOfPlayers = 0;
var playerOne = {playerID : '' ,'set' : 0, playerName : '', hand : ''};
var playerTwo = {playerID : '', 'set' : 0, playerName : '', hand : ''};

var board = {roomName: '', pOne : playerOne, pTwo : playerTwo}

//Whenever someone connects this gets executed
io.on('connection', function(socket){
   console.log('A user connected');
   socket.emit('welcome-screen', 'default');
   socket.on('submitPlayerData', function(data){
	   console.log(board.pOne.playerName.length);
	   //var roomData = {roomName : '', noOfPlayers : 0};
	   //console.log(user.userID);
	   console.log(board);
	   //prepare room
	   roomData.roomName = data.rn;
	   if ( roomData.noOfPlayers < 2) {
		if (board.pOne.playerName.length < 1) {
		 board.pOne.playerName = data.pn;
		 board.pOne.playerID = socket.id;
		 socket.join(roomData.roomName);
		 console.log('one');
		 roomData.noOfPlayers = io.sockets.adapter.rooms.get(roomData.roomName).size;
	    }
	    else if (board.pTwo.playerName.length < 1){
	     board.pTwo.playerName = data.pn;
		 board.pTwo.playerID = socket.id;
		 socket.join(roomData.roomName);
		 console.log('two');
		 roomData.noOfPlayers = io.sockets.adapter.rooms.get(roomData.roomName).size;
	    }
		console.log(board.pOne.playerName); console.log(board.pTwo.playerName);
		console.log(roomData.noOfPlayers);
		//setup board
		socket.emit('setBoard', data);
		console.log(data);
		//code to 'slowly' start the game
		socket.on('playedHand', function(data) {
			console.log(data);
			if (board.pOne.playerName == data.pn) { board.pOne.set = 1; board.pOne.hand = data.hand;}
			console.log(data);
			if (board.pTwo.playerName == data.pn) { board.pTwo.set = 1; board.pTwo.hand = data.hand;}
			console.log(board);
			if (board.pOne.set == 1 && board.pTwo.set == 1) {
			 io.sockets.in(roomData.roomName).emit('setHand', {playerOneHand : board.pOne.hand, playerTwoHand : board.pTwo.hand});
			 console.log(board.pOne.set); console.log(board.pTwo.set); console.log(roomData.roomName);
			 board.pOne.set = 0; board.pTwo.set = 0;
			}
		});
	   } else {
		  console.log('Room is full!');   
	   }
   socket.on('disconnecting', function () {
	  console.log(socket.rooms);
	  if (board.pOne.playerID == socket.id) {
		  board.pOne.playerID = '';
		  board.pOne.playerName = '';
	  }
	  if (board.pTwo.playerID == socket.id) {
		  board.pTwo.playerID = '';
		  board.pTwo.playerName = '';
	  }
	  board.pOne.set = 0; board.pTwo.set = 0;
   });
   })
   //Whenever someone disconnects this piece of code executed
   socket.on('disconnect', function () {
	  console.log('A user disconnected');
	  console.log(socket.rooms);
   });
});

http.listen(3000, function(){
   console.log('listening on *:3000');
});





/*
var handplayer;

var output = document.getElementById("output"); var first = document.getElementById("first"); var put = document.getElementById("last");

var text = ''; var leer =", "; var cpu = '';

const beats = {'rock' : ['scissors'], 'paper': ['rock', 'well'], 'scissors': ['paper'], 'well': ['rock', 'scissors'] };

const hand = ['rock', 'paper', 'scissors', 'well'];

function play() {
    
    input.value = text = this.id;
    
    if ( beats[text].includes(hand[cpu]) ) {
        first.textContent = "Cpu plays " + hand[cpu] + ", you play " + text + ",\u00A0";
        last.textContent = "you Won!";
        last.style.color = "Green";
    }
    else if (hand[cpu] == text)
    {
        first.textContent = "Cpu plays " + hand[cpu] + ", you play " + text + ",\u00A0";
        last.textContent = "it's a Draw!";
        last.style.color = "Blue";
    }
    else { 
        first.textContent = "Cpu plays " + hand[cpu] + ", you play " + text + ",\u00A0";
        last.textContent = "you Lose!";
        last.style.color = "Red";
    }
}

rock.addEventListener("click", play)
paper.addEventListener("click", play)
scissors.addEventListener("click", play)
well.addEventListener("click", play)

*/
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var express = require('express');
app.use(express.static('public'));

app.get('/', function(req, res){ res.sendFile('F:/node.js/rockpaperscissors/rockpaperscissors.html');
});

//var roomName;
var roomData = {roomName : '', noOfPlayers : 0};
var playerOne = {playerID : '', rn : '', 'set' : 0, playerName : '', hand : ''};
var playerTwo = {playerID : '', rn : '', 'set' : 0, playerName : '', hand : ''};

var board = {roomName: '', pOne : playerOne, pTwo : playerTwo}

//Whenever someone connects this gets executed
io.on('connection', function(socket){
	console.log('A user connected');
	
	socket.emit('welcome-screen', 'default');
	socket.on('submitPlayerData', function(data){
	   console.log(board.pOne.playerName.length);
	   console.log(board);
	   //prepare room
	   roomName = data.rn;
	   //go on with this part
	   if (!io.sockets.adapter.rooms.has(roomName)) {
			socket.join(roomName);
			console.log(io.sockets.adapter.rooms.get(roomName).size);
			if (!io.sockets.adapter.rooms.get(roomName).playerOneName) {
				socket.rn = roomName;
				//go on from here
				io.sockets.adapter.rooms.get(socket.rn).playerOneName = data.pn;
				io.sockets.adapter.rooms.get(socket.rn).playerOneID = socket.id;
				console.log(io.sockets.adapter.rooms.get(roomName).playerOneName);console.log('one');
			}
			//setup board
			socket.emit('setBoard', data);
			console.log(data);
			//code to 'slowly' start the game
			socket.on('playedHand', function(data) {
				console.log(data);
					
				if (io.sockets.adapter.rooms.get(socket.rn).playerOneName == data.pn) { io.sockets.adapter.rooms.get(socket.rn).ready1 = 1; io.sockets.adapter.rooms.get(socket.rn).hand1 = data.hand;}
				//console.log(data);
				if (io.sockets.adapter.rooms.get(socket.rn).playerTwoName == data.pn) { io.sockets.adapter.rooms.get(socket.rn).ready2 = 1; io.sockets.adapter.rooms.get(socket.rn).hand2 = data.hand;}
				//console.log(board);
				if (io.sockets.adapter.rooms.get(socket.rn).ready1 == 1 && io.sockets.adapter.rooms.get(socket.rn).ready2 == 1) {
					console.log(data.rn);
					io.sockets.in(data.rn).emit('setHand', {playerOneHand : io.sockets.adapter.rooms.get(socket.rn).hand1, playerTwoHand : io.sockets.adapter.rooms.get(socket.rn).hand2});
					//console.log(board.pOne.set); console.log(board.pTwo.set); console.log(roomData.roomName);
					io.sockets.adapter.rooms.get(socket.rn).ready1 = 0; io.sockets.adapter.rooms.get(socket.rn).ready2 = 0;
				}
			});
		}
		
		else if (io.sockets.adapter.rooms.has(roomName)) {
			console.log(io.sockets.adapter.rooms.get(roomName).size);
			if (io.sockets.adapter.rooms.get(roomName).size < 2) {
				if (!io.sockets.adapter.rooms.get(roomName).playerOneName) {
					socket.rn = roomName;
					io.sockets.adapter.rooms.get(socket.rn).playerOneName = data.pn;
					io.sockets.adapter.rooms.get(socket.rn).playerOneID = socket.id;
					socket.join(roomName);
					console.log('one1');
				}
				else if (!io.sockets.adapter.rooms.get(roomName).playerTwoName){
					socket.rn = roomName;
					io.sockets.adapter.rooms.get(socket.rn).playerTwoName = data.pn;
					io.sockets.adapter.rooms.get(socket.rn).playerTwoID = socket.id;
					socket.join(roomName);
					console.log('two2');
				}
				//console.log(io.sockets.adapter.rooms.get(socket.roomName).size);
				//console.log(board.pOne.playerName); console.log(board.pTwo.playerName);
				//console.log(roomData.noOfPlayers);
				//setup board
				socket.emit('setBoard', data);
				console.log(data);
				
				//code to 'slowly' start the game
				socket.on('playedHand', function(data) {
					console.log(data);
					if (io.sockets.adapter.rooms.get(socket.rn).playerOneName == data.pn) {roomName = data.rn; io.sockets.adapter.rooms.get(socket.rn).ready1 = 1; io.sockets.adapter.rooms.get(socket.rn).hand1 = data.hand;}
					console.log(io.sockets.adapter.rooms.get(socket.rn).hand1);
					if (io.sockets.adapter.rooms.get(socket.rn).playerTwoName == data.pn) {roomName = data.rn; io.sockets.adapter.rooms.get(socket.rn).ready2 = 1; io.sockets.adapter.rooms.get(socket.rn).hand2 = data.hand;}
					console.log(io.sockets.adapter.rooms.get(socket.rn).hand2);
					if (io.sockets.adapter.rooms.get(socket.rn).ready1 == 1 && io.sockets.adapter.rooms.get(socket.rn).ready2 == 1) {
						io.sockets.in(socket.rn).emit('setHand', {playerOneHand : io.sockets.adapter.rooms.get(socket.rn).hand1, playerTwoHand : io.sockets.adapter.rooms.get(socket.rn).hand2});
						console.log(io.sockets.adapter.rooms.get(socket.rn).ready1); console.log(io.sockets.adapter.rooms.get(socket.rn).ready2); console.log(socket.rn);
						console.log(io.sockets.adapter.rooms.get(socket.rn).hand1); console.log(io.sockets.adapter.rooms.get(socket.rn).hand2);
						io.sockets.adapter.rooms.get(socket.rn).ready1 = 0; io.sockets.adapter.rooms.get(socket.rn).ready2 = 0;
					}
				});
			}
			else {
				//socket.leave(roomData.roomName);
				console.log('Room is full!');   
			}
			
		}
	socket.on('disconnecting', function () {
		
		console.log(socket.rooms);
		
		if (io.sockets.adapter.rooms.get(socket.rn).playerOneID == socket.id) {
			io.sockets.adapter.rooms.get(socket.rn).playerOneID = null;
			io.sockets.adapter.rooms.get(socket.rn).playerOneName = null;
		}
		if (io.sockets.adapter.rooms.get(socket.rn).playerTwoID == socket.id) {
			io.sockets.adapter.rooms.get(socket.rn).playerTwoID = null;
			io.sockets.adapter.rooms.get(socket.rn).playerTwoName = null;
		}
		io.sockets.adapter.rooms.get(socket.rn).ready1 = 0; io.sockets.adapter.rooms.get(socket.rn).ready2 = 0;
   });
   })
   //Whenever someone disconnects this piece of code executed
   socket.on('disconnect', function () {
	  console.log('A user disconnected');
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
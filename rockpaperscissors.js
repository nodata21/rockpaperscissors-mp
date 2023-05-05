var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var express = require('express');
app.use(express.static('public'));

app.get('/', function(req, res){ res.sendFile('F:/node.js/rockpaperscissors/rockpaperscissors.html');
});

var roomName = ""; var roomNames = "";

var playerOne = {playerID : '', rn : '', 'set' : 0, playerName : '', hand : ''};
var playerTwo = {playerID : '', rn : '', 'set' : 0, playerName : '', hand : ''};
//Whenever someone connects this gets executed
io.on('connection', function(socket){
	console.log('A user connected');

	function getActiveRooms(io) {
		const arr = Array.from(io.sockets.adapter.rooms);
		console.log(arr.filter(room =>room[1].playerOneName));
		console.log(arr.filter(room =>room[0].playerTwoName));
		const filtered = arr.filter(room => !room[1].has(room[0]) && room[1].size < 2);
		const res = filtered.map(i => i[0]);
		//console.log(filtered);
		//console.log(res);
		return res;
	}
	
	roomNames = getActiveRooms(io);
	socket.emit('welcome-screen', roomNames);
	//socket.emit('welcome-screen', 'default');
	socket.on('submitPlayerData', function(data){
	   //prepare room and join players
	   roomName = data.rn;

	   if (!io.sockets.adapter.rooms.has(roomName)) {
			socket.join(roomName);
			if (!io.sockets.adapter.rooms.get(roomName).playerOneName) {
				console.log(io.sockets.adapter.rooms.get(roomName));
				socket.rn = roomName;
				
				io.sockets.adapter.rooms.get(socket.rn).playerOneName = data.pn;
				data.playerID = io.sockets.adapter.rooms.get(socket.rn).playerOneID = socket.id;
				console.log(io.sockets.adapter.rooms.get(roomName).playerOneName);console.log('one');
			}
			//setup board
			socket.emit('setBoard', data);
			console.log(data);
			//code to start the game
			socket.on('playedHand', function(data) {
				//function for gameplay
				gameplay(data);
			});
		}
		//prepare room and join players (additional part)
		else if (io.sockets.adapter.rooms.has(roomName)) {
			console.log(io.sockets.adapter.rooms.get(roomName).size);
			if (io.sockets.adapter.rooms.get(roomName).size < 2) {
				if (!io.sockets.adapter.rooms.get(roomName).playerOneName) {
					socket.rn = roomName;
					io.sockets.adapter.rooms.get(socket.rn).playerOneName = data.pn;
					data.playerID = io.sockets.adapter.rooms.get(socket.rn).playerOneID = socket.id;
					socket.join(roomName);
					console.log('one1');
				}
				else if (!io.sockets.adapter.rooms.get(roomName).playerTwoName){
					socket.rn = roomName;
					io.sockets.adapter.rooms.get(socket.rn).playerTwoName = data.pn;
					data.playerID = io.sockets.adapter.rooms.get(socket.rn).playerTwoID = socket.id;
					socket.join(roomName);
					console.log('two2');
				}
				//setup board
				socket.emit('setBoard', data);
				console.log(data);
				
				//code to start the game
				socket.on('playedHand', function(data) {
					//function for gameplay
					gameplay(data);
				});
			}
			else {
				console.log('Room is full!');   
			}
			
		}
	socket.on('disconnecting', function () {
		
		console.log(socket.rooms);
		
		if (io.sockets.adapter.rooms.get(socket.rn).playerOneID == socket.id) {
			io.sockets.adapter.rooms.get(socket.rn).playerOneID = null;
			io.sockets.adapter.rooms.get(socket.rn).playerOneName = null;
			io.sockets.adapter.rooms.get(socket.rn).playerOneID = null;
		}
		if (io.sockets.adapter.rooms.get(socket.rn).playerTwoID == socket.id) {
			io.sockets.adapter.rooms.get(socket.rn).playerTwoID = null;
			io.sockets.adapter.rooms.get(socket.rn).playerTwoName = null;
			io.sockets.adapter.rooms.get(socket.rn).playerTwoID = null;
		}
		io.sockets.adapter.rooms.get(socket.rn).ready1 = 0; io.sockets.adapter.rooms.get(socket.rn).ready2 = 0;
	});
	function gameplay(data) {
				console.log(data.playerID);
				if (io.sockets.adapter.rooms.get(socket.rn).playerOneID == data.playerID) { io.sockets.adapter.rooms.get(socket.rn).ready1 = 1; io.sockets.adapter.rooms.get(socket.rn).hand1 = data.hand;}
				console.log(io.sockets.adapter.rooms.get(socket.rn).ready1);
				console.log(data.playerID);
				if (io.sockets.adapter.rooms.get(socket.rn).playerTwoID == data.playerID) { io.sockets.adapter.rooms.get(socket.rn).ready2 = 1; io.sockets.adapter.rooms.get(socket.rn).hand2 = data.hand;}
				console.log(io.sockets.adapter.rooms.get(socket.rn).ready2);
				if (io.sockets.adapter.rooms.get(socket.rn).ready1 == 1 && io.sockets.adapter.rooms.get(socket.rn).ready2 == 1) {
					console.log(data.rn);
					io.to(io.sockets.adapter.rooms.get(socket.rn).playerOneID).emit('setHand', {pn : io.sockets.adapter.rooms.get(socket.rn).playerOneName,
																										playerHand : io.sockets.adapter.rooms.get(socket.rn).hand1,
																										opponent : io.sockets.adapter.rooms.get(socket.rn).playerTwoName,
																										opponentHand : io.sockets.adapter.rooms.get(socket.rn).hand2,
																										opponentID : io.sockets.adapter.rooms.get(socket.rn).playerOneID});
																										console.log(data + "1");
					io.to(io.sockets.adapter.rooms.get(socket.rn).playerTwoID).emit('setHand', {pn : io.sockets.adapter.rooms.get(socket.rn).playerTwoName,																												
																										playerHand : io.sockets.adapter.rooms.get(socket.rn).hand2,
																										opponent : io.sockets.adapter.rooms.get(socket.rn).playerOneName,
																										opponentHand : io.sockets.adapter.rooms.get(socket.rn).hand1,
																										opponentID : io.sockets.adapter.rooms.get(socket.rn).playerTwoID});
																										console.log(data + "2");
					io.sockets.adapter.rooms.get(socket.rn).ready1 = 0; io.sockets.adapter.rooms.get(socket.rn).ready2 = 0;
				}
	}

	})
   //whenever someone disconnects this piece of code is executed
   socket.on('disconnect', function () {
	  console.log('A user disconnected');
   });
});

http.listen(3000, function(){
   console.log('listening on *:3000');
});
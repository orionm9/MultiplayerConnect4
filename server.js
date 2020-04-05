// Orion Moreno
// CS 479
// Setting up server

/// Dependencies/Middlewear
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);
app.set('port', 5500);
app.use('/Logic', express.static(__dirname + '/Logic'));
app.use('/CSS', express.static(__dirname + '/CSS'));

// Routing
app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, 'game.html'));
});

// Starts the server.
server.listen(5500, function() {
    console.log('Starting server on port 5500');
});

// Add the WebSocket handlers
io.on('connection', function(socket) {});
// sending message to test server
// setInterval(function() {
//     io.sockets.emit('message', 'hi!');
// }, 1000);
// var players = {};
const gameState = {
    players: {}
}
var playerCount = 0;
io.on('connection', function(socket) {
    socket.on('new player', function() {
        playerCount += 1
        gameState.players[socket.id] = {
            Pid: playerCount
        };
        io.sockets.emit('message', socket.id + ' has joined ');
    }); // end of new player
    // socket.on('board update', function(row) {
    //     socket.emit('update', row);
    // });
    socket.on("PlayerMoved", function(data) {
        socket.broadcast.emit("PlayerMoved", data);
    });
    socket.on('playerMovement', function(data) {

        var player = gameState.players[socket.id] || {};
        if (data.redTurn) {
            player.redTurn = true;
            player.yellowTurn = false;
        }

        if (data.yellowTurn) {
            player.yellowTurn = true;
            player.redTurn = false;
        }
    });

}); // end of connection

setInterval(function() {
    io.sockets.emit('state', gameState);
});
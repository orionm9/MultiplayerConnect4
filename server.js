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
            Pid: playerCount,
            myTurn: false
        };
        io.sockets.emit('message', socket.id + ' has joined, id: ' + gameState.players.Pid);
    }); // end of new player
    //sending gamestate to all sockets

    //trying something
    // socket.on('new player', () => {
    //         players[socket.id] = {
    //             Pid: 1
    //         };
    //     },
    //     io.sockets.emit('message', socket.id + ' has joined, id: ' + players[socket.id]));


    // socket.on('movement', function(data) {
    //     var player = players[socket.id] || {};
    //     if (data.left) {
    //         player.x -= 5;
    //     }
    //     if (data.up) {
    //         player.y -= 5;
    //     }
    //     if (data.right) {
    //         player.x += 5;
    //     }
    //     if (data.down) {
    //         player.y += 5;
    //     }
    // });
});
// setInterval(() => {
//     io.socket.emit('state', gameState);
// }, 1000 / 60);
setInterval(function() {
    io.sockets.emit('state', gameState);
}, 1000 / 60);
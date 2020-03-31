// Orion Moreno
// CS 479
// Setting up server

/// Dependencies
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
setInterval(function() {
    io.sockets.emit('message', 'hi!');
}, 1000);
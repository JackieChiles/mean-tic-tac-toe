'use strict';

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var path = require('path');
var modelFactory = require('./public/js/modelFactory');

//Just stick this all here for now, should go in another module
var rooms = {};
var nextRoomNumber = 1;
var GameRoom = function () {
    var self = this;
    
    self.game = modelFactory.newGame();
    self.playerX = null;
    self.playerO = null;
    
    //Functions
    self.join = function (socket) {
        var player;
        
        if (!self.playerX) {
            player = 'X';
            self.playerX = socket.id;
        }
        else if (!self.playerO) {
            player = 'O';
            self.playerO = socket.id;
        }
        else {
            //TODO: track observer count
            player = null;
        }
        
        return {
            player: player
        };
    };
    
    self.play = function (socketServer, cell, room) {
        if (self.game.isPlayLegal(cell) && self.playerO && self.playerX) {
            self.game.play(cell);
            console.log('Emitting play message to room: ', room);
            io.to(room).emit('play', cell);
        }
    };
};
var createNewRoom = function () {
    var roomNumber = nextRoomNumber;
    
    console.log('Create requested');
        
    rooms[roomNumber] = new GameRoom();
    nextRoomNumber = nextRoomNumber + 1;
    
    return roomNumber;
};

//Socket.io setup
io.on('connection', function (socket) {
    socket.on('play', function (msg) {
        console.log('In play (msg): ', msg);
        console.log('Rooms for socket: ', socket.rooms);
        
        //TODO: don't hardcode the index here, but should be safe for now. Room 0 is the socket's private room, room 1 should be the game room
        var id = socket.rooms[1];
        var gameRoom = rooms[id];

        gameRoom.play(io, msg, id);
        
        //TODO: need to remove the room once all have disconnected?
        if (gameRoom.game.isGameOver()) {
            rooms[id] = new GameRoom();
        }
    });
    
    socket.on('join', function (msg, callback) {
        console.log('Join request (room, socket): ', msg.room, socket.id);
        
        //TODO: error if room not found
        socket.join(msg.room);
        callback(rooms[msg.room].join(socket));
    });
});

//Express settings
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public', 'views'));

//Express routes
app.param('roomId', function (req, res, next, id) {
    req.roomId = id;
    next();
});
app.get('/', function (req, res) {
    //Create a new room and redirect to that room
    res.redirect('/' + createNewRoom());
});
app.get('/:roomId', function (req, res) {
    //TODO: Return 404 if game not found, otherwise render index with gameId
    res.render('index', { roomId: req.roomId });
});
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
app.use('/lib/angular.js', express.static(path.join(__dirname, 'node_modules', 'angular', 'angular.js')));
app.use('/lib/angular-route.js', express.static(path.join(__dirname, 'node_modules', 'angular-route', 'angular-route.js')));
app.use('/lib/socket.io.js', express.static(path.join(__dirname, 'node_modules', 'socket.io', 'node_modules', 'socket.io-client', 'socket.io.js')));

//Express startup
server.listen(3000, function () {
    console.log('Started tic-tac-toe on port 3000...');
});

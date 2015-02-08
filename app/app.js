'use strict';

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var path = require('path');
var modelFactory = require('./public/js/modelFactory');
var game;

//Just stick this here for now, should go in another module
var gameServer = {
    isPlayerX: false,
    isPlayerO: false
};

var reset = function () {
    game = modelFactory.newGame();
    gameServer.isPlayerX = false;
    gameServer.isPlayerO = false;
};

//Initialize the game server
reset();

//Socket.io setup
io.on('connection', function (socket) {
    socket.on('play', function (msg) {
        console.log(msg);
        
        if (game.isPlayLegal(msg) && gameServer.isPlayerO && gameServer.isPlayerX) {
            game.play(msg);
            console.log('Emitting play message');
            io.emit('play', msg);
        }
        
        if (game.isGameOver()) {
            reset();
        }
    });
    
    socket.on('join', function (msg, callback) {
        console.log('Join requested');
        
        var player;
        
        if (!gameServer.isPlayerX) {
            player = 'X';
            gameServer.isPlayerX = true;
        }
        else if (!gameServer.isPlayerO) {
            player = 'O';
            gameServer.isPlayerO = true;
        }
        else {
            //TODO: track observer count
            player = null;
        }
        
        callback({
            player: player
        });
    });
});

//Express settings
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public', 'views'));

//Express routes
app.get('/', function (req, res) {
    res.render('index', { title: 'Tic-tac-toe!!!' });
});
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
app.use('/lib/angular.js', express.static(path.join(__dirname, 'node_modules', 'angular', 'angular.js')));
app.use('/lib/socket.io.js', express.static(path.join(__dirname, 'node_modules', 'socket.io', 'node_modules', 'socket.io-client', 'socket.io.js')));

//Express startup
server.listen(3000, function () {
    console.log('Started tic-tac-toe on port 3000...');
});

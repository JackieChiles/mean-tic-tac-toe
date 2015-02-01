'use strict';

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var path = require('path');

//Socket.io setup
io.on('connection', function (socket) {
    socket.on('play', function (msg) {
        console.log(msg);
    })
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

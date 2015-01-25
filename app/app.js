'use strict';

var express = require('express');
var app = express();
var path = require('path');

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

//Express startup
app.listen(3000, function () {
    console.log('Started tic-tac-toe on port 3000...');
});

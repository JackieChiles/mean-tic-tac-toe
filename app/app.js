var express = require('express');
var app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/public/views');
app.get('/', function (req, res) {
    res.render('index', { title: 'Tic-tac-toe!!!' });
});

app.listen(3000, function() {
    console.log('Started tic-tac-toe on port 3000...');
});

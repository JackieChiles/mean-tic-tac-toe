var express = require('express');
var app = express();

app.set('view engine', 'ejs');
app.get('/', function (req, res) {
    res.render('../server/views/index.ejs', { title: 'Tic-tac-toe' });
});

app.listen(3000, function() {
    console.log('Started tic-tac-toe...');
});

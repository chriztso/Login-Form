var fs = require('fs');
var express = require('express');
var app = express(); 
var hbs = require('hbs');
hbs.registerPartials(__dirname + '/views/partials');

var port = 3000; 

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    res.render('login');
});

app.listen(port, () => {console.log('listening at PORT 3000')});

var express = require('express');
var app = express(); 
var hbs = require('hbs');
var bodyParser = require('body-parser');
var db = require('./database.js');


hbs.registerPartials(__dirname + '/views/partials');

var port = 3000; 

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.render('login', {title: 'Registration'});
});

app.post('/login', (req, res) => {
    var username =  req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    
    db.saveUser(username, email, password, (err, data) => {
        if(err){
            console.log(err);
            return;
        }
        res.render('login', {title: 'Registration Complete'});

    })

});

app.listen(port, () => {console.log('listening at PORT 3000')});

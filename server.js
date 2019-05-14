var express = require('express');
var app = express(); 
var hbs = require('hbs');
var bodyParser = require('body-parser');
var db = require('./database.js');
var expressValidator = require('express-validator');
var bcrypt = require('bcrypt');
const saltRounds = 10;


hbs.registerPartials(__dirname + '/views/partials');

var port = 3000; 

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.get('/', (req, res) => {
    res.render('login', {title: 'Registration'});
});

app.post('/login', (req, res) => {
    req.checkBody('username', 'Username field cannot be empty').notEmpty();
    req.checkBody('email', 'Email field cannot be empty').notEmpty();
    req.checkBody('email', 'Email must be valid').isEmail();
    req.checkBody('password', 'Password field cannot be empty').notEmpty();

    var errors = req.validationErrors();

    if(errors){
        console.log('errors', errors);

        res.render('login', {
            title: 'Registration Error', 
            errors: errors
        })
    } else{

    var username =  req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    
    bcrypt.hash(password, saltRounds, function(err, hash) {
       db.saveUser(username, email, hash, (err, data) => {
           if(err){
               console.log(err);
               return;
           }
           res.render('login', {title: 'Registration Complete'});
   
       })
    })
  
   }

});

app.listen(port, () => {console.log('listening at PORT 3000')});

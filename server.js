var express = require('express');
var app = express(); 
var hbs = require('hbs');
var bodyParser = require('body-parser');
var db = require('./database.js');
var expressValidator = require('express-validator');
var bcrypt = require('bcrypt');
var cookieParser = require('cookie-parser');
const saltRounds = 10;
var connection = require('./database.js').connection;

//Authentication
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var MySQLStore = require('express-mysql-session')(session);

hbs.registerPartials(__dirname + '/views/partials');

var port = 3000; 

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());

var options = {
    host: 'localhost', 
    user: 'root', 
    password: 'yourpassword', 
    database: 'login'
}

var sessionStore = new MySQLStore(options);

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    store: sessionStore,
    saveUninitialized:  false,
    // cookie: { secure: true }
}));


passport.use(new LocalStrategy(
    function(username, password, done) {
        console.log('username', username);
        console.log('password', password);
        var query = `SELECT id, password FROM users3 WHERE username = '${username}'`;
        connection.query(query, (err, data) => {
            if(err){
                done(err)
            }

            if(data.length === 0){
                return done(null, false);
            } else{
   
            var hash = data[0].password.toString();
            //compare password with database password
            bcrypt.compare(password, hash, (err, response) => {
              if(response === true){
                //successfully login 
                return done(null, {user_id: data[0].id});
              } else{
                  return done(null, false);
              }  

             })
           }

        })
    }
));
    
 
app.use(passport.initialize());
app.use(passport.session());  

app.use(function(req, res, next){
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
})


app.get('/', (req, res) => {
    console.log('hi', req.user);
    console.log('bye', req.isAuthenticated());
    res.render('home', {title: 'Home'});
});

app.get('/profile', authenticationMiddleware(), (req, res) => {
    res.render('profile', {title: 'Profile'})
});

app.get('/login', (req, res) => {
    res.render('login', {title: 'Login'})
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login'
}));

app.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
})

app.get('/register', (req, res) => {
    res.render('register', {title: 'Registration'});
});



app.post('/register', (req, res) => {
    req.checkBody('username', 'Username field cannot be empty').notEmpty();
    req.checkBody('email', 'Email field cannot be empty').notEmpty();
    req.checkBody('email', 'Email must be valid').isEmail();
    req.checkBody('password', 'Password field cannot be empty').notEmpty();

    var errors = req.validationErrors();

    if(errors){
        console.log('errors', errors);

        res.render('register', {
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
           connection.query('SELECT LAST_INSERT_ID() as user_id', (err, data) => {
               if(err){
                   throw error;
                   return;
               }
               var user_id = data[0];
               //user_id is passed to login which goes to serialize
               req.login(user_id, (err, data) => {
                   res.redirect('/');
               })
           })
   
       })
    })
  
   }

});


//takes in user_id and store it in session 
//serialize means writing user data to session
//store user_id
passport.serializeUser(function(user_id, done) {
    done(null, user_id);
  });
  

//deserialize means retrieveing datafrom session
//read from session
//gets user_id from serialize user
passport.deserializeUser(function(user_id, done) {
    done(null, user_id);
});

function authenticationMiddleware () {  
	return (req, res, next) => {
		console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

	    if (req.isAuthenticated()) {
            return next();
        } else{    
        res.redirect('/login')
        }
	}
}




app.listen(port, () => {console.log('listening at PORT 3000')});

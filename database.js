var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost', 
    user: 'root', 
    password: 'yourpassword', 
    database: 'login'
})

connection.connect(() => {console.log('CONNECTED TO DB')});


var saveUser = (user, email, password, callback) => {
    var query = `INSERT INTO users(username, email, password) VALUES (${user}, ${email}, ${password})`;
    connection.query(query, (err, data) => {
        if(err){
            callback(null, err);
            return;
        }
        callback(null, data);
    })
}

exports.saveUser = saveUser;


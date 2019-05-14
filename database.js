var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost', 
    user: 'root', 
    password: 'yourpassword', 
    database: 'login'
})

connection.connect(() => {console.log('CONNECTED TO DB')});


var saveUser = (user, email, password, callback) => {
    console.log('saving', user, email, password);
    var query = `INSERT INTO users2 (username, email, password) VALUES ('${user}', '${email}', '${password}')`;
    connection.query(query, (err, data) => {
        if(err){
            callback(null, err);
            return;
        }
        callback(null, data);
    })
}

exports.saveUser = saveUser;


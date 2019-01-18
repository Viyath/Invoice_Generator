var mysql = require('mysql');

var connectionstring = process.env.JAWSDB_URL || 'mysql://root:@localhost:3306/my_invoice'
var connection = mysql.createConnection(connectionstring);

connection.connect(function(err){
    if(!err) {
        console.log("Database is connected");
    } else {
        console.log("Error while connecting with database");
    }
});
module.exports = connection;
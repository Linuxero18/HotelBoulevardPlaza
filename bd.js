let mysql = require('mysql');

let con = mysql.createConnection({
    host: "localhost",
    database: "hotelbd",
    user: "root",
    password: ""
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Tamos ready!");
});

module.exports = con;
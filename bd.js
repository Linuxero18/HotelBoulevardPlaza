let mysql = require('mysql');

let con = mysql.createConnection({
    host: "localhost",
    database: "hotelbd",
    user: "root",
    password: "",
    //port: 3307, // Cambia esto al puerto que has configurado

});

con.connect(function(err) {
    if (err) throw err;
    console.log("Tamos ready!");
});

module.exports = con;
var express = require('express');
var db = require('./bd.js');
var app = express();

app.use(express.urlencoded({ extended: true}));
app.use(express.static('public'));

app.post('/login', function(peticion,respuesta) {
    var usuario = peticion.body.correo;
    var password = peticion.body.contra;
    console.log(usuario);
    console.log(password);
    db.query('SELECT * FROM usuario WHERE usuario = ? AND password = ?', [usuario, password], function(error, resultado) {
        if (resultado.length > 0) {
            respuesta.redirect('/home');
        } else {
            respuesta.send('Usuario o contraseña incorrectos');
        }
        respuesta.end();
    });
});



app.get('/home', function(peticion,respuesta) {
    respuesta.sendFile(__dirname + '/public/index.html');
});


app.listen(3000, function(peticion,respuesta) {
    console.log('server running on port 3000');
});

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

app.post('/registrarReclamo', function(peticion,respuesta) {
    var fecha = new Date();
    var nombres = peticion.body.nombres;
    var apellidos = peticion.body.apellidos;
    var tipo_documento = peticion.body.tipo_documento;
    var documento = peticion.body.documento;
    var direccion = peticion.body.direccion;
    var telefono = peticion.body.telefono;
    var correo = peticion.body.correo;
    var mensaje = peticion.body.mensaje;
    var tipo_reclamo = peticion.body.tipo_reclamo;

    db.query('INSERT INTO persona (nombres, apellidos, tipo_doc, numero_doc, direccion, telefono, correo) VALUES (?,?,?,?,?,?,?)', [nombres, apellidos, tipo_documento, documento, direccion, telefono, correo], function(error, resultado) {
        if (error) {
            console.log(error);
            console.log('Error al registrar la persona');
        } else {
            db.query('INSERT INTO libro_reclamos (fecha_reclamo,datos_cliente,descripcion_reclamo,tipo_reclamo,estado) VALUES (?,?,?,?,?)', [fecha,resultado.insertId, mensaje, tipo_reclamo,1 ], function(error, resultado) {
                if (error) {
                    console.log(error);
                    console.log('Error al registrar el reclamo');
                } else {
                    console.log('Reclamo registrado correctamente');
                }
            });
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

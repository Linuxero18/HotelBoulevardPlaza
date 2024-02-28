//Autor: Robert Diaz
//Este es el documento del servidor, el cual se encarga de manejar las peticiones del cliente y realizar las consultas a la base de datos

let express = require('express');
let db = require('./bd.js');
const getConnection = require('./bd.js');
let app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static('public'));


//Este metodo maneja la funcionalidad del login
app.post('/login', function(peticion,respuesta) {
    let usuario = peticion.body.correo;
    let password = peticion.body.contra;
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


//Este metodo maneja la funcionalidad de registrar un reclamo
app.post('/registrarReclamo', function(peticion, respuesta) {
    //Obtener la fecha actual
    let fecha = new Date();
    //Obtener los valores de los campos del formulario
    let nombres = peticion.body.nombres;
    let apellidos = peticion.body.apellidos;
    let tipo_documento = peticion.body.tipo_documento;
    let documento = peticion.body.documento;
    let direccion = peticion.body.direccion;
    let telefono = peticion.body.telefono;
    let correo = peticion.body.correo;
    let mensaje = peticion.body.mensaje;
    let tipo_reclamo = peticion.body.tipo_reclamo;
    console.log(peticion.body);
    //Validar que el documento identidad, osea la persona,no exista en la BD
    db.query('SELECT * FROM persona WHERE numero_doc = ?',[documento],function(error,resultadoConsulta){
        if(error){
            throw error;
        } else {
            if(resultadoConsulta.length > 0){
                //Si la persona existe entonces solo insertamos el reclamo, no la persona
                console.log('La persona ya existe');
                let idPersona = resultadoConsulta[0].idPersona;
                db.query('INSERT INTO libro_reclamos (fecha_reclamo, datos_cliente, descripcion_reclamo, tipo_reclamo, estado) VALUES (?,?,?,?,?)', [fecha, idPersona, mensaje, tipo_reclamo, 1], function(error, resultadoReclamo) {
                    if (error) {
                        console.log(error);
                        respuesta.status(500).send({ error: 'Error al registrar el reclamo' });
                    } else {
                        let idReclamo = resultadoReclamo.insertId;
                        let numeroReclamo = idReclamo.toString().padStart(6, '0');
                        db.query('UPDATE libro_reclamos SET codigo_reclamo = ? WHERE idReclamo = ?', [numeroReclamo, idReclamo], function(error, resultadoUpdate) {
                            if (error) {
                                console.log(error);
                                respuesta.status(500).send({ error: 'Error al actualizar el número de reclamo' });
                            } else {
                                respuesta.send({ status: 'success', numeroReclamo: numeroReclamo });
                            }
                        });
                    }
                });
                
            } else { // Validar que los campos obligatorios no estén vacíos
                if (!nombres || !apellidos || !tipo_documento || !documento || !direccion || !telefono || !correo || !mensaje || !tipo_reclamo) {
                    respuesta.status(400).send({ error: 'Todos los campos son obligatorios.' });
                    return;
                }
                // Si la persona no existe, entonces la insertamos junto con el reclamo
                
                db.query('INSERT INTO persona (nombres, apellidos, tipo_doc, numero_doc, direccion, telefono, correo) VALUES (?,?,?,?,?,?,?)', [nombres, apellidos, tipo_documento, documento, direccion, telefono, correo], function(error, resultadoPersona) {
                    if (error) {
                        console.log(error);
                        console.log('Error al registrar la persona');
                        respuesta.status(500).send({ error: 'Error al registrar la persona' });
                    } else {
                        db.query('INSERT INTO libro_reclamos (fecha_reclamo, datos_cliente, descripcion_reclamo, tipo_reclamo, estado) VALUES (?,?,?,?,?)', [fecha, resultadoPersona.insertId, mensaje, tipo_reclamo, 1], function(error, resultadoReclamo) {
                            if (error) {
                                console.log(error);
                                respuesta.status(500).send({ error: 'Error al registrar el reclamo' });
                            } else {
                                let idReclamo = resultadoReclamo.insertId;
                                let numeroReclamo = idReclamo.toString().padStart(6, '0');
                                db.query('UPDATE libro_reclamos SET codigo_reclamo = ? WHERE idReclamo = ?', [numeroReclamo, idReclamo], function(error, resultadoUpdate) {
                                    if (error) {
                                        console.log(error);
                                        respuesta.status(500).send({ error: 'Error al actualizar el número de reclamo' });
                                    } else {
                                        respuesta.send({ status: 'success', numeroReclamo: numeroReclamo });
                                    }
                                });
                            }
                        });
                    }
                });
            } // Cierre de la llave else
        } // Cierre de la llave else externa
    });
});


    

// app.get('/search', async (req, res) => {
//     try {
//         const idNumber = (req.query.id).substring(5);
//         console.log(idNumber);
//         const con = await getConnection();
//         const [rows, fields] = await con.query(`
//             SELECT lr.fecha_reclamo, lr.descripcion_reclamo, lr.tipo_reclamo, lr.codigo_reclamo, 
//                    p.nombres, p.apellidos, p.tipo_doc, p.numero_doc
//             FROM libro_reclamos lr
//             JOIN persona p ON lr.datos_cliente = p.idPersona
//             WHERE lr.idReclamo = ?
//         `, [idNumber]);

//         res.json(rows);
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).send('Ocurrió un error al realizar la consulta');
//     }
// });

app.get('/search', (req, res) => {
    const idNumber = req.query.id; // El valor del parámetro id
    console.log(idNumber);
    db.query(`
        SELECT lr.fecha_reclamo, lr.codigo_reclamo,  lr.estado
        FROM libro_reclamos lr
        WHERE lr.idReclamo = ?`, 
        [idNumber], 
        (error, results) => {
            if (error) {
                console.error('Error:', error);
                res.status(500).send('Ocurrió un error al realizar la consulta');
                return;
            }
            
            if (results.length > 0) {
                res.json(results);
            } else {
                res.status(404).send('No se encontraron datos');
            }
        }
    );
});




//Este metodo carga la pagina principal
app.get('/home', function(peticion,respuesta) {
    respuesta.sendFile(__dirname + '/public/index.html');
});

//Este metodo establece el puerto en el que se ejecutara el servidor
app.listen(3000, function(peticion,respuesta) {
    console.log('server running on port 3000');
});

//Autor: Robert Diaz
//Este es el documento del servidor, el cual se encarga de manejar las peticiones del cliente y realizar las consultas a la base de datos
const cors = require('cors');
const express = require('express');
const db = require('./bd.js');
const getConnection = require('./bd.js');
const app = express();
const mercadopago = require('mercadopago');
const cliente = new mercadopago.MercadoPagoConfig({ accessToken: 'TEST-8326400819798321-032509-75a585ac077cff1e7a9d0cb7fff75062-1053050103' });

// NodeMailer
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Ruta para manejar el envío del formulario de contacto
app.post('/enviar-correo', (req, res) => {
    const { nombre, email, mensaje } = req.body;

    // Configurar el transporte de correo
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'boulevardplazap@gmail.com', //dirección de correo
            pass: 'ffqv nwuf ymwv uxro' //tu contraseña
        }
    });

    // Configurar el mensaje de correo
    const mailOptions = {
        from: 'boulevardplazap@gmail.com', //dirección de correo
        to: email, //dirección de correo del destinatario
        subject: 'Mensaje de contacto desde el sitio web',
        html:
        `
        <div style="font-family: Arial, sans-serif; background-color: #f2f2f2; padding: 20px;">
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 10px; border: 1px solid #dddddd; background-color: #ffffff;"><strong>¡Hola, ${nombre}!</strong></td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #dddddd; background-color: #ffffff;">
                        <p><b>Gracias por contactarnos. Hemos recibido tu mensaje y te responderemos a la brevedad posible.<b></p>
                        <p><b>Este es el mensaje que nos enviaste:<b></p>
                        <blockquote>${mensaje}</blockquote>
                        <p><b>Saludos cordiales,<b></p>
                        <p><b>El equipo de Boulevard Plaza<b></p>
                    </td>
                </tr>
            </table>
        </div>
    `
    };

    // Enviar el correo
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error al enviar el correo:', error);
            res.status(500).json({ error: 'Error al enviar el correo electrónico' });
        } else {
            console.log('Correo enviado:', info.response);
            res.json({ mensaje: 'Correo electrónico enviado correctamente' });
        }
    });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors());


//Este metodo maneja la funcionalidad del login
app.post('/login', function (peticion, respuesta) {
    let usuario = peticion.body.correo;
    let password = peticion.body.contrasena;
    console.log(usuario);
    console.log(password);
    db.query('SELECT * FROM usuario WHERE usuario = ? AND password = ?', [usuario, password], function (error, resultado) {
        if (resultado.length > 0) {
            console.log(resultado);
            respuesta.send('success');
        } else {
            respuesta.send('error');
        }
        respuesta.end();
    });
});


//Este metodo maneja la funcionalidad de registrar un reclamo
app.post('/registrarReclamo', function (peticion, respuesta) {
    //Obtener la fecha actual
    let fecha = new Date();
    //Obtener los valores de los campos del formulario
    let nombres = peticion.body.nombres;
    let apellidos = peticion.body.apellidos;
    let tipo_documento = peticion.body.tipo_documento;
    let documento = peticion.body.documento;
    let direccion = peticion.body.direccion;
    let fechaNac = peticion.body.fechanac;
    let telefono = peticion.body.telefono;
    let correo = peticion.body.correo;
    let mensaje = peticion.body.mensaje;
    let tipo_reclamo = peticion.body.tipo_reclamo;
    console.log(peticion.body);
    //Validar que el documento identidad, osea la persona,no exista en la BD
    db.query('SELECT * FROM persona WHERE numero_doc = ?', [documento], function (error, resultadoConsulta) {
        if (error) {
            throw error;
        } else {
            if (resultadoConsulta.length > 0) {
                //Si la persona existe entonces solo insertamos el reclamo, no la persona
                console.log('La persona ya existe');
                let idPersona = resultadoConsulta[0].idPersona;
                db.query('INSERT INTO libro_reclamos (fecha_reclamo, datos_cliente, descripcion_reclamo, tipo_reclamo, estado) VALUES (?,?,?,?,?)', [fecha, idPersona, mensaje, tipo_reclamo, 1], function (error, resultadoReclamo) {
                    if (error) {
                        console.log(error);
                        respuesta.status(500).send({ error: 'Error al registrar el reclamo' });
                    } else {
                        let idReclamo = resultadoReclamo.insertId;
                        let numeroReclamo = idReclamo.toString().padStart(6, '0');
                        db.query('UPDATE libro_reclamos SET codigo_reclamo = ? WHERE idReclamo = ?', [numeroReclamo, idReclamo], function (error, resultadoUpdate) {
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
                if (!nombres || !apellidos || !tipo_documento || !documento || !fechaNac || !direccion || !telefono || !correo || !mensaje || !tipo_reclamo) {
                    respuesta.status(400).send({ error: 'Todos los campos son obligatorios.' });
                    return;
                }
                // Si la persona no existe, entonces la insertamos junto con el reclamo

                db.query('INSERT INTO persona (nombres, apellidos, tipo_doc, numero_doc, fecha_nacimiento, direccion, telefono, correo) VALUES (?,?,?,?,?,?,?,?)', [nombres, apellidos, tipo_documento, documento, fechaNac, direccion, telefono, correo], function (error, resultadoPersona) {
                    if (error) {
                        console.log(error);
                        console.log('Error al registrar la persona');
                        respuesta.status(500).send({ error: 'Error al registrar la persona' });
                    } else {
                        db.query('INSERT INTO libro_reclamos (fecha_reclamo, datos_cliente, descripcion_reclamo, tipo_reclamo, estado) VALUES (?,?,?,?,?)', [fecha, resultadoPersona.insertId, mensaje, tipo_reclamo, 1], function (error, resultadoReclamo) {
                            if (error) {
                                console.log(error);
                                respuesta.status(500).send({ error: 'Error al registrar el reclamo' });
                            } else {
                                let idReclamo = resultadoReclamo.insertId;
                                let numeroReclamo = idReclamo.toString().padStart(6, '0');
                                db.query('UPDATE libro_reclamos SET codigo_reclamo = ? WHERE idReclamo = ?', [numeroReclamo, idReclamo], function (error, resultadoUpdate) {
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


//Este metodo maneja la funcionalidad de buscar un reclamo
app.post('/search', (req, res) => {
    const { tipo_documento, numero_documento, apellidos, numero_reclamo } = req.body;
    let sqlQuery;
    let queryParams;
    // Construir la consulta SQL en función de los parámetros recibidos
    if (tipo_documento && numero_documento && apellidos) {
        sqlQuery = 'SELECT lr.fecha_reclamo, lr.codigo_reclamo, lr.estado FROM libro_reclamos lr JOIN persona p ON lr.datos_cliente = p.idPersona WHERE (p.tipo_doc = ? AND p.numero_doc = ?) OR apellidos = ?';
        queryParams = [tipo_documento, numero_documento, apellidos];
    } else if (numero_reclamo) {
        sqlQuery = 'SELECT lr.fecha_reclamo, lr.codigo_reclamo, lr.estado FROM libro_reclamos lr WHERE lr.idReclamo = ?';
        queryParams = [numero_reclamo];
    }

    db.query(sqlQuery, queryParams, (error, results) => {
        if (error) {
            console.error('Error al realizar la consulta:', error);
            res.status(500).json({ error: 'Error al realizar la consulta a la base de datos' });
            return;
        }

        // Enviar los resultados de la consulta
        if (results.length > 0) {
            res.json(results);
        } else {
            res.status(404).send('No se encontraron datos');
        }
    });
});

//Este metodo maneja la funcionalidad de busqueda de habitaciones segun el formulario del index.html

app.get('/habitaciones', (req, res) => {
    let { fechaEntrada, fechaSalida, numAdultos, numNinos, numPersonas } = req.query;

    // Convertir fechas a objetos Date
    fechaEntrada = new Date(fechaEntrada);
    console.log(fechaEntrada.toISOString().slice(0, 10));
    fechaSalida = new Date(fechaSalida);
    console.log(fechaSalida.toISOString().slice(0, 10));

    // Buscar habitaciones que coincidan con los criterios
    let query = `
    SELECT habitacion.idHabitacion, habitacion.numero, habitacion.piso, habitacion.descripcion, 
    habitacion.precio_dia, habitacion.tipo_habitacion, habitacion.aforo, habitacion.estado
    FROM habitacion
    WHERE habitacion.aforo >= ?
    AND habitacion.estado = 1
    AND NOT EXISTS (
    SELECT *
    FROM reserva
    WHERE reserva.idHabitacion = habitacion.idHabitacion
    AND NOT (reserva.fecha_out <= ? OR reserva.fecha_in >= ?)
    )
`;

    db.query(query, [numPersonas, fechaEntrada, fechaSalida], (err, result) => {
        if (err) throw err;

        // Añade el número de personas a cada habitación en el resultado
        let habitacionesConNumPersonas = result.map(habitacion => ({
            ...habitacion,
            numAdultos: numAdultos,
            numNinos: numNinos,
            numPersonas: numPersonas,
            fechaEntrada: fechaEntrada,
            fechaSalida: fechaSalida
        }));

        res.json(habitacionesConNumPersonas);
        //console.log(habitacionesConNumPersonas);
    });
});


///Este metodo registra las personas de la reserva
app.post('/registrarpersonareserva', (req, res) => {
    let { nombres, apellidos, tipoDoc, documento, fechaNac, direccion, telefono, correo } = req.body;

    // Primero, verifica si ya existe una persona con el mismo número de documento
    let queryCheck = `SELECT idPersona FROM persona WHERE numero_doc = ?`;

    db.query(queryCheck, [documento], (err, result) => {
        if (err) {
            console.error('Error al verificar la persona:', err);
            res.status(500).json({ error: 'Error al verificar la persona' });
            return;
        }

        if (result.length > 0) {
            // Si la persona ya está registrada, devuelve un mensaje de éxito sin hacer nada más
            res.json({ status: 'success', idPersona: result[0].idPersona });
        } else {
            // Si la persona no está registrada, procede a insertarla
            let queryInsert = `
                INSERT INTO persona (nombres, apellidos, tipo_doc, numero_doc, fecha_nacimiento, direccion, telefono, correo)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            db.query(queryInsert, [nombres, apellidos, tipoDoc, documento, fechaNac, direccion, telefono, correo], (err, result) => {
                if (err) {
                    console.error('Error al registrar la persona:', err);
                    res.status(500).json({ error: 'Error al registrar la persona' });
                    return;
                }

                res.json({ status: 'success', idPersona: result.insertId });
            });
        }
    });
});


//Este metodo registra las personas como clientes
app.post('/registrarpersonacliente', (req, res) => {
    let { idpersona } = req.body;

    // Comprobar si idpersona está definido
    if (!idpersona) {
        console.error('Error: idpersona no está definido');
        res.status(400).json({ error: 'idpersona no está definido' });
        return;
    }

    // Primero, verifica si ya existe un cliente con el mismo id_persona
    let queryCheck = `SELECT id_cliente FROM cliente WHERE id_persona = ?`;

    db.query(queryCheck, [idpersona], (err, result) => {
        if (err) {
            console.error('Error al verificar el cliente:', err);
            res.status(500).json({ error: 'Error al verificar el cliente' });
            return;
        }

        if (result.length > 0) {
            // Si el cliente ya está registrado, devuelve un mensaje de éxito sin hacer nada más
            res.json({ status: 'success', message: 'El cliente ya está registrado', idCliente: result[0].id_cliente });
            console.log(result[0].id_cliente);
        } else {
            // Si el cliente no está registrado, procede a insertarlo
            let codigoCliente = idpersona.toString().padStart(6, '0');
            let queryInsert = `
                INSERT INTO cliente (id_persona, codigo_cliente)
                VALUES (?, ?)
            `;

            db.query(queryInsert, [idpersona, codigoCliente], (err, result) => {
                if (err) {
                    console.error('Error al registrar el cliente:', err);
                    res.status(500).json({ error: 'Error al registrar el cliente' });
                    return;
                }

                res.json({ status: 'success', idCliente: result.insertId });
            });
        }
    });
});

//Este metodo registra las reservas

app.post('/registrarreserva', (req, res) => {
    let { codigoReserva, idHabitacion, idCliente, fecha_reserva, fecha_in, fecha_out, costo_total, observacion, estado, correo } = req.body;
    console.log(req.body);
    let queryReserva = `
        INSERT INTO reserva (codigo_reserva, idHabitacion, idCliente, fecha_reserva, fecha_in, fecha_out, costo_total, observacion, estado)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(queryReserva, [codigoReserva, idHabitacion, idCliente, fecha_reserva, fecha_in, fecha_out, costo_total, observacion, estado], (err, result) => {
        if (err) {
            console.error('Error al registrar la reserva:', err);
            res.status(500).json({ error: 'Error al registrar la reserva' });
            return;
        }

        // Actualiza el estado de la habitación
        let queryHabitacion = `
            UPDATE habitacion
            SET estado = 1
            WHERE idHabitacion = ?
        `;

        db.query(queryHabitacion, [idHabitacion], (err, result) => {
            if (err) {
                console.error('Error al actualizar el estado de la habitación:', err);
                res.status(500).json({ error: 'Error al actualizar el estado de la habitación' });
                return;
            }

            // Configura el transportador de Nodemailer
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'boulevardplazap@gmail.com',
                    pass: 'ffqv nwuf ymwv uxro'
                }
            });

            // Configura el correo electrónico
            let mailOptions = {
                from: 'boulevardplazap@gmail.com',
                to: correo,
                subject: 'Confirmación de reserva',
                text: `Hola, tu reserva con el código ${codigoReserva} ha sido registrada con éxito. Recuerda que puedes pagar tu reserva en línea a traves del siguiente link: http://localhost:3000/buscar_reserva.html. ¡Gracias por elegirnos!.

                       Te recordamos nuestros datos de contacto:
                        Teléfono: 987654321
                        Correo:

                          ¡Te esperamos!
                `
            };

            // Envía el correo electrónico
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.error('Error al enviar el correo electrónico:', err);
                } else {
                    console.log('Correo electrónico enviado:', info.response);
                }
            });

            res.json({ status: 'success', idReserva: result.insertId });
        });
    });
});

//Este metodo busca las reservas segun el codigo de reserva o segun los apellidos y el numero y tipo de documento
app.post('/buscarreserva', (req, res) => {
    const { tipo_documento, numero_documento, apellidos, codigo_reserva } = req.body;
    let sqlQuery;
    let queryParams;
    // Construir la consulta SQL en función de los parámetros recibidos
    if (tipo_documento && numero_documento && apellidos) {
        sqlQuery = 'SELECT r.codigo_reserva, r.fecha_reserva, r.fecha_in, r.fecha_out, r.costo_total, r.observacion, r.estado, h.numero, h.piso, h.descripcion, h.precio_dia, h.tipo_habitacion, h.aforo, p.nombres, p.apellidos, p.tipo_doc, p.numero_doc, p.fecha_nacimiento, p.telefono FROM reserva r JOIN habitacion h ON r.idHabitacion = h.idHabitacion JOIN cliente c ON r.idCliente = c.id_cliente JOIN persona p ON c.id_persona = p.idPersona WHERE (p.tipo_doc = ? AND p.numero_doc = ?) OR apellidos = ?';
        queryParams = [tipo_documento, numero_documento, apellidos];
    } else if (codigo_reserva) {
        sqlQuery = 'SELECT r.codigo_reserva, r.fecha_reserva, r.fecha_in, r.fecha_out, r.costo_total, r.observacion, r.estado, h.numero, h.piso, h.descripcion, h.precio_dia, h.tipo_habitacion, h.aforo, p.nombres, p.apellidos, p.tipo_doc, p.numero_doc, p.fecha_nacimiento, p.telefono FROM reserva r JOIN habitacion h ON r.idHabitacion = h.idHabitacion JOIN cliente c ON r.idCliente = c.id_cliente JOIN persona p ON c.id_persona = p.idPersona WHERE r.codigo_reserva = ?';
        queryParams = [codigo_reserva];
    }

    db.query(sqlQuery, queryParams, (error, results) => {
        if (error) {
            console.error('Error al realizar la consulta:', error);
            res.status(500).json({ error: 'Error al realizar la consulta a la base de datos' });
            return;
        }

        // Enviar los resultados de la consulta
        if (results.length > 0) {
            res.json(results);
        } else {
            res.status(404).send('No se encontraron datos');
        }
    });
});

//Este metodo manejo los pagos con mercadopago
app.post('/create_preference', async (req, res) => {
    try {
        const id_reserva = req.body.codigo
        const body = {
            items: [
                {
                    title: req.body.title,
                    quantity: Number(req.body.quantity),
                    unit_price: parseInt(req.body.price),
                    currency_id: 'PEN'
                }
            ],
            back_urls: {
                success: 'http://localhost:3000/pagoExitoso',
                failure: 'http://localhost:3000/home',
                pending: 'http://localhost:3000/home'
            },
            external_reference: id_reserva,
            //auto_return: 'approved',
        };

        

        const preference = new mercadopago.Preference(cliente);
        const result = await preference.create({body});

        // console.log(result);
        // if (result.status === 'approved'){
        //     let query = `UPDATE reserva SET estado = 3 WHERE codigo_reserva = ?`;
        //     db.query(query, [id_reserva], (err, result) => {
        //         if (err) {
        //             console.error('Error al actualizar el estado de la reserva:', err);
        //             res.status(500).json({ error: 'Error al actualizar el estado de la reserva' });
        //             return;
        //         }
        //     });
        // }

        res.json({ id: result.id });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al crear la preferencia de pago' });
    }
});


//Aqui se maneja la pag de pago exitoso

app.get('/pagoExitoso', async (req, res) => {
    const paymentStatus = req.query.status;
    const externalReference = req.query.external_reference;

    if (paymentStatus === 'approved') {
        let query = `UPDATE reserva SET estado = 3 WHERE codigo_reserva = ?`;
        db.query(query, [externalReference], (err, result) => {
            if (err) {
                console.error('Error al actualizar el estado de la reserva:', err);
                res.status(500).json({ error: 'Error al actualizar el estado de la reserva' });
                return;
            }
        });
    }

    // Aquí puedes redirigir al usuario a la página que desees o mostrar un mensaje
    res.redirect('/home');
});
//Este metodo carga la pagina principal
app.get('/home', function (peticion, respuesta) {
    respuesta.sendFile(__dirname + '/public/index.html');
});

app.get('/home_admin', function (peticion, respuesta) {
    respuesta.sendFile(__dirname + '/public/page_admin.html');
});

//Este metodo establece el puerto en el que se ejecutara el servidor
app.listen(3000, function (peticion, respuesta) {
    console.log('Pagina corriendo en el puerto: http://localhost:3000');
});

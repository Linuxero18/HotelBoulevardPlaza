




let tiposHabitacion = {
    1: 'Habitación Simple',
    2: 'Habitación Doble',
    3: 'Habitación Superior'
};



//Este es el div que oculta y muestra el resumen de la estadía
let divHabitaciones = document.getElementById('habitaciones');

//Esta es la data sin filtrar, se usa para poder determinar cuales habitaciones se asignan a la reserva
let dataCompleta = recuperarDatos();
console.log(dataCompleta);

//Variable que controla cuantos huespedes van en la reserva y asi pedir sus datos
let huespedesTotales = dataCompleta[0].numAdultos + dataCompleta[0].numNinos;

//Variable que cuenta cuantos adultos hay en la reserva
let adultosTotales = dataCompleta[0].numAdultos;
//Contador para controlar el numero de veces que se mostrara el formulario de huespedes
let numeroHuesped = 1;

//Almacenamiento de id de personas
let idPersonas = [];

//Almacenamiento de id de clientes
let idClientes = [];

//Almacenacenamiento de los id de las habitaciones seleccionadas
let idHabitaciones = [];

//Cuenta cuantas habitaciones tipo simple se han seleccionado
let contadorHabitacionSimple = 0;

//Cuenta cuantas habitaciones tipo doble se han seleccionado
let contadorHabitacionDoble = 0;

//Cuenta cuantas habitaciones tipo superior se han seleccionado
let contadorHabitacionSuperior = 0;

//Costo total de la reserva
let costoTotalConIGV = 0;



//Esta funcion trae todos los datos de habitaciones de la base de datos
function recuperarDatos() {
    let data = JSON.parse(localStorage.getItem('habitaciones'));
    return data;
}

//Y esta filtra las habitaciones para que solo se muestre una de cada tipo
function filtrarDatos(data) {
    const seenTypes = {};
    const dataFiltrada = data.filter(habitacion => {
        if (seenTypes[habitacion.tipo_habitacion]) {
            return false;
        } else {
            seenTypes[habitacion.tipo_habitacion] = true;
            return true;
        }
    });
    return dataFiltrada;
}

//Aqui formateo la fecha para que se muestre de manera mas legible
function formatearFecha(fecha) {
    let fechaFormateada = new Date(fecha);
    let opciones = { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit' };
    return fechaFormateada.toLocaleDateString('es-ES', opciones);
}


//Aqui calculo la duracion de la estadia
function calcularEstancia(fechaEntrada, fechaSalida) {
    if (!(fechaEntrada instanceof Date) || !(fechaSalida instanceof Date)) {
        return NaN;
    }

    // Calcula la diferencia en milisegundos
    let diferencia = fechaSalida.getTime() - fechaEntrada.getTime();

    // Convierte la diferencia en días y redondea al número entero más cercano
    let dias = Math.round(diferencia / (1000 * 60 * 60 * 24));

    return dias;
}

function crearTarjetaHabitacion(habitacion, contador) {
    let div = document.createElement('div');
    div.className = 'col-md-4 divHabitacionesCard';
    div.dataset.tipo = habitacion.tipo_habitacion;
    div.dataset.fechaEntrada = habitacion.fechaEntrada;
    div.dataset.fechaSalida = habitacion.fechaSalida;
    div.dataset.numAdultos = habitacion.numAdultos;
    div.dataset.numNinos = habitacion.numNinos;
    div.dataset.numPersonas = habitacion.numPersonas;
    div.dataset.aforo = habitacion.aforo;
    div.dataset.precio_dia = habitacion.precio_dia;

    let cantidadMaxHab = dataCompleta.filter(habitacionx => habitacionx.tipo_habitacion === habitacion.tipo_habitacion);

    div.innerHTML = `
            <div class="card text-dark text-center bg-light p-2">
                <img src="img/home-2.jpg" alt="" class="card-img-top">
                <div class="card-body">
                    <h5 class="card-title">${tiposHabitacion[habitacion.tipo_habitacion]}</h5>
                    <p class="card-text">${habitacion.descripcion}</p>
                    <hr>
                    <p class="card-text">Desde ${habitacion.precio_dia} S/. por noche</p>
                    <div class="input-group mb-3">
                        <input type="number" value="0" min="0" max="${cantidadMaxHab.length}" id="cantHab${contador}" class="form-control" placeholder="Ingrese cantidad de habitaciones" aria-label="Recipient's username" aria-describedby="basic-addon2">
                        <a href="#" class="btn btn-reservar mt-auto">Seleccionar</a>
                    </div>
                    
                </div>
            </div>
        `;
    return div;
}



window.onload = function () {
    let datos = recuperarDatos();
    let datosFiltrados = filtrarDatos(datos);
    let contenedor = document.getElementById('contenedor-de-tarjetas');

    // Elimina las tarjetas preexistentes
    contenedor.innerHTML = '';

    // Muestra las fechas de entrada y salida
    fechaEntrada = new Date(datos[0].fechaEntrada);
    fechaSalida = new Date(datos[0].fechaSalida);
    let fechaEntradaMostrar = formatearFecha(fechaEntrada);
    let fechaSalidaMostrar = formatearFecha(fechaSalida);

    document.getElementById('fechaEntradaMostrar').innerHTML += fechaEntradaMostrar;
    document.getElementById('fechaSalidaMostrar').innerHTML += fechaSalidaMostrar;

    //Muestra la cantidad de adultos y niños
    let numAdultos = datos[0].numAdultos;
    let numNinos = datos[0].numNinos;
    document.getElementById('numAdultosMostrar').innerHTML += numAdultos;
    document.getElementById('numNinosMostrar').innerHTML += numNinos;

    // data es un array con los datos de las habitaciones
    let contador = 1;
    datosFiltrados.forEach(habitacion => {
        let div = crearTarjetaHabitacion(habitacion, contador);
        contador++;
        contenedor.appendChild(div);

        // Selecciona el botón que se acaba de crear
        let btn = div.querySelector('.btn');
        // Selecciona el input que se acaba de crear
        let input = div.querySelector('input');
        //Le añadimos la clase para deshabilitarlo, esto esta en la hoja de CSS estilos.css
        btn.classList.add('disabled');
        

        //deshabilita el boton si la cantidad de habitaciones es 0 y lo habilita si es mayor a 0
        input.addEventListener('change', function () {
            if (input.value === '0') {
                btn.classList.add('disabled');
            } else {
                btn.classList.remove('disabled');
            }
        });

        // Añade el evento de clic al botón
        btn.addEventListener('click', function (event) {

            event.preventDefault();


            let tarjetas = document.querySelectorAll('.divHabitacionesCard');
            // recorrerTarjetasHabitaciones(tarjetas);
            let tipo = "";
            let fechaEntrada = null;
            let fechaSalida = null;
            let numAdultos = 0;
            let numNinos = 0;
            let numPersonas = 0;
            let aforo = 0;
            let precio_dia = 0;
            let j = 1;
            let cantidadHabitaciones = 0;
            let totalprecio = 0;
            let tiposHabitacionesCant = 0;
            tarjetas.forEach(function (tarjeta) {
                // Accede a los valores del dataset
                tipo = tarjeta.dataset.tipo;
                console.log(tipo);
                fechaEntrada = new Date(tarjeta.dataset.fechaEntrada);
                fechaSalida = new Date(tarjeta.dataset.fechaSalida);
                numAdultos = tarjeta.dataset.numAdultos;
                numNinos = tarjeta.dataset.numNinos;
                numPersonas = tarjeta.dataset.numPersonas;
                aforo = tarjeta.dataset.aforo;
                precio_dia = parseFloat(tarjeta.dataset.precio_dia);
                cantidadHabitaciones = parseInt(document.getElementById("cantHab" + j + "").value);
                if (cantidadHabitaciones != 0) {
                    tiposHabitacionesCant = tiposHabitacionesCant + cantidadHabitaciones + " " + tiposHabitacion[tipo] + " ,";
                    totalprecio = (totalprecio + precio_dia) * cantidadHabitaciones;
                    
                    if(tarjeta.dataset.tipo === "1"){
                        contadorHabitacionSimple +=1;
                    }
                    else if(tarjeta.dataset.tipo === "2"){
                        contadorHabitacionDoble +=1;
                    }
                    else if(tarjeta.dataset.tipo === "3"){
                        contadorHabitacionSuperior +=1;
                    }
                        

                }


                j++;
                

            });
            
            
            

            //Muestra la habitacion seleccionada
            let habitacionSeleccionada = document.getElementById('tipoHabitacionMostrar');
            habitacionSeleccionada.innerHTML = 'Tipo de habitacion: ' + tiposHabitacionesCant;

            //Calcular y mostrar la duración de la estancia
            let diasEstancia = calcularEstancia(fechaEntrada, fechaSalida);
            console.log("Estos son los dias de estancia: " + diasEstancia);
            let mostrarEstancia = document.getElementById('duracionEstanciaMostrar');
            if (diasEstancia === 1) {
                mostrarEstancia.innerHTML = 'Duración de la estadia: ' + diasEstancia + ' noche';
            } else {
                mostrarEstancia.innerHTML = 'Duración de la estadia: ' + diasEstancia + ' noches';
            }

            //Mostrar el precio por noche
            let precioNoche = document.getElementById('precioNocheMostrar');
            precioNoche.innerHTML = 'Precio por noche: ' + totalprecio + ' S/.';

            //Carlcular y mostrar el costo total de la estancia
            let costoTotal = totalprecio * diasEstancia;
            let costoTotalMostrar = document.getElementById('costoTotalMostrar');
            costoTotalMostrar.innerHTML = 'Precio total de la estadía: ' + costoTotal + ' S/.';

            //Calcular el IGV
            let igv = costoTotal * 0.18;
            igv = igv.toFixed(2);
            let igvMostrar = document.getElementById('mostrarIGV');
            igvMostrar.innerHTML = 'IGV(18%): ' + igv + ' S/.';

            //Calcular el costo total con IGV
            costoTotalConIGV = parseFloat(costoTotal) + parseFloat(igv);
            let costoTotalConIGVMostrar = document.getElementById('mostrarCostoTotalConIGV');
            costoTotalConIGVMostrar.innerHTML = 'Total: ' + costoTotalConIGV + ' S/.';

            //Mostrar el carrito
            let carritoCheckout = document.querySelector('.reservation-cart-container_box');

            divHabitaciones.classList.remove('col-md-12');
            divHabitaciones.classList.add('col-md-8');


            carritoCheckout.style.display = 'block';



        });
    });
}


//Funcion para calcular la mayoria de edad y validar el formulario
function calcularEdad(fechaNac) {
    let fechaNacimiento = new Date(fechaNac);
    let fechaActual = new Date();
    let edad = fechaActual.getFullYear() - fechaNacimiento.getFullYear();
    let mes = fechaActual.getMonth() - fechaNacimiento.getMonth();

    if (mes < 0 || (mes === 0 && fechaActual.getDate() < fechaNacimiento.getDate())) {
        edad--;
    }
    return edad;
}



//Mostrar el formulario de reserva tras darle click al boton de reservar
//Este es el div que oculta y muestra el formulario de huespedes
let divFormulario = document.getElementById("divDelFormulario");
//Este es el formulario que se muestra para ingresar los datos de los huespedes
let formularioReservaHabitacion = document.getElementById('formularioReserva');
//Este es el titulo que se muestra en el formulario de huespedes
let tituloFormulario = document.getElementById('tituloFormHuespedes');

let botonReservar = document.getElementById('continuarReserva');
let botonContinuarReserva = document.getElementById('btnEnviarReserva');
botonReservar.addEventListener('click', function (event) {
    event.preventDefault();
    divFormulario.style.display = 'block';
    divFormulario.scrollIntoView({ behavior: "smooth" });
    tituloFormulario.innerHTML = "";
    tituloFormulario.innerHTML = 'Datos del Huesped';
    botonContinuarReserva.innerHTML = '';
    botonContinuarReserva.innerHTML = 'Registra Huesped';
    //this.style.display = 'none';
});


botonContinuarReserva.addEventListener('click', async function (event) {
    event.preventDefault();
    if (numeroHuesped <= adultosTotales) {

        console.log("NUmero de huespedes " + numeroHuesped);
        console.log("Numero de adultos totales " + adultosTotales);

        tituloFormulario.innerHTML = 'Datos del Huesped #' + numeroHuesped;
        let nombres = document.getElementById('nombres').value;
        let apellidos = document.getElementById('apellidos').value;
        let tipoDoc = document.getElementById('tipoDocumento').value;
        let documento = document.getElementById('documento').value;
        let fechaNac = document.getElementById('fechaNacimiento').value;
        let direccion = document.getElementById('direccion').value;
        let telefono = document.getElementById('telefono').value;
        let correo = document.getElementById('correo').value;


        console.log("Datos:");
        console.log(nombres, apellidos, tipoDoc, documento, fechaNac, direccion, telefono, correo);


        //Realizar la validación de los campos
        if (nombres === "" || apellidos === "" || tipoDoc === "" || fechaNac == "" || documento === "" || direccion === "" || telefono === "" || correo === "") {
            Swal.fire({
                icon: "error",
                title: "Alerta!",
                text: "Todos los campos son obligatorios!",
                confirmButtonColor: "#48a04b"
            });
            return;
        }
        if ((tipoDoc=="DNI" && (documento.length < 8 || documento.length  > 9)) || (tipoDoc=="CE" && (documento.length < 9 || documento.length  > 9)) || (tipoDoc=="PASAPORTE" && (documento.length < 8 || documento.length  > 8))){
            Swal.fire({
                icon: "error",
                title: "Alerta!",
                text: "La longitud del numero de documento ingresado es incorrecto! (DNI: 8 digitos, CE: 9 digitos, PASAPORTE: 8 digitos)",
                confirmButtonColor: "#48a04b"
            });
            return;
        }
        if(validator.isNumeric(documento) == false){
            Swal.fire({
                icon: "error",
                title: "Alerta!",
                text: "El numero de documento no debe contener letras!",
                confirmButtonColor: "#48a04b"
            });
            return;
        }
        // || validator.isAlpha(apellidos, ' ') == false
        if(validator.isAlpha(nombres,'es-ES',{ignore:' '}) == false ){
            Swal.fire({
                icon: "error",
                title: "Alerta!",
                text: "Los nombres y apellidos no pueden contener numeros!",
                confirmButtonColor: "#48a04b"
            });
            return;
        }
        if((telefono.length < 9 || telefono.length >9 ) || validator.isNumeric(telefono) == false){
            Swal.fire({
                icon: "error",
                title: "Alerta!",
                text: "El numero de telefono no es valido! ( deben ser 9 digitos y solo numeros!)",
                confirmButtonColor: "#48a04b"
            });
            return;
        }
        if(validator.isEmail(correo) == false){
            Swal.fire({
                icon: "error",
                title: "Alerta!",
                text: "El formato de correo electronico no es valido!",
                confirmButtonColor: "#48a04b"
            });
            return;
        }
        if(calcularEdad(fechaNac) < 18){
            Swal.fire({
                icon: "error",
                title: "Alerta!",
                text: "La fecha de nacimiento no es valida, eres menor de edad!",
                confirmButtonColor: "#48a04b"
            });
            return;
        }

        

        fetch('registrarpersonareserva', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombres: nombres,
                apellidos: apellidos,
                tipoDoc: tipoDoc,
                documento: documento,
                fechaNac: fechaNac,
                direccion: direccion,
                telefono: telefono,
                correo: correo
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.status === 'success') {
                    Swal.fire({
                        title: `Huesped registrado correctamente!`,
                        text: "Si hay mas huespedes adultos, por favor registrelos",
                        icon: "success",
                        confirmButtonColor: "#48a04b"
                    }).then(async (result) => {
                        if (result.value) {
                            formularioReservaHabitacion.reset(); // Resetear el formulario una vez que se ha insertado el reclamo correctamente
                            obtenerIdsHabitaciones();
                            console.log(idHabitaciones);
                            
                            idPersonas.push(data.idPersona);
                            console.log("estos son los id de las personas: " + idPersonas[0]);
                            numeroHuesped++;
                            if (numeroHuesped > adultosTotales) {
                                botonContinuarReserva.innerHTML = '';
                                botonContinuarReserva.innerHTML = 'Finalizar Reserva';

                                let errorOcurrido = false;
                                let codigoReserva = generarCodigoReserva();

                                let x = 0;
                                for (let controladorPersona = 0; controladorPersona < idPersonas.length && !errorOcurrido; controladorPersona++) {
                                    await registrarPersonaComoCliente(idPersonas[controladorPersona], errorOcurrido, idClientes);
                                    for (let controladorHabitacion = 0; controladorHabitacion < idHabitaciones.length && !errorOcurrido; controladorHabitacion++) {
                                        await registrarReserva(idClientes[controladorPersona], idHabitaciones[controladorHabitacion], codigoReserva, errorOcurrido);
                                    }
                                }
                                console.log("Me sali del while");
                            }
                        }
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error al registrar el huesped!",
                        text: "puede que ya tenga una reserva activa, comuniquese con nosotros para mas informacion!",
                        confirmButtonColor: "#48a04b"
                    });
                }
            })
            .catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: "Error!",
                    text: "Error al registrar el huesped" + error,
                    confirmButtonColor: "#48a04b"
                });
                console.error('Error:', error);
            });
    }
});

async function registrarPersonaComoCliente(idPersona, errorOcurrido) {
    try {
        let response = await fetch('registrarpersonacliente', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idpersona: idPersona
            })
        });

        let data = await response.json();

        if (data.status === 'success') {
            console.log('Persona registrada como cliente');
            idClientes.push(data.idCliente);
        } else {
            console.log('Error al registrar persona como cliente');
            errorOcurrido = true; // Cambiar la variable de control a true si ocurre un error
        }
    } catch (error) {
        console.error('Error:', error);
        errorOcurrido = true;
    }
}

async function registrarReserva(idCliente, idHabitacion, codigoReserva, errorOcurrido) {

    

    let fecha_reserva = new Date();
    let fecha_in = new Date(dataCompleta[0].fechaEntrada);
    let fecha_out = new Date(dataCompleta[0].fechaSalida);
    //let costoTotalConIGV = parseFloat(document.getElementById('costoTotalMostrar').innerHTML);
    let observacion = "Reserva realizada desde la web";
    let estado = 1;
    try {
        let response = await fetch('registrarreserva', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                codigoReserva: codigoReserva,
                idHabitacion: idHabitacion,
                idCliente: idCliente,
                fecha_reserva: fecha_reserva,
                fecha_in: fecha_in,
                fecha_out: fecha_out,
                costo_total: costoTotalConIGV,
                observacion: observacion,
                estado: estado
            })
        });

        let data = await response.json();

        if (data.status === 'success') {
            Swal.fire({
                title: `Su Reserva se ha realizado Exitosamente!`,
                text: "su numero de reserva es: " + codigoReserva + ", también se lo enviaremos por correo electronico!",
                icon: "success",
                confirmButtonColor: "#48a04b"
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = 'index.html';
                }
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: "Error al registrar la reserva",
                confirmButtonColor: "#48a04b"
            });
            errorOcurrido = true; // Cambiar la variable de control a true si ocurre un error
        }
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Error al registrar la reserva" + error,
            confirmButtonColor: "#48a04b"
        });
        console.error('Error:', error);
        errorOcurrido = true;
    }
}

function generarCodigoReserva() {
    let codigo = '';
    let caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    for (let i = 0; i < 6; i++) {
        codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }

    return codigo;
}

function obtenerIdsHabitaciones2(){

    let habitacionesSeleccionadas = {
        simple: 0,
        doble: 0,
        superior: 0
    };

    console.log(contadorHabitacionSimple, contadorHabitacionDoble, contadorHabitacionSuperior);
    
    if (contadorHabitacionSimple > 0) {
        habitacionesSeleccionadas.simple = 1;
    }
    
    if (contadorHabitacionDoble > 0) {
        habitacionesSeleccionadas.doble = 2;
    }
    
    if (contadorHabitacionSuperior > 0) {
        habitacionesSeleccionadas.superior = 3;
    }

    let filtroDeIds = dataCompleta.filter(habitacion => habitacion.tipo_habitacion === habitacionesSeleccionadas.simple || habitacion.tipo_habitacion === habitacionesSeleccionadas.doble || habitacion.tipo_habitacion === habitacionesSeleccionadas.superior);

    //Recorrer la data filtrada y hacerle push a un array con los ids de las habitaciones
    for (let i = 0; i < filtroDeIds.length; i++) {
        idHabitaciones.push(filtroDeIds[i].idHabitacion);
        console.log(filtroDeIds[i].idHabitacion);
    }
    console.log(filtroDeIds);
    console.log(habitacionesSeleccionadas);
}

//Copilot

function obtenerIdsHabitaciones() {
    let habitacionesSeleccionadas = {
        simple: [],
        doble: [],
        superior: []
    };

    // Filtrar las habitaciones por tipo y seleccionar la cantidad correcta
    habitacionesSeleccionadas.simple = dataCompleta.filter(habitacion => habitacion.tipo_habitacion === 1).slice(0, contadorHabitacionSimple);
    habitacionesSeleccionadas.doble = dataCompleta.filter(habitacion => habitacion.tipo_habitacion === 2).slice(0, contadorHabitacionDoble);
    habitacionesSeleccionadas.superior = dataCompleta.filter(habitacion => habitacion.tipo_habitacion === 3).slice(0, contadorHabitacionSuperior);

    // Concatenar las habitaciones seleccionadas y obtener los IDs
    let habitaciones = [...habitacionesSeleccionadas.simple, ...habitacionesSeleccionadas.doble, ...habitacionesSeleccionadas.superior];
    idHabitaciones = habitaciones.map(habitacion => habitacion.idHabitacion);

    console.log(idHabitaciones);
}
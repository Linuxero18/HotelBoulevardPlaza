
let tiposHabitacion = {
    1: 'Habitación Simple',
    2: 'Habitación Doble',
    3: 'Habitación Superior'
};

let listaHabitaciones = [];

let botonAñadirHabitacion = document.getElementById('agregarHabitacion');

let contarClicks = 0;
let divHabitaciones = document.getElementById('habitaciones');

let dataCompleta = recuperarDatos();

function recuperarDatos() {
    let data = JSON.parse(localStorage.getItem('habitaciones'));
    console.log(data);
    return data;
}

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

function formatearFecha(fecha) {
    let fechaFormateada = new Date(fecha);
    let opciones = { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit' };
    return fechaFormateada.toLocaleDateString('es-ES', opciones);
}

function calcularEstancia(fechaEntrada, fechaSalida) {
    // Asegúrate de que las fechas son objetos Date
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
    console.log(habitacion.precio_dia) ;
    let cantidadMaxHab = dataCompleta.filter(habitacionx => habitacionx.tipo_habitacion === habitacion.tipo_habitacion);
    console.log(cantidadMaxHab);
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

function recorrerTarjetasHabitaciones(tarjetas) {
    // Itera sobre las tarjetas
    tarjetas.forEach(function (tarjeta) {
        // Accede a los valores del dataset
        let tipo = tarjeta.dataset.tipo;
        let fechaEntrada = tarjeta.dataset.fechaEntrada;
        let fechaSalida = tarjeta.dataset.fechaSalida;
        let numAdultos = tarjeta.numAdultos;
        let numNinos = tarjeta.numNinos;
        let numPersonas = tarjeta.numPersonas;
        let aforo = tarjeta.aforo;
        let precio_dia = tarjeta.precio_dia;
        // ... y así sucesivamente para los demás valores del dataset
    });
}

function deshabilitarOtrosBotones() {
    //Deshabilitar los otros botones
    let botones = document.querySelectorAll('.btn');
    botones.forEach(boton => {
        if (boton !== this) {
            boton.classList.add('disabled');
        }
    });
}

function alterarBotones(btn) {

    // Cambia el contenido del botón a un icono de verificación
    btn.innerHTML = '<i class="fas fa-check fa-sm"></i>';

    //this.classList.remove('btn-primary');
    //this.classList.add('btn-success');
    btn.removeAttribute('href');
    btn.classList.add('disabled'); // Añade una clase 'disabled'

    deshabilitarOtrosBotones();
}








window.onload = function () {
    // // Recupera los datos del localStorage
    // let data = JSON.parse(localStorage.getItem('habitaciones'));
    // console.log(data);
    // const seenTypes = {};
    // const dataFiltrada = data.filter(habitacion => {
    //     if (seenTypes[habitacion.tipo_habitacion]) {
    //         // Si ya hemos visto este tipo de habitación, no lo incluyas en los datos filtrados
    //         return false;
    //     } else {
    //         // Si no hemos visto este tipo de habitación, márcalo como visto y inclúyelo en los datos filtrados
    //         seenTypes[habitacion.tipo_habitacion] = true;
    //         return true;
    //     }
    // });
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
    console.log(fechaEntradaMostrar);
    console.log(fechaSalidaMostrar);

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

        // Selecciona el botón que acabas de añadir
        let btn = div.querySelector('.btn');

        // Añade el evento de clic al botón
        btn.addEventListener('click', function (event) {
            contarClicks++;
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
                }
                

                j++;
                // ... y así sucesivamente para los demás valores del dataset

            });
            // tipo = div.dataset.tipo;
            // //let fechaEntrada = div.dataset.fechaEntrada;
            // //let fechaSalida = div.dataset.fechaSalida;
            // numPersonas = div.dataset.numPersonas;
            // aforo = div.dataset.aforo;
            // precio_dia = div.dataset.precio_dia;
            // console.log(tipo, /*fechaEntrada, fechaSalida,*/ numPersonas, aforo, precio_dia);



            //Muestra la habitacion seleccionada
            let habitacionSeleccionada = document.getElementById('tipoHabitacionMostrar');
            habitacionSeleccionada.innerHTML = 'Tipo de habitacion: ' +  tiposHabitacionesCant;

            //Calcular y mostrar la duración de la estancia
            let diasEstancia = calcularEstancia(fechaEntrada, fechaSalida);
            console.log(diasEstancia);
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
            let costoTotalConIGV = parseFloat(costoTotal) + parseFloat(igv);
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

function mostrarBotonAñadirHabitacion() {
    if (contarClicks === 1) {
        botonAñadirHabitacion.style.display = 'block';
    }
}

function reactivarBotones() {

    botonAñadirHabitacion.addEventListener('click', function (event) {
        event.preventDefault();
        let botonesHabitaciones = document.querySelectorAll('.btn-reservar');
        botonesHabitaciones.forEach(boton => {
            if (boton !== this) {
                boton.classList.remove('disabled');
                boton.innerHTML = 'Seleccionar';
            }
        });
    });

}

//Mostrar el formulario de reserva tras darle click al boton de reservar
let botonReservar = document.getElementById('continuarReserva');
let formularioReserva = document.getElementById('formularioReserva');
botonReservar.addEventListener('click', function (event) {
    event.preventDefault();
    formularioReserva.style.display = 'block';
    formularioReserva.scrollIntoView({ behavior: "smooth"});
    //this.style.display = 'none';
});





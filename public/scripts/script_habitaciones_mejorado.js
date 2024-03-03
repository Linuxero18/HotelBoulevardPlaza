let tiposHabitacion = {
    1: 'Habitación Simple',
    2: 'Habitación Doble',
    3: 'Habitación Superior'
};

let listaHabitaciones = [];
let botonAñadirHabitacion = document.getElementById('agregarHabitacion');
let contarClicks = 0;

window.onload = function () {
    recuperarDatos();
}

function recuperarDatos() {
    let data = JSON.parse(localStorage.getItem('habitaciones'));
    console.log(data);
    filtrarDatosUnicosPorTipo(data);
}

function filtrarDatosUnicosPorTipo(data) {
    const seenTypes = {};
    const dataFiltrada = data.filter(habitacion => {
        if (seenTypes[habitacion.tipo_habitacion]) {
            return false;
        } else {
            seenTypes[habitacion.tipo_habitacion] = true;
            return true;
        }
    });
    mostrarInformacion(data, dataFiltrada);
}

function mostrarInformacion(data, dataFiltrada) {
    mostrarFechas(data);
    mostrarCantidadAdultosYNiños(data);
    generarTarjetasHabitaciones(dataFiltrada);
}

function mostrarFechas(data) {
    let fechaEntradaMostrar = new Date(data[0].fechaEntrada);
    let fechaSalidaMostrar = new Date(data[0].fechaSalida);
    let opciones = { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit' };

    document.getElementById('fechaEntradaMostrar').innerHTML += fechaEntradaMostrar.toLocaleDateString('es-ES', opciones);
    document.getElementById('fechaSalidaMostrar').innerHTML += fechaSalidaMostrar.toLocaleDateString('es-ES', opciones);
}

function mostrarCantidadAdultosYNiños(data) {
    document.getElementById('numAdultosMostrar').innerHTML += data[0].numAdultos;
    document.getElementById('numNinosMostrar').innerHTML += data[0].numNinos;
}

function generarTarjetasHabitaciones(dataFiltrada) {
    let contenedor = document.getElementById('contenedor-de-tarjetas');
    contenedor.innerHTML = ''; // Elimina las tarjetas preexistentes

    dataFiltrada.forEach((habitacion, index) => {
        crearTarjetaHabitacion(habitacion, contenedor, index + 1);
    });
}

function crearTarjetaHabitacion(habitacion, contenedor, contador) {
    let div = document.createElement('div');
    div.className = 'col-md-4';
    div.id = 'habitacion' + contador;
    asignarDatosHabitacion(div, habitacion);

    div.innerHTML = generarHTMLTarjeta(habitacion, contador);
    contenedor.appendChild(div);
    
    configurarBotonReserva(div, habitacion);
}

function asignarDatosHabitacion(div, habitacion) {
    div.dataset.tipo = habitacion.tipo_habitacion;
    div.dataset.fechaEntrada = habitacion.fechaEntrada;
    div.dataset.fechaSalida = habitacion.fechaSalida;
    div.dataset.numPersonas = habitacion.numPersonas;
    div.dataset.aforo = habitacion.aforo;
    div.dataset.precio_dia = habitacion.precio_dia;
}

function generarHTMLTarjeta(habitacion, contador) {
    return `
        <div class="card text-dark text-center bg-light p-2">
            <img src="img/home-2.jpg" alt="" class="card-img-top">
            <div class="card-body">
                <h5 class="card-title">${tiposHabitacion[habitacion.tipo_habitacion]}</h5>
                <p class="card-text">${habitacion.descripcion}</p>
                <hr>
                <p class="card-text">Desde ${habitacion.precio_dia} S/. por noche</p>
                <a href="#" class="btn btn-reservar mt-auto" id="boton${contador}">Seleccionar</a>
            </div>
        </div>
    `;
}

function configurarBotonReserva(div, habitacion) {
    let btn = div.querySelector('.btn');
    btn.addEventListener('click', function (event) {
        manejarClicReserva(event, div, habitacion);
    });
}

function manejarClicReserva(event, div, habitacion) {
    event.preventDefault();
    contarClicks++;
    mostrarSeleccionHabitacion(div.dataset.tipo);
    calcularMostrarDetallesEstancia(div);
    deshabilitarOtrosBotones(this);
    mostrarBotonAñadirHabitacion();
    manejarAñadirHabitacion();
}

function mostrarSeleccionHabitacion(tipo) {
    let habitacionSeleccionada = document.getElementById('tipoHabitacionMostrar');
    habitacionSeleccionada.innerHTML += tiposHabitacion[tipo];
}

function calcularMostrarDetallesEstancia(div) {
    let fechaEntrada = new Date(div.dataset.fechaEntrada);
    let fechaSalida = new Date(div.dataset.fechaSalida);
    let duracionEstancia = (fechaSalida - fechaEntrada) / (1000 * 60 * 60 * 24);
    let precioNoche = div.dataset.precio_dia;

    document.getElementById('duracionEstanciaMostrar').innerHTML += duracionEstancia + ' noches';
    document.getElementById('precioNocheMostrar').innerHTML += precioNoche + ' S/.';
    calcularMostrarCostoTotalEstancia(duracionEstancia, precioNoche);
}

function calcularMostrarCostoTotalEstancia(duracionEstancia, precioNoche) {
    let costoTotal = precioNoche * duracionEstancia;
    let igv = (costoTotal * 0.18).toFixed(2);
    let costoTotalConIGV = parseFloat(costoTotal) + parseFloat(igv);

    document.getElementById('costoTotalMostrar').innerHTML += costoTotal + ' S/.';
    document.getElementById('mostrarIGV').innerHTML += igv + ' S/.';
    document.getElementById('mostrarCostoTotalConIGV').innerHTML += costoTotalConIGV + ' S/.';
}

function deshabilitarOtrosBotones(botonPresionado) {
    let botones = document.querySelectorAll('.btn');
    botones.forEach(boton => {
        if (boton !== botonPresionado) {
            boton.classList.add('disabled');
        }
    });
}

function mostrarBotonAñadirHabitacion() {
    if(contarClicks === 1) {
        botonAñadirHabitacion.style.display = 'block';
    }
}

function manejarAñadirHabitacion() {
    if(contarClicks > 1) {
        console.log('Ya se añadió una habitación');
    } else {
        botonAñadirHabitacion.onclick = function (event) {
            añadirHabitacion(event);
        };
    }
}

function añadirHabitacion(event) {
    event.preventDefault();
    console.log('Añadiendo habitación...');
    // Implementar la lógica para añadir una habitación adicional aquí.
}

// Puede que necesites adaptar algunos nombres de variables o estructuras
// específicas de tu implementación original para integrar estos cambios.

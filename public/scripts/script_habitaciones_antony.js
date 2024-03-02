
$(document).ready(function () {
    // Función para obtener parámetros de la URL
    function obtenerParametroURL(nombre) {
        let url = new URL(window.location.href);
        return url.searchParams.get(nombre);
    }

    // Obtener los valores de búsqueda de la URL
    let tipoSeleccionado = obtenerParametroURL('tipoHabitacion');
    let fechaEntrada = obtenerParametroURL('fechaEntrada');
    let fechaSalida = obtenerParametroURL('fechaSalida');
    let numPersonas = obtenerParametroURL('numPersonas');
    document.getElementById('fechaLlegada').value = fechaEntrada;
    document.getElementById('fechaSalida').value = fechaSalida;

    console.log(tipoSeleccionado, fechaEntrada, fechaSalida, numPersonas);
    // Ocultar todas las cartas
    $('.habitaciones-dispo .col-md-4').hide();

    // Mostrar las cartas correspondientes a la búsqueda
    $('.habitaciones-dispo .col-md-4').each(function () {
        let carta = $(this);

        // Obtener los atributos de la carta
        let cartaTipo = carta.data('tipo');
        let cartaFechaInicio = carta.data('fecha-entrada');
        let cartaFechaFin = carta.data('fecha-salida');
        let cartaNumPersonas = carta.data('num-personas');

        // Comparar con los valores del formulario
        if (
            (tipoSeleccionado === 'cualquiera' || tipoSeleccionado === cartaTipo) &&
            (cartaFechaInicio === '' || fechaEntrada >= cartaFechaInicio) &&
            (cartaFechaFin === '' || fechaSalida <= cartaFechaFin) &&
            (cartaNumPersonas === '' || numPersonas <= cartaNumPersonas)
        ) {
            carta.show();
        }
    });

    // Mostrar mensaje si no se encontraron habitaciones
    if ($('.habitaciones-dispo .col-md-4:visible').length === 0) {
        $('#mensajeNoHabitaciones').show();
    }
});

$(document).ready(function () {
    function mostrarMensajeNoHabitaciones() {
        $('#mensajeNoHabitaciones').show();
    }

    // Función para mostrar/ocultar el formulario de reserva con animación
    function toggleFormularioReserva() {
        $('#formularioReserva').slideToggle();
        // Oculta el mensaje de reserva exitosa cuando se muestra el formulario
        $('#mensajeReservaExitosa').hide();
    }

    // Asocia la función al botón "Reservar" de cada tarjeta
    $('.btn-reservar').click(function (event) {
        event.preventDefault(); 
        toggleFormularioReserva();
    });

    // Manejar el envío del formulario de reserva
    $('#formularioReserva').submit(function (event) {
        event.preventDefault(); // Evitar el envío normal del formulario

        // Aquí agregar la lógica para procesar la reserva, generar un código, etc.

        // Mostrar el mensaje de reserva exitosa y el código de reserva
        $('#mensajeReservaExitosa').show();
        let codigoReserva = generarCodigoReserva();
        $('#codigoReserva').text(codigoReserva);
        
        // Otra opción: si tienes un servicio backend que maneja reservas, puedes hacer una solicitud AJAX aquí
    });

    function generarCodigoReserva() {
        // Lógica para generar un código de reserva (puedes personalizar según tus necesidades)
        return 'ABC123';
    }

    if ($('.habitaciones-dispo .col-md-4:visible').length === 0) {
        mostrarMensajeNoHabitaciones();
    }

// Validaciones adicionales usando JavaScript
$('#documento').on('input', function () {
// Limitar la longitud del documento a 10 caracteres
if ($(this).val().length > 10) {
    $(this).val($(this).val().slice(0, 10));
}
});
$('#cantHabitaciones, #cantHabitaciones2').on('input', function () {
// Limitar la cantidad de habitaciones a un número máximo
let maxHabitaciones = 4; // Puedes ajustar este valor según tus necesidades
if ($(this).val() > maxHabitaciones) {
    $(this).val(maxHabitaciones);
}

// Limitar la cantidad de habitaciones adicionales a un número máximo
let maxHabitacionesAdicionales = 4; // Puedes ajustar este valor según tus necesidades
if ($('#cantHabitaciones').val() > 0 && $('#cantHabitaciones2').val() > maxHabitacionesAdicionales) {
    $('#cantHabitaciones2').val(maxHabitacionesAdicionales);
}
});

});

// Configurar la fecha mínima de llegada al día actual
window.onload = function () {
let fecha = new Date();
let dia = fecha.getDate();
let mes = fecha.getMonth() + 1;
let ano = fecha.getFullYear();

if (dia < 10) {
    dia = "0" + dia;
}

if (mes < 10) {
    mes = "0" + mes;
}

fecha = ano + "-" + mes + "-" + dia;
document.getElementById("fechaLlegada").setAttribute("min", fecha);
};

// Actualizar la fecha mínima de salida al seleccionar una fecha de llegada
function actualizarFechaSalidaMin() {
let fechaEntrada = document.getElementById("fechaLlegada").value;
document.getElementById("fechaSalida").setAttribute("min", fechaEntrada);
}
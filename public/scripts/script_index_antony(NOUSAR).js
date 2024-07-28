$(document).ready(function () {
    // Restricciones de fechas al cargar la página
    let fechaActual = obtenerFechaActual();
    $('#fechaEntrada').attr('min', fechaActual);
    $('#fechaSalida').attr('min', fechaActual);

    // Restricciones de fechas al cambiar la fecha de entrada
    $('#fechaEntrada').change(function () {
        let fechaEntrada = $(this).val();
        $('#fechaSalida').attr('min', fechaEntrada);
    });
});

function obtenerFechaActual() {
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

    return ano + "-" + mes + "-" + dia;
}

document.getElementById('buscarForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Evitar el envío normal del formulario

    // Lógica de búsqueda aquí
    realizarBusqueda();

    // Limpiar valores después de enviar la búsqueda
    document.getElementById('tipoHabitacion').value = 'cualquiera';
    document.getElementById('fechaEntrada').value = '';
    document.getElementById('fechaSalida').value = '';
    document.getElementById('numPersonas').value = '1';
});

function realizarBusqueda() {
    let tipoHabitacion = document.getElementById('tipoHabitacion').value;
    let fechaEntrada = document.getElementById('fechaEntrada').value;
    let fechaSalida = document.getElementById('fechaSalida').value;
    let numPersonas = document.getElementById('numPersonas').value;

    // Construir la URL con los parámetros de búsqueda
    let url = 'habitaciones.html' +
        '?tipoHabitacion=' + encodeURIComponent(tipoHabitacion) +
        '&fechaEntrada=' + encodeURIComponent(fechaEntrada) +
        '&fechaSalida=' + encodeURIComponent(fechaSalida) +
        '&numPersonas=' + encodeURIComponent(numPersonas);

    // Redirigir a habitaciones.html con los parámetros de búsqueda
    window.location.href = url;
}
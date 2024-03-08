document.addEventListener('DOMContentLoaded', function() {

    //Capturar el boton de buscar
    let botonBuscar = document.getElementById('btnBuscarReserva');

    //Tipos de habitacion
    let tiposHabitacion = {
        1: 'Habitación Simple',
        2: 'Habitación Doble',
        3: 'Habitación Superior'
    };

    //Estados de la reserva
    let estadosReserva = {
        1: 'Pendiente',
        2: 'Cancelada',
        3: 'Pagada'
    };

    //Agregar el evento click al boton
    botonBuscar.addEventListener('click', function(event) {

        //Prevenir el comportamiento por defecto
        event.preventDefault();
        //Capturar los datos
        let datos = capturarDatos();

        //Enviar los datos al servidor
        fetch('/buscarreserva', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            })
            .then(response => response.json())
            .then(data => {
                //Mostrar los datos en la tabla
                console.log(data);
                mostrarDatos(data);
            })
            .catch(error => console.error('Error:', error));

    });


    //Capturar los valores para la busqueda
    function capturarDatos() {
        let tipoDeDocumento = document.getElementById('tipoDocumentoBusqueda').value;
        let numeroDeDocumento = document.getElementById('numeroDocumentoBusqueda').value;
        let apellidos = document.getElementById('apellidosBusqueda').value;
        let numeroReserva = document.getElementById('codigoReservaBusqueda').value;

        tipoDeDocumento = tipoDeDocumento === "" ? null : tipoDeDocumento;
        numeroDeDocumento = numeroDeDocumento === "" ? null : numeroDeDocumento;
        apellidos = apellidos === "" ? null : apellidos;
        numeroReserva = numeroReserva === "" ? null : numeroReserva;

        let datos = {
            tipo_documento: tipoDeDocumento,
            numero_documento: numeroDeDocumento,
            apellidos: apellidos,
            codigo_reserva: numeroReserva
        }
        return datos;
    }

    //Funcion para mostrar los datos en el formulario
    function mostrarDatos(resultados) {

        //Información del cliente
        let nombres = resultados[0].nombres;
        let apellidos = resultados[0].apellidos;
        let tipoDocumento = resultados[0].tipo_doc;
        let numeroDocumento = resultados[0].numero_doc;
        let fechaNacimiento = resultados[0].fecha_nacimiento;
        let telefono = resultados[0].telefono;


        //Información de la reserva
        let codigoDeLaReserva = resultados[0].codigo_reserva;
        let fechaDeLaReserva = resultados[0].fecha_reserva;
        let tipoDeLaHabitacion = resultados[0].tipo_habitacion;
        let fechaDeLaEntrada = resultados[0].fecha_in;
        let fechaDeLaSalida = resultados[0].fecha_out;
        let costoTotal = resultados[0].costo_total;
        let estadoDeLaReserva = resultados[0].estado;
        
        //Mostrar los datos en el formulario
        document.getElementById('nombresResultado').innerHTML = nombres;
        document.getElementById('apellidosResultado').innerHTML = apellidos;
        document.getElementById('tipoDocResultado').innerHTML = tipoDocumento;
        document.getElementById('documentoResultado').innerHTML = numeroDocumento;
        document.getElementById('fechaNacResultado').innerHTML = fechaNacimiento;
        document.getElementById('telefonoResultado').innerHTML = telefono;
        document.getElementById('reservaCodResultado').innerHTML = codigoDeLaReserva;
        document.getElementById('reservaFechaResultado').innerHTML = fechaDeLaReserva;
        document.getElementById('tipoHabResultado').innerHTML = tiposHabitacion[tipoDeLaHabitacion];
        document.getElementById('fechaInResultado').innerHTML = fechaDeLaEntrada;
        document.getElementById('fechaOutResultado').innerHTML = fechaDeLaSalida;
        document.getElementById('reservaCostoResultado').innerHTML = costoTotal;
        document.getElementById('estadoResultado').innerHTML = estadosReserva[estadoDeLaReserva];

    }



});
function manejarCampos() {
    let opcion1Checked = document.getElementById("busquedaDocumento").checked;
    document.getElementById("codigoReservaBusqueda").disabled = opcion1Checked;
    document.getElementById("codigoReservaBusqueda").value = "";

    let opcion2Checked = document.getElementById("busquedaCodigo").checked;
    document.getElementById("tipoDocumentoBusqueda").disabled = opcion2Checked;
    document.getElementById("numeroDocumentoBusqueda").disabled = opcion2Checked;
    document.getElementById("apellidosBusqueda").disabled = opcion2Checked;
    document.getElementById("tipoDocumentoBusqueda").value = "DNI";
    document.getElementById("numeroDocumentoBusqueda").value = "";
    document.getElementById("apellidosBusqueda").value = "";

}

//Aqui formateo la fecha para que se muestre de manera mas legible
function formatearFecha(fecha) {
    let fechaFormateada = new Date(fecha);
    let opciones = { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit' };
    return fechaFormateada.toLocaleDateString('es-ES', opciones);
}



document.addEventListener('DOMContentLoaded', function () {

    //Capturar el boton de buscar
    let botonBuscar = document.getElementById('btnBuscarReserva');

    //Capturar la seccion para mostrar los resultados
    let seccionResultados = document.getElementById('resultados');


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

    //Este metodo maneja si los campos del formulario estan habilitados o no
    

    //Agregar el evento click al boton
    botonBuscar.addEventListener('click', function (event) {

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
            console.log(data);
            if (data.length === 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'No se encontraron datos!',
                });
            } else {
                mostrarDatos(data);
                mostrarSeccion();
            }
        })
        .catch(error => console.error('Error:', error));
    });


    //Capturar los valores para la busqueda
    function capturarDatos() {
        let tipoDeDocumento = document.getElementById('tipoDocumentoBusqueda').value;
        let numeroDeDocumento = document.getElementById('numeroDocumentoBusqueda').value;
        let apellidos = document.getElementById('apellidosBusqueda').value;
        let numeroReserva = document.getElementById('codigoReservaBusqueda').value;

        //Radio buttons
        let busquedaDocumento = document.getElementById('busquedaDocumento').checked;
        let busquedaCodigo = document.getElementById('busquedaCodigo').checked;
        
        //Revisar si la busqueda es por documento o por codigo y validar de acuerdo a eso
        if (busquedaDocumento) {
            if (tipoDeDocumento === "" || numeroDeDocumento === "" || apellidos === "") {
                Swal.fire({
                    icon: "error",
                    title: "Alerta!",
                    text: "Debes ingresar algo para que podamos buscar!",
                    confirmButtonColor: "#48a04b"
                });
                return;
            }
            if ((tipoDeDocumento=="DNI" && (numeroDeDocumento.length < 8 || numeroDeDocumento.length  > 9)) || (tipoDeDocumento=="CE" && (numeroDeDocumento.length < 9 || numeroDeDocumento.length  > 9)) || (tipoDeDocumento=="PASAPORTE" && (numeroDeDocumento.length < 8 || numeroDeDocumento.length  > 8))){
                Swal.fire({
                    icon: "error",
                    title: "Alerta!",
                    text: "La longitud del numero de documento ingresado es incorrecto! (DNI: 8 digitos, CE: 9 digitos, PASAPORTE: 8 digitos)",
                    confirmButtonColor: "#48a04b"
                });
                return;
            }
            if(validator.isNumeric(numeroDeDocumento) == false){
                Swal.fire({
                    icon: "error",
                    title: "Alerta!",
                    text: "El numero de documento no debe contener letras!",
                    confirmButtonColor: "#48a04b"
                });
                return;
            }
            if(validator.isAlpha(apellidos,'es-ES',{ignore:' '}) == false ){
                Swal.fire({
                    icon: "error",
                    title: "Alerta!",
                    text: "Los apellidos no pueden contener numeros!",
                    confirmButtonColor: "#48a04b"
                });
                return;
            }

        } else {
            if (numeroReserva == "") {
                Swal.fire({
                    icon: "error",
                    title: "Alerta!",
                    text: "Debes ingresar algo paraque podamos buscar!",
                    confirmButtonColor: "#48a04b"
                });
                return;
            }
    
            
            
            if(numeroReserva.length < 6 || numeroReserva.length > 6){
                Swal.fire({
                    icon: "error",
                    title: "Alerta!",
                    text: "Tu código de reserva debe ser de solo 6 digítos!",
                    confirmButtonColor: "#48a04b"
                });
                return;
            }
        }

        
        //Aqui estoy enviando nulos los parametros si es que los campos estan vacios
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
        document.getElementById('fechaNacResultado').innerHTML = formatearFecha(fechaNacimiento);
        document.getElementById('telefonoResultado').innerHTML = telefono;
        document.getElementById('reservaCodResultado').innerHTML = codigoDeLaReserva;
        document.getElementById('reservaFechaResultado').innerHTML = formatearFecha(fechaDeLaReserva);
        document.getElementById('tipoHabResultado').innerHTML = tiposHabitacion[tipoDeLaHabitacion];
        document.getElementById('fechaInResultado').innerHTML = formatearFecha(fechaDeLaEntrada);
        document.getElementById('fechaOutResultado').innerHTML = formatearFecha(fechaDeLaSalida);
        document.getElementById('reservaCostoResultado').innerHTML = costoTotal + ' S/.';
        document.getElementById('estadoResultado').innerHTML = estadosReserva[estadoDeLaReserva];

    }

    //Metodo para mostrar la seccion y desplazar la pagina
    function mostrarSeccion() {
        seccionResultados.style.display = 'block';
        seccionResultados.scrollIntoView({ behavior: "smooth" });
    }



});
// Autor: Robert Diaz
// Fecha: 25 de Febrero de 2024

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

document.addEventListener("DOMContentLoaded", function () {
    let formulario = document.getElementById("formReclamo");
    

    formulario.addEventListener("submit", function (event) {
        event.preventDefault(); // Evitar el envío del formulario por defecto

        // Obtener los valores de los campos del formulario
        let nombres = document.getElementById("nombres").value;
        let apellidos = document.getElementById("apellidos").value;
        let tipoDoc = document.getElementById("tipoDoc").value;
        let fechaNac = document.getElementById("fechaNacimiento").value;
        let documento = document.getElementById("documento").value.trim();
        let direccion = document.getElementById("direccion").value;
        let telefono = document.getElementById("telefono").value.trim();
        let correo = document.getElementById("correo").value.trim();
        let mensaje = document.getElementById("mensaje").value;
        let reclamo = document.getElementById("reclamo").value;

        //Realizar la validación de los campos
        if (nombres === "" || apellidos === "" || tipoDoc === "" || fechaNac == "" || documento === "" || direccion === "" || telefono === "" || correo === "" || mensaje === "" || reclamo === "0") {
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
        if(validator.isAlpha(apellidos,'es-ES',{ignore:' '}) == false ){
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

        else 
        {
            //Realizar el envio de los datos al servidor
            fetch("/registrarReclamo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombres: nombres,
                    apellidos: apellidos,
                    tipo_documento: tipoDoc,
                    documento: documento,
                    direccion: direccion,
                    fechanac: fechaNac,
                    telefono: telefono,
                    correo: correo,
                    mensaje: mensaje,
                    tipo_reclamo: reclamo
                }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        Swal.fire({
                            title: "Tu reclamo se ha generado correctamente!",
                            text: "su numero de reclamo es " + data.numeroReclamo + "!",
                            icon: "success",
                            confirmButtonColor: "#48a04b"
                        }).then((result) => {
                            if (result.value) {
                                formulario.reset(); // Resetear el formulario una vez que se ha insertado el reclamo correctamente
                            }
                        });
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Error!",
                            text: data.message,
                            confirmButtonColor: "#48a04b"
                        });
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    });
});




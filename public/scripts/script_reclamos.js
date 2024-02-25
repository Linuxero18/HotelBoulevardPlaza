// Autor: Robert Diaz
// Fecha: 25 de Febrero de 2024

document.addEventListener("DOMContentLoaded", function () {
    var formulario = document.getElementById("formReclamo");
    

    formulario.addEventListener("submit", function (event) {
        event.preventDefault(); // Evitar el envío del formulario por defecto

        // Obtener los valores de los campos del formulario
        var nombres = document.getElementById("nombres").value;
        var apellidos = document.getElementById("apellidos").value;
        var tipoDoc = document.getElementById("tipoDoc").value;
        var documento = document.getElementById("documento").value.trim();
        var direccion = document.getElementById("direccion").value;
        var telefono = document.getElementById("telefono").value.trim();
        var correo = document.getElementById("correo").value.trim();
        var mensaje = document.getElementById("mensaje").value;
        var reclamo = document.getElementById("reclamo").value;

        //Realizar la validación de los campos
        if (nombres === "" || apellidos === "" || tipoDoc === "" || documento === "" || direccion === "" || telefono === "" || correo === "" || mensaje === "" || reclamo === "0") {
            Swal.fire({
                icon: "error",
                title: "Alerta!",
                text: "Todos los campos son obligatorios!",
                confirmButtonColor: "#48a04b"
            });
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




//Este es el metodo que captura los datos del formulario y los envia al servidor
function fetchData() {
    let params = {};
    if (document.getElementById("opcion1").checked) {
        params.tipo_documento = document.getElementById("tipo_documento").value;
        params.numero_documento = document.getElementById("numero_documento").value;
        params.apellidos = document.getElementById("apellidos").value;
    } else if (document.getElementById("opcion2").checked) {
        params.numero_reclamo = document.getElementById("numero_reclamo").value;
    }

    console.log(params);

    fetch('/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params),
    })
        .then(response => {
            if (!response.ok) {
                displayError();
            }
            return response.json();
        })
        .then(data => {
            displayResults(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


//Este es el metodo que muestra los datos que se obtuvieron del servidor
//Estoy utilizando sweetalert2 para mostrar los mensajes
function displayResults(data) {
    let fecha = ((data[0].fecha_reclamo).split("T")[0]);
    fecha = fecha.split("-").reverse().join("/");

    let estado = data[0].estado;
    let codigo = data[0].codigo_reclamo;

    console.log(estado);
    if (estado == 1) {
        estado = "En revisión";
    } else {
        estado = "Finalizado";
    }

    Swal.fire({
        title: "Resultado!",
        text: "El numero de reclamo #00000" + codigo + " ingresado el " + fecha + " se encuentra " + estado + "!",
        icon: "success",
        confirmButtonColor: "#48a04b"
    })
}

function displayError() {
    Swal.fire({
        icon: "error",
        title: "Error!",
        text: "No se encontraron datos",
        confirmButtonColor: "#48a04b"
    });
}


//Este metodo maneja si los campos del formulario estan habilitados o no
function manejarCampos() {
    let opcion1Checked = document.getElementById("opcion1").checked;
    document.getElementById("numero_reclamo").disabled = opcion1Checked;
    document.getElementById("numero_reclamo").value = "";

    let opcion2Checked = document.getElementById("opcion2").checked;
    document.getElementById("tipo_documento").disabled = opcion2Checked;
    document.getElementById("numero_documento").disabled = opcion2Checked;
    document.getElementById("apellidos").disabled = opcion2Checked;
    document.getElementById("tipo_documento").value = "DNI";
    document.getElementById("numero_documento").value = "";
    document.getElementById("apellidos").value = "";
    
}
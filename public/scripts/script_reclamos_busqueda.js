//const con = require("../../bd");

// function fetchData() {
//     const idNumber = document.getElementById('numero_reclamo').value;
//     if (idNumber) {
//         // Llamada a la API del servidor Node.js
//         fetch(`/search?id=${idNumber}`)
//             .then(response => {
//                 if (!response.ok) {
//                     displayError();
//             }
//             return response.json();
//         })
//             .then(data => {
//                 displayResults(data);
//             })
//             .catch(error => console.error('Error:', error));
//     }
// }

// function fetchData() {
//     const idNumber = document.getElementById('numero_reclamo').value;
//     if (idNumber) {
//         // Llamada a la API del servidor Node.js
//         fetch(`/search?id=${idNumber}`)
//             .then(response => {
//                 if (!response.ok) {
//                     displayError();
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 displayResults(data);
//             })
//             .catch(error => {
                
//                 console.error('Error:', error);
//             });
//     }
// }


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

// function displayResults(data) {
//     // const resultsDiv = document.getElementById('results-table');
//     const miModal = new bootstrap.Modal(document.getElementById('miModal'));
//     miModal.show();
//     const resultado = document.getElementById('texto');
//     // // Limpiar resultados anteriores
//     // resultsDiv.innerHTML = '';
//     // Crear y agregar la tabla con los resultados
//     // const table = document.createElement('table');
//     // table.classList.add('table');
//     // Agrega aquí tu código para crear las filas de la tabla basado en los datos
//     console.log("hola");
//     data.forEach(row => {
//         const tr = document.createElement('tr');
//         Object.values(row).forEach(text => {
//             // const td = document.createElement('td');
//             // td.textContent = text;
//             // tr.appendChild(td);
//         });
//         // table.appendChild(tr);
//     });
//     let fecha = ((data[0].fecha_reclamo).split("T")[0]);
//     fecha = fecha.split("-").reverse().join("/");
//     resultado.innerHTML= fecha;
// }

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
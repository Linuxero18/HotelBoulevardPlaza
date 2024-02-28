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

function fetchData() {
    const idNumber = document.getElementById('numero_reclamo').value;
    if (idNumber) {
        // Llamada a la API del servidor Node.js
        fetch(`/search?id=${idNumber}`)
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
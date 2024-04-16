//const ejs = require('ejs');
//const path = require('path');


// app.set('view engine', 'ejs');
// app.use(express.static(path.join(__dirname, 'public')));

// app.get('/home_admin', (req, res) => {
//     const query = 'SELECT idPersona, nombres, apellidos, tipo_doc, numero_doc, fecha_nacimiento, direccion, telefono, correo FROM persona';

//     db.query(query, (err, results) => {
//         if (err) {
//             console.error('Error al obtener los usuarios:', err);
//             res.status(500).send('Error al obtener los usuarios');
//             return;
//         }

//         res.render('page_admin', { users: results });
//     });
// });



const cloud = document.getElementById("bed");
const barraLateral = document.querySelector(".barra-lateral");
const spans = document.querySelectorAll("span");
const palanca = document.querySelector(".switch");
const circulo = document.querySelector(".circulo");
const menu = document.querySelector(".menu");
const main = document.querySelector("main");

menu.addEventListener("click", () => {
    barraLateral.classList.toggle("max-barra-lateral");
    if (barraLateral.classList.contains("max-barra-lateral")) {
        menu.children[0].style.display = "none";
        menu.children[1].style.display = "block";
    }
    else {
        menu.children[0].style.display = "block";
        menu.children[1].style.display = "none";
    }
    if (window.innerWidth <= 320) {
        barraLateral.classList.add("mini-barra-lateral");
        main.classList.add("min-main");
        spans.forEach((span) => {
            span.classList.add("oculto");
        })
    }
});

palanca.addEventListener("click", () => {
    let body = document.body;
    body.classList.toggle("dark-mode");
    circulo.classList.toggle("prendido");

    // Guardar el estado del modo oscuro en LocalStorage
    if (body.classList.contains("dark-mode")) {
        localStorage.setItem('modo-oscuro', 'true');
    } else {
        localStorage.setItem('modo-oscuro', 'false');
    }
});

// Al cargar la página, comprobar el estado del modo oscuro en LocalStorage
document.addEventListener("DOMContentLoaded", (event) => {
    let modoOscuro = localStorage.getItem('modo-oscuro');
    let body = document.body;
    if (modoOscuro === 'true') {
        body.classList.add("dark-mode");
        circulo.classList.add("prendido");
    } else {
        body.classList.remove("dark-mode");
        circulo.classList.remove("prendido");
    }
});

cloud.addEventListener("click", () => {
    barraLateral.classList.toggle("mini-barra-lateral");
    main.classList.toggle("min-main");
    spans.forEach((span) => {
        span.classList.toggle("oculto");
    });
});

//Cargar los elementos traidos de la base de datos en una tabla
let url = "/reclamos";
let estados = { 1: "Pendiente", 2: "En proceso", 3: "Resuelto" };

fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        let tablaCuerpo = document.getElementById('tabla-reclamos-cuerpo');

        // Limpiar el cuerpo de la tabla
        tablaCuerpo.innerHTML = '';

        // Crear una nueva fila para cada reclamo
        data.forEach((reclamo, index) => {
            let fila = document.createElement('tr');

            let celdaNum = document.createElement('td');
            celdaNum.textContent = reclamo.codigo_reclamo;
            fila.appendChild(celdaNum);

            //Preparar fecha y hora para mostrar
            let fechaReclamo = new Date(reclamo.fecha_reclamo);

            let dia = fechaReclamo.getDate();
            let mes = fechaReclamo.getMonth() + 1; // Los meses en JavaScript comienzan desde 0
            let año = fechaReclamo.getFullYear();

            // Asegurarse de que los valores de un solo dígito tengan un cero delante
            dia = dia < 10 ? '0' + dia : dia;
            mes = mes < 10 ? '0' + mes : mes;

            let fechaFormateada = `${dia}/${mes}/${año}`;

            let celdaFecha = document.createElement('td');
            celdaFecha.textContent = fechaFormateada;
            fila.appendChild(celdaFecha);

            let celdaDescripcion = document.createElement('td');
            celdaDescripcion.textContent = reclamo.descripcion_reclamo;
            fila.appendChild(celdaDescripcion);

            let celdaEstado = document.createElement('td');
            celdaEstado.textContent = estados[reclamo.estado];
            fila.appendChild(celdaEstado);

            tablaCuerpo.appendChild(fila);
        });
    })
    .catch(error => console.error('Error:', error));

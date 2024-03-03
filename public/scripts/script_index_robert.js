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

// Función para crear selectores de edad de niños
function crearSelectoresEdad(cantidad) {
    const container = document.getElementById('edades-niños-container');
    container.innerHTML = ''; // Limpiar el contenido anterior

    for (let i = 0; i < cantidad; i++) {
        let div = document.createElement('div');
        div.className = 'col-md-2';
        const label = document.createElement('label');
        label.textContent = `Edad del niño ${i + 1}: `;

        const selectorEdad = document.createElement('select');
        selectorEdad.id = `edad-niño-${i + 1}`;
        selectorEdad.className = 'form-select';
        selectorEdad.name = `edad-niño-${i + 1}`;
        // Agregar opciones para las edades (por ejemplo, de 1 a 12 años)
        for (let edad = 0; edad <= 12; edad++) {
            const option = document.createElement('option');
            option.value = edad;
            if (edad === 1) {
                option.textContent = edad + ' año';
            }
            else {
                option.textContent = edad + ' años';
            }
            selectorEdad.appendChild(option);
        }

        container.appendChild(div);
        div.appendChild(label);
        div.appendChild(selectorEdad);
        div.appendChild(document.createElement('br')); // Salto de línea entre cada selector
    }
}

// Event listener para el cambio en la cantidad de niños
document.getElementById('numNinos').addEventListener('change', function () {
    const cantidad = parseInt(this.value);
    crearSelectoresEdad(cantidad);
});

// Llamar a la función inicialmente para configurar los selectores de edad
crearSelectoresEdad(0); // Configuración inicial, sin niños


let formularioBusqueda = document.getElementById('buscarForm');
formularioBusqueda.addEventListener('submit', function (event) {
    event.preventDefault();

    // Obtener los valores de búsqueda del formulario
    //let tipoSeleccionado = document.getElementById('tipoHabitacion').value;
    let fechaEntrada = document.getElementById('fechaEntrada').value;
    let fechaSalida = document.getElementById('fechaSalida').value;
    //let numPersonas = document.getElementById('numPersonas').value;
    let numAdultos = document.getElementById('numAdultos').value;
    let numNinos = document.getElementById('numNinos').value;
    let numPersonas = numAdultos;
    const div = document.getElementById('edades-niños-container');
    const edades = div.querySelectorAll('select');
    for (let i = 0; i < edades.length; i++) {
        console.log(edades[i].value);
        if (edades[i].value === '0') {
            alert('Por favor, seleccione la edad de todos los niños');
            return;
        }
        else if (edades[i].value >= '6') {
            numPersonas = parseInt(numPersonas) + 1;
        }
    }

    fetch('http://localhost:3000/habitaciones?fechaEntrada=' + fechaEntrada + '&fechaSalida=' + fechaSalida + '&numAdultos=' + numAdultos + '&numNinos=' + numNinos + '&numPersonas=' + numPersonas)
        .then(response => response.json())
        .then(data => {
            const seenTypes = {};

            // Filtrar los datos para que solo quede una habitación de cada tipo
            const filteredData = data.filter(habitacion => {
                if (seenTypes[habitacion.tipo_habitacion]) {
                    // Si ya hemos visto este tipo de habitación, no lo incluyas en los datos filtrados
                    return false;
                } else {
                    // Si no hemos visto este tipo de habitación, márcalo como visto y inclúyelo en los datos filtrados
                    seenTypes[habitacion.tipo_habitacion] = true;
                    return true;
                }
            });
            // Almacena los datos en el localStorage
            localStorage.setItem('habitaciones', JSON.stringify(data));

            console.log(filteredData);

            // Redirige a la otra página
            window.location.href = 'habitaciones.html';
        })
        .catch(error => console.error('Error:', error));
});




// fetch('http://localhost:3000/habitaciones?tipoHabitacion=' + tipoSeleccionado + '&fechaEntrada=' + fechaEntrada + '&fechaSalida=' + fechaSalida + '&numPersonas=' + numPersonas)
//         .then(response => response.json())
//         .then(data => {
//             // Aquí puedes procesar el array de habitaciones y actualizar tu página
//             // Obtén el contenedor de las tarjetas
//             var contenedor = document.getElementById('contenedor-de-tarjetas');

//             // Elimina las tarjetas preexistentes
//             contenedor.innerHTML = '';

//             // data es un array con los datos de las habitaciones
//             data.forEach(habitacion => {
//                 // Crea un nuevo elemento div para la habitación
//                 var div = document.createElement('div');
//                 div.className = 'col-md-4';
//                 div.dataset.tipo = habitacion.tipo;
//                 div.dataset.fechaEntrada = habitacion.fechaEntrada;
//                 div.dataset.fechaSalida = habitacion.fechaSalida;
//                 div.dataset.numPersonas = habitacion.numPersonas;

//                 // Mapea los números a los nombres de las habitaciones
//                 var tiposHabitacion = {
//                     1: 'Habitación Simple',
//                     2: 'Habitación Doble',
//                     3: 'Habitación Superior'
//                 };

//                 // Llena el div con el HTML de la tarjeta
//                 div.innerHTML = `
//                 <div class="card text-dark text-center bg-light p-2">
//                     <img src="img/home-2.jpg" alt="" class="card-img-top">
//                     <div class="card-body">
//                         <h5 class="card-title">${tiposHabitacion[habitacion.tipo_habitacion]}</h5>
//                         <p class="card-text">${habitacion.descripcion}</p>
//                         <hr>
//                         <p class="card-text">Desde $${habitacion.precio} por noche</p>
//                         <a href="#" class="btn btn-reservar mt-auto">Reservar</a>
//                     </div>
//                 </div>
//             `;

//                 // Añade el div al contenedor
//                 contenedor.appendChild(div);
//             });
//         })
//         .catch(error => console.error('Error:', error));
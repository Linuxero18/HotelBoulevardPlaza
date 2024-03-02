window.onload = function () {
    // Recupera los datos del localStorage
    let data = JSON.parse(localStorage.getItem('habitaciones'));
    console.log(data);
    var contenedor = document.getElementById('contenedor-de-tarjetas');

    // Elimina las tarjetas preexistentes
    contenedor.innerHTML = '';

    // data es un array con los datos de las habitaciones
    data.forEach(habitacion => {
        // Crea un nuevo elemento div para la habitación
        var div = document.createElement('div');
        div.className = 'col-md-4';
        div.dataset.tipo = habitacion.tipo;
        div.dataset.fechaEntrada = habitacion.fechaEntrada;
        div.dataset.fechaSalida = habitacion.fechaSalida;
        div.dataset.numPersonas = habitacion.numPersonas;

        // Mapea los números a los nombres de las habitaciones
        var tiposHabitacion = {
            1: 'Habitación Simple',
            2: 'Habitación Doble',
            3: 'Habitación Superior'
        };

        // Llena el div con el HTML de la tarjeta
        div.innerHTML = `
                <div class="card text-dark text-center bg-light p-2">
                    <img src="img/home-2.jpg" alt="" class="card-img-top">
                    <div class="card-body">
                        <h5 class="card-title">${tiposHabitacion[habitacion.tipo_habitacion]}</h5>
                        <p class="card-text">${habitacion.descripcion}</p>
                        <hr>
                        <p class="card-text">Desde ${habitacion.precio_dia} S/. por noche</p>
                        <a href="#" class="btn btn-reservar mt-auto">Reservar</a>
                    </div>
                </div>
            `;

        // Añade el div al contenedor
        contenedor.appendChild(div);
    });
};


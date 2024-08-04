document.addEventListener('DOMContentLoaded', () => {
    function mostrarHabitaciones() {
        fetch("http://localhost:3000/habitacionesdisponibles")
            .then((response) => response.json())
            .then((data) => {
                const tbody = document.querySelector("#tabla-habitaciones tbody");
                tbody.innerHTML = '';
                let tr = '';
                data.forEach(h => {
                    tr += `<tr>
                        <td>${h.idHabitacion}</td>
                        <td>${h.piso}</td>
                        <td>${h.descripcion}</td>
                        <td>${h.precio_dia}</td>
                        <td>${h.aforo}</td>
                        <td>${h.estado}</td>
                        <td><input type="radio" name="idSeleccionado" value="${h.idHabitacion}"></td>
                    <tr>`;
                });
                tbody.innerHTML = tr;
            });
    }
    mostrarHabitaciones();

    document.querySelector('#btnEliminar').addEventListener('click', () => {
        const selectedRadio = document.querySelector('input[name="idSeleccionado"]:checked');
        if (selectedRadio) {
            const id = selectedRadio.value;
            if (confirm('¿Está seguro de que desea eliminar esta habitación?')) {
                fetch(`http://localhost:3000/eliminarhabitacion/${id}`, {
                    method: 'DELETE'
                }).then(response => response.json())
                .then(data => {
                    alert(data.message);
                    mostrarHabitaciones(); // Actualizar la tabla después de eliminar
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Hubo un error al eliminar la habitación');
                });
            }
        } else {
            alert('Por favor, seleccione una habitación para eliminar');
        }
    });

    // Agregar habitación
    document.querySelector('#formAgregarHabitacion').addEventListener('submit', (e) => {
        e.preventDefault();
        const numero = document.querySelector('#numero').value;
        const piso = document.querySelector('#piso').value;
        const descripcion = document.querySelector('#descripcion').value;
        const precio_dia = document.querySelector('#precio_dia').value;
        const tipo_habitacion = document.querySelector('#tipo_habitacion').value;
        const aforo = document.querySelector('#aforo').value;
        const estado = document.querySelector('#estado').value;

        fetch('http://localhost:3000/agregarhabitacion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                numero, piso, descripcion, precio_dia, tipo_habitacion, aforo, estado
            })
        }).then(response => response.json())
        .then(data => {
            alert(data.message);
            document.querySelector('#agregarHabitacionModal').modal('hide'); // Cierra el modal
            mostrarHabitaciones();
        });
    });
});
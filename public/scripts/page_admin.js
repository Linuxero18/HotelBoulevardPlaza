function mostrarData() {
    fetch("http://localhost:3000/clientes")
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            let tr = '';
            data.forEach((i) => {
                tr += `<tr>
                        <td>${i.nombres}</td>
                        <td>${i.apellidos}</td>
                        <td>${i.numero_doc}</td>
                        <td>${i.correo}</td>
                        <td>${i.telefono}</td>
                        <td>${i.fecha_nacimiento}</td>
                    </tr>`;
            });
            document.getElementById('tabla-persona').innerHTML = tr;
        })
        .catch((error) => {
            console.error('Error al obtener los datos:', error);
        });
}

mostrarData();
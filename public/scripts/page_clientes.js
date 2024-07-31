document.addEventListener('DOMContentLoaded', () => {
    let data = [];
    let filteredData = [];
    const rowsPerPage = 12;
    let currentPage = 1;

    function convertirFechaALima(fechaUTC) {
        const opciones = { 
            timeZone: 'America/Lima', 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit'
        };
        const formatter = new Intl.DateTimeFormat('es-PE', opciones);
        const partes = formatter.formatToParts(new Date(fechaUTC));

        const fechaLima = partes.reduce((acc, part) => {
            if (part.type !== 'literal') {
                acc[part.type] = part.value;
            }
            return acc;
        }, {});

        return `${fechaLima.day}/${fechaLima.month}/${fechaLima.year}`;
    }

    function mostrarData() {
        fetch("http://localhost:3000/clientes")
            .then((response) => response.json())
            .then((dataFetched) => {
                data = dataFetched;
                filteredData = data;
                renderTable();
                setupPagination();
            })
            .catch((error) => {
                console.error('Error al obtener los datos:', error);
            });
    }

    function renderTable() {
        const tbody = document.querySelector('#tabla-persona tbody');
        const mensaje = document.getElementById('mensaje');

        if (!tbody) {
            console.error('Elemento tbody no encontrado');
            return;
        }

        if (filteredData.length < 1) {
            tbody.innerHTML = '';
            mensaje.innerText = 'No se encontraron resultados para la búsqueda de: ' + document.getElementById('searchInput').value;
            document.getElementById('paginacion').innerHTML = '';
            return;
        }

        mensaje.innerText = '';

        tbody.innerHTML = '';

        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const paginatedData = filteredData.slice(start, end);

        let tr = '';
        let a = start + 1;
        paginatedData.forEach((i) => {
            const fechaConvertida = convertirFechaALima(i.fecha_nacimiento);
            tr += `<tr align="center">
                    <td>${a}</td>
                    <td>${i.idPersona}</td>
                    <td>${i.nombres}, ${i.apellidos}</td>
                    <td>${i.tipo_doc}</td>
                    <td>${i.numero_doc}</td>
                    <td>${i.correo}</td>
                    <td>${i.telefono}</td>
                    <td>${fechaConvertida}</td>
                    <td><input type="radio" name="filaSeleccionada" value="${i.idPersona}"></td>
                </tr>`;
            a++;
        });
        tbody.innerHTML = tr;

        document.querySelectorAll('input[name="filaSeleccionada"]').forEach(radio => {
            radio.addEventListener('change', function() {
                const id = this.value;
                idSeleccionado = document.getElementById('idSeleccionado');
                cargarDatosCliente(id);
                if (id && id !== 'No ID') {
                    idSeleccionado.textContent = `El id seleccionado es el: ${id}`;
                } else {
                    idSeleccionado.textContent = 'No se pudo obtener el ID del cliente seleccionado';
                }
            });
        });
    }

    function setupPagination() {
        const paginationDiv = document.getElementById('paginacion');
        if (!paginationDiv) {
            console.error('Elemento paginacion no encontrado');
            return;
        }
        paginationDiv.innerHTML = '';

        const totalPages = Math.ceil(filteredData.length / rowsPerPage);

        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.className = (i === currentPage) ? 'active' : '';
            button.addEventListener('click', () => {
                currentPage = i;
                renderTable();
                setupPagination();
            });
            paginationDiv.appendChild(button);
        }
    }

    function filtrarTabla() {
        const input = document.getElementById('searchInput');
        const filter = input.value.toLowerCase();

        filteredData = data.filter((item) => {
            return Object.values(item).some((value) => 
                value.toString().toLowerCase().includes(filter)
            );
        });

        currentPage = 1;
        renderTable();
        setupPagination();
    }

    mostrarData();
    document.getElementById('searchInput').addEventListener('keyup', filtrarTabla);

    async function agregarCliente(event) {
        event.preventDefault();
    
        const cliente = {
            nombres: document.getElementById('nombres').value,
            apellidos: document.getElementById('apellidos').value,
            tipo_doc: document.getElementById('tipo_doc').value,
            numero_doc: document.getElementById('numero_doc').value,
            direccion: document.getElementById('direccion').value,
            fecha_nacimiento: document.getElementById('fecha_nacimiento').value,
            telefono: document.getElementById('telefono').value,
            correo: document.getElementById('correo').value
        };
    
        try {
            const response = await fetch('http://localhost:3000/clientes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cliente)
            });
    
            const data = await response.json();
            
            if (response.ok) {
                console.log('Cliente agregado:', data);
                const modal = document.getElementById('agregarClienteModal');
                const modalInstance = bootstrap.Modal.getInstance(modal);
                modalInstance.hide();
                document.getElementById('agregarClienteForm').reset();
                mostrarData();
            } else {
                console.error('Error al agregar cliente:', data.error);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
    }
    document.getElementById('agregarClienteForm').addEventListener('submit', agregarCliente);

    async function cargarDatosCliente(id) {
        try {
            const response = await fetch(`http://localhost:3000/clientes/${id}`);
            const cliente = await response.json();
    
            if (response.ok) {
                document.getElementById('editNombres').value = cliente.nombres;
                document.getElementById('editApellidos').value = cliente.apellidos;
                document.getElementById('editTipoDoc').value = cliente.tipo_doc;
                document.getElementById('editNumeroDoc').value = cliente.numero_doc;
                document.getElementById('editFechaNacimiento').value = cliente.fecha_nacimiento.split('T')[0];
                document.getElementById('editDireccion').value = cliente.direccion;
                document.getElementById('editTelefono').value = cliente.telefono;
                document.getElementById('editCorreo').value = cliente.correo;
            } else {
                console.error('Error al cargar datos del cliente:', cliente.error);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
    }

    async function actualizarCliente(event) {
        event.preventDefault();
    
        const cliente = {
            nombres: document.getElementById('editNombres').value,
            apellidos: document.getElementById('editApellidos').value,
            tipo_doc: document.getElementById('editTipoDoc').value,
            numero_doc: document.getElementById('editNumeroDoc').value,
            direccion: document.getElementById('editDireccion').value,
            fecha_nacimiento: document.getElementById('editFechaNacimiento').value,
            telefono: document.getElementById('editTelefono').value,
            correo: document.getElementById('editCorreo').value
        };
    
        const id = document.querySelector('input[name="filaSeleccionada"]:checked').value;
    
        try {
            const response = await fetch(`http://localhost:3000/clientes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cliente)
            });
    
            const data = await response.json();
    
            if (response.ok) {
                console.log('Cliente actualizado:', data);
                const modal = document.getElementById('editarClienteModal');
                const modalInstance = bootstrap.Modal.getInstance(modal);
                modalInstance.hide();
                mostrarData();
            } else {
                console.error('Error al actualizar cliente:', data.error);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
    }
    document.getElementById('editarClienteForm').addEventListener('submit', actualizarCliente);    
    
    async function eliminarCliente() {
        const selectedRadio = document.querySelector('input[name="filaSeleccionada"]:checked');
        if (!selectedRadio) {
            alert('Por favor, selecciona un cliente para eliminar.');
            return;
        }
        const clienteId = selectedRadio.value;
    
        try {
            const response = await fetch(`http://localhost:3000/clientes/${clienteId}`, {
                method: 'DELETE'
            });
    
            const data = await response.json();
            
            if (response.ok) {
                console.log('Cliente eliminado:', data);
                mostrarData();
            } else {
                console.error('Error al eliminar cliente:', data.error);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
    }
    
    document.getElementById('btnEliminar').addEventListener('click', eliminarCliente);
    
});


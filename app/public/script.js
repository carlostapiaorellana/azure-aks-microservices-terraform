document.addEventListener('DOMContentLoaded', () => {
    const ticketForm = document.getElementById('ticketForm');
    const tableBody = document.getElementById('ticketTableBody');

    // Función para obtener tickets
    const fetchTickets = async () => {
        try {
            // Gracias al tag <base>, esto apunta a /tickets/api/tickets
            const res = await fetch('api/tickets');
            if (!res.ok) throw new Error('Error en la respuesta del servidor');
            
            const tickets = await res.json();
            tableBody.innerHTML = '';
            
            tickets.forEach(t => {
                tableBody.innerHTML += `
                    <tr>
                        <td>#${t.id}</td>
                        <td>${t.usuario}</td>
                        <td>${t.asunto}</td>
                        <td><span class="prio-${t.prioridad}">${t.prioridad}</span></td>
                        <td>${t.estado}</td>
                    </tr>
                `;
            });
        } catch (err) {
            console.error("Fallo al cargar tickets:", err);
            tableBody.innerHTML = '<tr><td colspan="5">Error conectando con la base de datos...</td></tr>';
        }
    };

    // Crear nuevo ticket
    ticketForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nuevoTicket = {
            usuario: document.getElementById('usuario').value,
            asunto: document.getElementById('asunto').value,
            prioridad: document.getElementById('prioridad').value
        };

        try {
            const res = await fetch('api/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoTicket)
            });

            if (res.ok) {
                ticketForm.reset();
                fetchTickets(); // Recargar la tabla
            }
        } catch (err) {
            console.error("Error al crear el ticket:", err);
        }
    });

    // Carga inicial
    fetchTickets();
});
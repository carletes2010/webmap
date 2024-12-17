// Inicializa el mapa centrado en la CDMX
const map = L.map('map').setView([19.4326, -99.1332], 6);

// Agrega la capa de mapa base desde OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Función para asignar íconos personalizados según la magnitud
function getIcon(magnitude) {
    if (magnitude < 4) {
        return 'https://webmap-teal.vercel.app/leve.png'; // Ícono sismos leves
    } else if (magnitude < 6) {
        return 'https://webmap-teal.vercel.app/moderado.png'; // Ícono sismos moderados
    } else {
        return 'https://webmap-teal.vercel.app/fuerte.png'; // Ícono sismos fuertes
    }
}

// Realizar un GET a la API de sismos
fetch('https://api-sismos-ssn-production.up.railway.app/sismos')
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al obtener los datos');
        }
        return response.json();
    })
    .then(data => {
        console.log("Datos obtenidos:", data); // Para verificar en la consola

        // Filtrar los datos para excluir los títulos con "SASMEX"
        const sismos = data.filter(sismo => !sismo.title.includes("SASMEX"));

        // Iterar y agregar los sismos como marcadores en el mapa
        sismos.forEach(sismo => {
            const coords = [sismo.latitude, sismo.longitude];
            const magnitude = parseFloat(sismo.title.split(",")[0]) || 0;

            // Crear un ícono personalizado según la magnitud
            const icon = L.icon({
                iconUrl: getIcon(magnitude),
                iconSize: [40, 40],  // Tamaño del ícono
                iconAnchor: [20, 40], // Punto de anclaje
                popupAnchor: [0, -40] // Popup encima del ícono
            });

            // Crear y agregar un marcador al mapa
            L.marker(coords, { icon: icon })
                .addTo(map)
                .bindPopup(`
                    <div class="info-box">
                        <b>${sismo.title}</b><br>
                        Magnitud: ${magnitude}
                    </div>
                `);
        });
    })
    .catch(error => {
        console.error('Error al cargar los datos:', error);
    });

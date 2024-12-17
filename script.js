// Inicializa el mapa centrado en la CDMX
const map = L.map('map').setView([19.4326, -99.1332], 6);

// Añadir capa de mapa base de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Función para asignar íconos personalizados según la magnitud
function getIcon(magnitude) {
    if (magnitude < 4) {
        return 'https://webmap-teal.vercel.app/leve.png'; // Ícono para sismos leves
    } else if (magnitude < 6) {
        return 'https://webmap-teal.vercel.app/moderado.png'; // Ícono para sismos moderados
    } else {
        return 'https://webmap-teal.vercel.app/fuerte.png'; // Ícono para sismos fuertes
    }
}

// Realizar un GET a la API
fetch('https://api-sismos-ssn-production.up.railway.app/sismos')
    .then(response => {
        if (!response.ok) throw new Error('Error al obtener los datos');
        return response.json();
    })
    .then(data => {
        console.log("Datos obtenidos:", data); // Depuración en consola

        // Filtrar datos que no contengan "SASMEX"
        const sismos = data.filter(sismo => !sismo.title.includes("SASMEX"));

        // Iterar y agregar cada sismo al mapa
        sismos.forEach(sismo => {
            const coords = [sismo.latitude, sismo.longitude];
            const magnitude = parseFloat(sismo.title.split(",")[0]) || 0;

            // Crear ícono personalizado
            const icon = L.icon({
                iconUrl: getIcon(magnitude),
                iconSize: [30, 30], // Tamaño del ícono
                iconAnchor: [15, 15], // Punto de anclaje del ícono
                popupAnchor: [0, -15], // Popup sobre el marcador
            });

            // Crear marcador
            L.marker(coords, { icon: icon })
                .addTo(map)
                .bindPopup(`<b>${sismo.title}</b><br>Magnitud: ${magnitude}`);
        });
    })
    .catch(error => console.error('Error al cargar los datos:', error));

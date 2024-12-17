// Crear el mapa y establecer la vista inicial (centro en CDMX)
const map = L.map('map').setView([19.4326, -99.1332], 6);

// Añadir capa de mapa base de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Función para obtener ícono según la magnitud
function getIcon(magnitude) {
    if (magnitude < 4) {
        return 'leve.png'; // URL de ícono para sismos leves
    } else if (magnitude < 6) {
        return 'moderado.png'; // Ícono moderado
    } else {
        return 'fuerte.png'; // Ícono fuerte
    }
}

// Cargar datos de sismos desde la API
fetch('https://api-sismos-ssn-production.up.railway.app/sismos')
    .then(response => response.json())
    .then(data => {
        data.filter(sismo => !sismo.title.includes("SASMEX")) // Filtrar sismos con SASMEX
            .forEach(sismo => {
                const coords = [sismo.latitude, sismo.longitude];
                const magnitude = parseFloat(sismo.title.split(",")[0]) || 0;

                // Personalizar marcador con íconos
                const icon = L.icon({
                    iconUrl: getIcon(magnitude), // Obtener ícono
                    iconSize: [40, 40], // Tamaño del ícono
                    iconAnchor: [20, 40], // Punto de anclaje
                    popupAnchor: [0, -40]
                });

                // Añadir marcador al mapa con un popup
                L.marker(coords, { icon: icon })
                    .addTo(map)
                    .bindPopup(`<div class="info-box"><b>${sismo.title}</b><br>Magnitud: ${magnitude}</div>`);
            });
    })
    .catch(error => console.error('Error al cargar sismos:', error));

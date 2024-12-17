// Inicializa el mapa centrado en la CDMX
const map = L.map('map').setView([19.4326, -99.1332], 6);

// Agregar la capa de mapa base desde OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Función para asignar íconos personalizados
function getIcon(sismo) {
    // Detectar si el título contiene "SASMEX:"
    if (sismo.title.startsWith("SASMEX:")) {
        // Ícono especial para eventos SASMEX
        return L.icon({
            iconUrl: 'https://webmap-teal.vercel.app/sasmexevent.png',
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40]
        });
    } else {
        // Extraer la magnitud del título
        const magnitude = parseFloat(sismo.title.split(",")[0]) || 0;

        // Asignar íconos según la magnitud
        if (magnitude < 4) {
            return L.icon({
                iconUrl: 'https://webmap-teal.vercel.app/leve.png',
                iconSize: [40, 40],
                iconAnchor: [20, 40],
                popupAnchor: [0, -40]
            });
        } else if (magnitude < 6) {
            return L.icon({
                iconUrl: 'https://webmap-teal.vercel.app/moderado.png',
                iconSize: [40, 40],
                iconAnchor: [20, 40],
                popupAnchor: [0, -40]
            });
        } else {
            return L.icon({
                iconUrl: 'https://webmap-teal.vercel.app/fuerte.png',
                iconSize: [40, 40],
                iconAnchor: [20, 40],
                popupAnchor: [0, -40]
            });
        }
    }
}

// Realizar GET a la API de sismos
fetch('https://api-sismos-ssn-production.up.railway.app/sismos')
    .then(response => response.json())
    .then(data => {
        console.log("Datos obtenidos:", data); // Verifica los datos en la consola

        // Iterar y agregar cada sismo al mapa
        data.forEach(sismo => {
            const coords = [sismo.latitude, sismo.longitude];
            const icon = getIcon(sismo); // Obtener el ícono personalizado

            // Crear marcador con popup
            L.marker(coords, { icon: icon })
                .addTo(map)
                .bindPopup(`
                    <div class="info-box">
                        <b>${sismo.title}</b><br>
                        Fuente: ${sismo.title.startsWith("SASMEX:") ? "SASMEX" : "SSN"}
                    </div>
                `);
        });
    })
    .catch(error => console.error('Error al cargar los datos:', error));

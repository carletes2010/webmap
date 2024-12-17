// Inicializa el mapa centrado en la CDMX
const map = L.map('map').setView([19.4326, -99.1332], 6);

// Agregar la capa de mapa base desde OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Función para asignar íconos personalizados
function getIcon(sismo) {
    const title = sismo.title.trim(); // Limpia espacios

    if (title.startsWith("SASMEX:")) {
        return L.icon({
            iconUrl: 'https://webmap-teal.vercel.app/sasmexevent.png',
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40]
        });
    } else {
        const magnitude = parseFloat(title.split(",")[0]) || 0;

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

// Función para validar y corregir coordenadas
function validarCoordenadas(lat, lon) {
    // Si la latitud está fuera del rango válido, intercambiar valores
    if (lat < -90 || lat > 90) {
        console.warn("Corrigiendo coordenadas:", lat, lon);
        return [lon, lat]; // Intercambiar
    }
    return [lat, lon];
}

// Realizar GET a la API de sismos
fetch('https://api-sismos-ssn-production.up.railway.app/sismos')
    .then(response => response.json())
    .then(data => {
        console.log("Datos obtenidos:", data);

        // Iterar y agregar cada sismo al mapa
        data.forEach(sismo => {
            const title = sismo.title.trim();
            let coords = validarCoordenadas(parseFloat(sismo.latitude), parseFloat(sismo.longitude));

            // Validar que las coordenadas sean válidas
            if (isNaN(coords[0]) || isNaN(coords[1])) {
                console.warn("Coordenadas inválidas:", sismo);
                return;
            }

            const icon = getIcon(sismo); // Obtener ícono

            // Crear marcador con popup
            L.marker(coords, { icon: icon })
                .addTo(map)
                .bindPopup(`
                    <div class="info-box">
                        <b>${title}</b><br>
                        Fuente: ${title.startsWith("SASMEX:") ? "SASMEX" : "SSN"}
                    </div>
                `);
        });
    })
    .catch(error => console.error('Error al cargar los datos:', error));

const map = L.map('map').setView([19.4326, -99.1332], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

function getIcon(sismo) {
    const title = sismo.title.trim();
    if (title.startsWith("SASMEX:")) {
        return L.icon({
            iconUrl: 'https://webmap-teal.vercel.app/sasmexevent.png',
            iconSize: [50, 50],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40]
        });
    } else {
        const magnitude = parseFloat(title.split(",")[0]) || 0;
        if (magnitude < 4) {
            return L.icon({
                iconUrl: 'https://webmap-teal.vercel.app/leve.png',
                iconSize: [50, 50],
                iconAnchor: [20, 40],
                popupAnchor: [0, -40]
            });
        } else if (magnitude < 6) {
            return L.icon({
                iconUrl: 'https://webmap-teal.vercel.app/moderado.png',
                iconSize: [50, 50],
                iconAnchor: [20, 40],
                popupAnchor: [0, -40]
            });
        } else {
            return L.icon({
                iconUrl: 'https://webmap-teal.vercel.app/fuerte.png',
                iconSize: [50, 50],
                iconAnchor: [20, 40],
                popupAnchor: [0, -40]
            });
        }
    }
}

function validarCoordenadas(lat, lon) {
    if (lat < -90 || lat > 90) {
        return [lon, lat];
    }
    return [lat, lon];
}

const fetchUrl = process.env.NEXT_PUBLIC_FETCH_URL;

fetch(fetchUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        data.forEach(sismo => {
            const title = sismo.title.trim();
            const coords = validarCoordenadas(parseFloat(sismo.latitude), parseFloat(sismo.longitude));
            if (isNaN(coords[0]) || isNaN(coords[1])) {
                return;
            }
            const icon = getIcon(sismo);
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

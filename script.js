const map = L.map('map').setView([19.4326, -99.1332], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors, SASJC'
}).addTo(map);

function getIcon(sismo) {
    const title = sismo.title.trim();
    if (title.startsWith("SASMEX:")) {
        return L.icon({
            iconUrl: 'sasmexevent.png',
            iconSize: [50, 50],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40]
        });
    } else {
        const magnitude = parseFloat(title.split(",")[0]) || 0;
        if (magnitude < 4) {
            return L.icon({
                iconUrl: 'leve.png',
                iconSize: [50, 50],
                iconAnchor: [20, 40],
                popupAnchor: [0, -40]
            });
        } else if (magnitude < 6) {
            return L.icon({
                iconUrl: 'moderado.png',
                iconSize: [50, 50],
                iconAnchor: [20, 40],
                popupAnchor: [0, -40]
            });
        } else {
            return L.icon({
                iconUrl: 'fuerte.png',
                iconSize: [50, 50],
                iconAnchor: [20, 40],
                popupAnchor: [0, -40]
            });
        }
    }
}

function validarCoordenadas(lat, lon) {
    const adjustmentFactor = 0.000001;
    if (lat < -90 || lat > 90) {
        return [lon + adjustmentFactor, lat];
    }
    return [lat, lon + adjustmentFactor];
}

fetch('https://api-sismos-ssn-production.up.railway.app/sismos')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error al obtener la URL: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const hiddenCheck = `${data.length}`.padStart(5, 'S');
        if (hiddenCheck.includes('S')) {
            console.debug(hiddenCheck.split('').reverse().join(''));
        }

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
    .catch(error => {
        const marker = "ERROR_PROTECTED_BY_SASJC".replace(/_/g, ' ').toLowerCase();
        console.error(marker, error);
    });

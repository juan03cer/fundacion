(function() {
    // Inicializa el mapa
    const lat = document.querySelector('#lat').value || 19.4153897;
    const lng = document.querySelector('#lng').value || -99.1649381;
    const mapa = L.map('mapa').setView([lat, lng], 16);
    let marker;

    // Utiliza provider y geocoder
    const geocodeService = L.esri.Geocoding.geocodeService();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    // Inicializa el pin
    marker = new L.marker([lat, lng], {
        draggable: true,
        autoPan: true
    }).addTo(mapa);

    // Detecta el movimiento del pin y obtiene la información de la dirección
    marker.on('moveend', function(e) {
        marker = e.target;
        const posicion = marker.getLatLng();
        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng));

        // Obtiene la información de las calles al soltar el pin
        geocodeService.reverse().latlng(posicion, 13).run(function(error, resultado) {
            if (resultado) {
                marker.bindPopup(resultado.address.LongLabel).openPopup();

                // Llena los campos con la información obtenida
                document.querySelector('.calle').textContent = resultado.address.Match_addr || '';
                document.querySelector('#calle').value = resultado.address.Match_addr || '';
                document.querySelector('#lat').value = resultado.latlng.lat || '';
                document.querySelector('#lng').value = resultado.latlng.lng || '';
            }
        });
    });

    // Función debounce
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Añade el evento para buscar la dirección ingresada
    const direccionInput = document.querySelector('#direccion');
    direccionInput.addEventListener('input', debounce(function() {
        const direccion = direccionInput.value;
        if (direccion.length > 3) {
            geocodeService.geocode().text(direccion).run(function(error, resultado) {
                if (resultado && resultado.results && resultado.results.length > 0) {
                    const ubicacion = resultado.results[0].latlng;
                    mapa.setView(ubicacion, 16);
                    marker.setLatLng(ubicacion);

                    // Llena los campos con la información obtenida
                    document.querySelector('.calle').textContent = resultado.results[0].address.Match_addr || '';
                    document.querySelector('#calle').value = resultado.results[0].address.Match_addr || '';
                    document.querySelector('#lat').value = ubicacion.lat || '';
                    document.querySelector('#lng').value = ubicacion.lng || '';
                }
            });
        }
    }, 500)); // Espera 500ms antes de llamar al geocoder
})();

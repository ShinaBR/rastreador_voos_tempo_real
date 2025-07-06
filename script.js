class FlightTracker {
    constructor() {
        this.currentLocation = null;
        this.searchedLocation = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.getUserLocation();
    }

    bindEvents() {
        const useCurrentLocationBtn = document.getElementById('use-current-location');
        const searchLocationBtn = document.getElementById('search-location');
        const locationSearchInput = document.getElementById('location-search');

        useCurrentLocationBtn.addEventListener('click', () => {
            if (this.currentLocation) {
                this.fetchFlights(this.currentLocation.lat, this.currentLocation.lon, 'sua localização atual');
            } else {
                this.getUserLocation();
            }
        });

        searchLocationBtn.addEventListener('click', () => {
            const location = locationSearchInput.value.trim();
            if (location) {
                this.searchLocationAndFetchFlights(location);
            }
        });

        locationSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const location = locationSearchInput.value.trim();
                if (location) {
                    this.searchLocationAndFetchFlights(location);
                }
            }
        });
    }

    getUserLocation() {
        const currentLocationElement = document.getElementById('current-location');
        
        if (navigator.geolocation) {
            currentLocationElement.textContent = 'Obtendo sua localização...';
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.currentLocation = {
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    };
                    
                    currentLocationElement.textContent = 
                        `Lat: ${this.currentLocation.lat.toFixed(4)}, Lon: ${this.currentLocation.lon.toFixed(4)}`;
                    
                    this.updateStatus('Localização obtida! Clique em "Usar Minha Localização" para ver voos próximos.');
                },
                (error) => {
                    let errorMessage = 'Erro ao obter localização: ';
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage += 'Permissão negada pelo usuário.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage += 'Localização indisponível.';
                            break;
                        case error.TIMEOUT:
                            errorMessage += 'Tempo limite excedido.';
                            break;
                        default:
                            errorMessage += 'Erro desconhecido.';
                            break;
                    }
                    currentLocationElement.textContent = errorMessage;
                    this.updateStatus('Não foi possível obter sua localização. Use a busca por local.');
                }
            );
        } else {
            currentLocationElement.textContent = 'Geolocalização não é suportada por este navegador.';
            this.updateStatus('Geolocalização não suportada. Use a busca por local.');
        }
    }

    async searchLocationAndFetchFlights(locationName) {
        this.showLoading();
        this.updateStatus(`Buscando localização: ${locationName}...`);

        try {
            // Usar API de geocodificação gratuita
            const geocodeResponse = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}&limit=1`
            );
            
            if (!geocodeResponse.ok) {
                throw new Error('Erro ao buscar localização');
            }

            const geocodeData = await geocodeResponse.json();
            
            if (geocodeData.length === 0) {
                throw new Error('Localização não encontrada');
            }

            const location = geocodeData[0];
            const lat = parseFloat(location.lat);
            const lon = parseFloat(location.lon);

            this.searchedLocation = { lat, lon, name: location.display_name };
            
            this.updateStatus(`Localização encontrada: ${location.display_name}`);
            await this.fetchFlights(lat, lon, locationName);

        } catch (error) {
            console.error('Erro ao buscar localização:', error);
            this.updateStatus(`Erro ao buscar localização "${locationName}". Tente novamente.`);
            this.hideLoading();
        }
    }

    async fetchFlights(lat, lon, locationName) {
        this.showLoading();
        this.updateStatus(`Buscando voos próximos a ${locationName}...`);

        try {
            // Definir área de busca (aproximadamente 100km de raio)
            const radius = 1; // graus (aproximadamente 111km)
            const lamin = lat - radius;
            const lamax = lat + radius;
            const lomin = lon - radius;
            const lomax = lon + radius;

            const apiUrl = `https://opensky-network.org/api/states/all?lamin=${lamin}&lomin=${lomin}&lamax=${lamax}&lomax=${lomax}`;
            
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error(`Erro na API: ${response.status}`);
            }

            const data = await response.json();
            
            this.hideLoading();
            
            if (data.states && data.states.length > 0) {
                this.displayFlights(data.states, locationName);
                this.updateStatus(`${data.states.length} voo(s) encontrado(s) próximo(s) a ${locationName}`);
            } else {
                this.displayNoFlights(locationName);
                this.updateStatus(`Nenhum voo encontrado próximo a ${locationName} no momento`);
            }

        } catch (error) {
            console.error('Erro ao buscar voos:', error);
            this.hideLoading();
            this.updateStatus(`Erro ao buscar voos próximos a ${locationName}. Tente novamente em alguns segundos.`);
            this.displayError(error.message);
        }
    }

    displayFlights(flights, locationName) {
        const flightsListElement = document.getElementById('flights-list');
        flightsListElement.innerHTML = '';

        flights.forEach(flight => {
            const flightCard = this.createFlightCard(flight);
            flightsListElement.appendChild(flightCard);
        });
    }

    createFlightCard(flight) {
        // Índices dos dados conforme documentação OpenSky
        const [
            icao24, callsign, origin_country, time_position, last_contact,
            longitude, latitude, baro_altitude, on_ground, velocity,
            true_track, vertical_rate, sensors, geo_altitude, squawk,
            spi, position_source, category
        ] = flight;

        const card = document.createElement('div');
        card.className = 'flight-card';

        const callsignDisplay = callsign ? callsign.trim() : icao24;
        const isOnGround = on_ground;
        const statusClass = isOnGround ? 'status-ground' : 'status-flying';
        const statusText = isOnGround ? 'No Solo' : 'Em Voo';

        const altitude = baro_altitude ? Math.round(baro_altitude) : 'N/A';
        const speed = velocity ? Math.round(velocity * 3.6) : 'N/A'; // Converter m/s para km/h
        const heading = true_track ? Math.round(true_track) : 'N/A';
        const verticalRate = vertical_rate ? Math.round(vertical_rate) : 'N/A';

        // Determinar categoria da aeronave
        const aircraftCategory = this.getAircraftCategory(category);

        card.innerHTML = `
            <div class="flight-header">
                <div class="flight-callsign">${callsignDisplay}</div>
                <div class="flight-status ${statusClass}">${statusText}</div>
            </div>
            
            <div class="flight-route">
                <span>📍 ${origin_country || 'País desconhecido'}</span>
                <span class="route-arrow">✈️</span>
                <span>🌍 Voando sobre a região</span>
            </div>
            
            <div class="flight-details">
                <div class="detail-item">
                    <span class="detail-label">Altitude</span>
                    <span class="detail-value">${altitude}m</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Velocidade</span>
                    <span class="detail-value">${speed} km/h</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Direção</span>
                    <span class="detail-value">${heading}°</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Taxa Vertical</span>
                    <span class="detail-value">${verticalRate} m/s</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Coordenadas</span>
                    <span class="detail-value">${latitude?.toFixed(4) || 'N/A'}, ${longitude?.toFixed(4) || 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Tipo de Aeronave</span>
                    <span class="detail-value">${aircraftCategory}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Código ICAO</span>
                    <span class="detail-value">${icao24}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Última Atualização</span>
                    <span class="detail-value">${this.formatTimestamp(last_contact)}</span>
                </div>
            </div>
        `;

        return card;
    }

    getAircraftCategory(category) {
        const categories = {
            0: 'Sem informação',
            1: 'Sem categoria ADS-B',
            2: 'Leve (< 7 ton)',
            3: 'Pequeno (7-34 ton)',
            4: 'Grande (34-136 ton)',
            5: 'Grande com vórtice alto',
            6: 'Pesado (> 136 ton)',
            7: 'Alto desempenho',
            8: 'Helicóptero',
            9: 'Planador',
            10: 'Mais leve que o ar',
            11: 'Paraquedista',
            12: 'Ultraleve',
            13: 'Reservado',
            14: 'Drone/UAV',
            15: 'Espacial',
            16: 'Veículo de emergência',
            17: 'Veículo de serviço',
            18: 'Obstáculo pontual',
            19: 'Obstáculo agrupado',
            20: 'Obstáculo linear'
        };
        
        return categories[category] || 'Desconhecido';
    }

    formatTimestamp(timestamp) {
        if (!timestamp) return 'N/A';
        
        const date = new Date(timestamp * 1000);
        const now = new Date();
        const diffSeconds = Math.floor((now - date) / 1000);
        
        if (diffSeconds < 60) {
            return `${diffSeconds}s atrás`;
        } else if (diffSeconds < 3600) {
            return `${Math.floor(diffSeconds / 60)}min atrás`;
        } else {
            return date.toLocaleTimeString('pt-BR');
        }
    }

    displayNoFlights(locationName) {
        const flightsListElement = document.getElementById('flights-list');
        flightsListElement.innerHTML = `
            <div class="no-flights">
                <div class="no-flights-icon">🛩️</div>
                <h3>Nenhum voo encontrado</h3>
                <p>Não há voos visíveis próximos a <strong>${locationName}</strong> no momento.</p>
                <p>Tente buscar uma área metropolitana maior ou aguarde alguns minutos.</p>
            </div>
        `;
    }

    displayError(errorMessage) {
        const flightsListElement = document.getElementById('flights-list');
        flightsListElement.innerHTML = `
            <div class="no-flights">
                <div class="no-flights-icon">⚠️</div>
                <h3>Erro ao carregar dados</h3>
                <p>${errorMessage}</p>
                <p>Verifique sua conexão com a internet e tente novamente.</p>
            </div>
        `;
    }

    showLoading() {
        const loadingElement = document.getElementById('loading');
        loadingElement.classList.remove('hidden');
    }

    hideLoading() {
        const loadingElement = document.getElementById('loading');
        loadingElement.classList.add('hidden');
    }

    updateStatus(message) {
        const statusElement = document.getElementById('search-status');
        statusElement.textContent = message;
    }
}

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new FlightTracker();
});



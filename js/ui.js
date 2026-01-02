// UI management module
import { favoritesStorage, preferencesStorage } from './storage.js';

class UIManager {
    constructor() {
        this.elements = null;
    }

    // Initialize elements after DOM is ready
    init() {
        if (this.elements) return; // Already initialized
        
        this.elements = {
            citySearch: document.getElementById('citySearch'),
            searchBtn: document.getElementById('searchBtn'),
            locationBtn: document.getElementById('locationBtn'),
            unitC: document.getElementById('unitC'),
            unitF: document.getElementById('unitF'),
            loadingState: document.getElementById('loadingState'),
            errorState: document.getElementById('errorState'),
            errorMessage: document.querySelector('.error-message'),
            weatherContent: document.getElementById('weatherContent'),
            currentLocation: document.getElementById('currentLocation'),
            lastUpdated: document.getElementById('lastUpdated'),
            temperature: document.getElementById('temperature'),
            feelsLike: document.getElementById('feelsLike'),
            weatherIcon: document.getElementById('weatherIcon'),
            weatherCondition: document.getElementById('weatherCondition'),
            humidity: document.getElementById('humidity'),
            windSpeed: document.getElementById('windSpeed'),
            pressure: document.getElementById('pressure'),
            forecastContainer: document.getElementById('forecastContainer'),
            favoritesContainer: document.getElementById('favoritesContainer'),
            addToFavorites: document.getElementById('addToFavorites')
        };

        // Verify all elements exist
        if (!this.elements.citySearch || !this.elements.searchBtn) {
            console.error('Critical DOM elements not found. Make sure HTML is loaded.');
        }
    }

    // Show loading state
    showLoading() {
        if (!this.elements || !this.elements.loadingState) return;
        this.elements.loadingState.classList.remove('hidden');
        if (this.elements.errorState) this.elements.errorState.classList.add('hidden');
        if (this.elements.weatherContent) this.elements.weatherContent.classList.add('hidden');
    }

    // Hide loading state
    hideLoading() {
        if (!this.elements || !this.elements.loadingState) return;
        this.elements.loadingState.classList.add('hidden');
    }

    // Show error state
    showError(message) {
        this.elements.errorState.classList.remove('hidden');
        this.elements.errorMessage.textContent = message;
        this.elements.weatherContent.classList.add('hidden');
        this.elements.loadingState.classList.add('hidden');
    }

    // Hide error state
    hideError() {
        this.elements.errorState.classList.add('hidden');
    }

    // Display current weather
    displayCurrentWeather(weatherData) {
        this.elements.currentLocation.textContent = weatherData.city;
        this.elements.lastUpdated.textContent = weatherData.timestamp.toLocaleString();
        this.elements.temperature.textContent = weatherData.temperature;
        this.elements.feelsLike.textContent = weatherData.feelsLike;
        this.elements.weatherCondition.textContent = weatherData.description;
        this.elements.humidity.textContent = weatherData.humidity;
        this.elements.windSpeed.textContent = `${weatherData.windSpeed} from ${weatherData.windDirection}`;
        this.elements.pressure.textContent = weatherData.pressure;

        // Set weather icon
        this.setWeatherIcon(weatherData.icon, weatherData.condition);
    }

    // Set weather icon
    setWeatherIcon(iconCode, condition) {
        const iconClass = this.getIconClass(iconCode, condition);
        this.elements.weatherIcon.className = `weather-icon ${iconClass}`;
        this.elements.weatherIcon.textContent = this.getIconEmoji(condition);
    }

    // Get icon class based on weather condition
    getIconClass(iconCode, condition) {
        const conditionLower = condition.toLowerCase();
        if (conditionLower.includes('clear')) return 'icon-clear';
        if (conditionLower.includes('cloud')) return 'icon-cloud';
        if (conditionLower.includes('rain')) return 'icon-rain';
        if (conditionLower.includes('snow')) return 'icon-snow';
        if (conditionLower.includes('thunder')) return 'icon-thunder';
        if (conditionLower.includes('mist') || conditionLower.includes('fog')) return 'icon-mist';
        return 'icon-default';
    }

    // Get emoji for weather condition
    getIconEmoji(condition) {
        const conditionLower = condition.toLowerCase();
        if (conditionLower.includes('clear')) return '☀️';
        if (conditionLower.includes('cloud')) return '☁️';
        if (conditionLower.includes('rain')) return '🌧️';
        if (conditionLower.includes('snow')) return '❄️';
        if (conditionLower.includes('thunder')) return '⛈️';
        if (conditionLower.includes('mist') || conditionLower.includes('fog')) return '🌫️';
        return '🌤️';
    }

    // Display forecast
    displayForecast(forecastData) {
        this.elements.forecastContainer.innerHTML = '';

        forecastData.forEach(day => {
            const forecastCard = document.createElement('div');
            forecastCard.className = 'forecast-card';
            
            const dateStr = day.date.toLocaleDateString('en-US', { 
                weekday: 'short', 
                day: 'numeric', 
                month: 'short' 
            });

            forecastCard.innerHTML = `
                <div class="forecast-date">${dateStr}</div>
                <div class="forecast-icon">${this.getIconEmoji(day.condition)}</div>
                <div class="forecast-temps">
                    <span class="forecast-max">${day.maxTemp}</span>
                    <span class="forecast-min">${day.minTemp}</span>
                </div>
                <div class="forecast-condition">${day.condition}</div>
            `;

            this.elements.forecastContainer.appendChild(forecastCard);
        });
    }

    // Show weather content
    showWeatherContent() {
        this.elements.weatherContent.classList.remove('hidden');
        this.hideError();
    }

    // Update unit buttons
    updateUnitButtons(unit) {
        if (unit === 'metric') {
            this.elements.unitC.classList.add('active');
            this.elements.unitF.classList.remove('active');
        } else {
            this.elements.unitF.classList.add('active');
            this.elements.unitC.classList.remove('active');
        }
    }

    // Display favorites
    displayFavorites() {
        const favorites = favoritesStorage.get();
        this.elements.favoritesContainer.innerHTML = '';

        if (favorites.length === 0) {
            this.elements.favoritesContainer.innerHTML = '<p class="no-favorites">No favorite cities yet. Add some to quick access!</p>';
            return;
        }

        favorites.forEach(city => {
            const favoriteItem = document.createElement('div');
            favoriteItem.className = 'favorite-item';
            favoriteItem.innerHTML = `
                <span class="favorite-city">${city}</span>
                <button class="remove-favorite" data-city="${city}">×</button>
            `;
            this.elements.favoritesContainer.appendChild(favoriteItem);
        });
    }

    // Update favorite button state
    updateFavoriteButton(city) {
        if (!city) {
            this.elements.addToFavorites.classList.add('hidden');
            return;
        }

        const isFavorite = favoritesStorage.isFavorite(city);
        this.elements.addToFavorites.classList.remove('hidden');
        
        if (isFavorite) {
            this.elements.addToFavorites.innerHTML = '<span class="icon">⭐</span> Remove from Favorites';
            this.elements.addToFavorites.classList.add('active');
        } else {
            this.elements.addToFavorites.innerHTML = '<span class="icon">⭐</span> Add to Favorites';
            this.elements.addToFavorites.classList.remove('active');
        }
    }

    // Setup autocomplete
    setupAutocomplete(onSelect) {
        let autocompleteTimeout;
        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'autocomplete-suggestions';
        this.elements.citySearch.parentElement.appendChild(suggestionsContainer);

        this.elements.citySearch.addEventListener('input', async (e) => {
            const query = e.target.value.trim();
            
            clearTimeout(autocompleteTimeout);
            
            if (query.length < 2) {
                suggestionsContainer.innerHTML = '';
                suggestionsContainer.classList.remove('show');
                return;
            }

            autocompleteTimeout = setTimeout(async () => {
                // This will be handled by the app.js
                // We'll emit a custom event
                const event = new CustomEvent('autocomplete', { detail: { query } });
                document.dispatchEvent(event);
            }, 300);
        });

        // Handle autocomplete suggestions (will be populated by app.js)
        document.addEventListener('autocomplete-suggestions', (e) => {
            const suggestions = e.detail;
            this.showAutocomplete(suggestions, suggestionsContainer, onSelect);
        });
    }

    // Show autocomplete suggestions
    showAutocomplete(suggestions, container, onSelect) {
        container.innerHTML = '';
        
        if (suggestions.length === 0) {
            container.classList.remove('show');
            return;
        }

        suggestions.forEach(suggestion => {
            const item = document.createElement('div');
            item.className = 'autocomplete-item';
            item.textContent = suggestion.name;
            item.addEventListener('click', () => {
                onSelect(suggestion.name);
                container.classList.remove('show');
            });
            container.appendChild(item);
        });

        container.classList.add('show');
    }

    // Hide autocomplete
    hideAutocomplete() {
        const container = document.querySelector('.autocomplete-suggestions');
        if (container) {
            container.classList.remove('show');
        }
    }
}

export const uiManager = new UIManager();



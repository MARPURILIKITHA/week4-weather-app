// Main application logic
import { weatherService } from './weatherService.js';
import { uiManager } from './ui.js';
import { favoritesStorage, preferencesStorage } from './storage.js';

class WeatherApp {
    constructor() {
        this.currentCity = '';
        this.currentUnit = preferencesStorage.getUnit();
        this.init();
    }

    init() {
        // Initialize UI manager first to ensure elements are available
        uiManager.init();
        this.setupEventListeners();
        this.loadLastCity();
        this.displayFavorites();
        this.updateUnitButtons();
    }

    // Setup all event listeners
    setupEventListeners() {
        if (!uiManager.elements) {
            console.error('UI elements not initialized. Cannot setup event listeners.');
            return;
        }

        // Search button
        if (uiManager.elements.searchBtn) {
            uiManager.elements.searchBtn.addEventListener('click', () => {
                this.handleSearch();
            });
        }

        // Enter key in search input
        if (uiManager.elements.citySearch) {
            uiManager.elements.citySearch.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch();
                }
            });
        }

        // Location button
        if (uiManager.elements.locationBtn) {
            uiManager.elements.locationBtn.addEventListener('click', () => {
                this.handleLocationSearch();
            });
        }

        // Unit toggle buttons
        if (uiManager.elements.unitC) {
            uiManager.elements.unitC.addEventListener('click', () => {
                this.changeUnit('metric');
            });
        }

        if (uiManager.elements.unitF) {
            uiManager.elements.unitF.addEventListener('click', () => {
                this.changeUnit('imperial');
            });
        }

        // Add to favorites button
        if (uiManager.elements.addToFavorites) {
            uiManager.elements.addToFavorites.addEventListener('click', () => {
                this.toggleFavorite();
            });
        }

        // Remove favorite (delegated event listener)
        uiManager.elements.favoritesContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-favorite')) {
                const city = e.target.dataset.city;
                this.removeFavorite(city);
            } else if (e.target.closest('.favorite-item')) {
                const city = e.target.closest('.favorite-item').querySelector('.favorite-city').textContent;
                this.searchCity(city);
            }
        });

        // Autocomplete setup
        uiManager.setupAutocomplete((cityName) => {
            this.searchCity(cityName);
        });

        // Handle autocomplete search
        document.addEventListener('autocomplete', async (e) => {
            const query = e.detail.query;
            const suggestions = await weatherService.searchCities(query);
            document.dispatchEvent(new CustomEvent('autocomplete-suggestions', { detail: suggestions }));
        });

        // Hide autocomplete when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                uiManager.hideAutocomplete();
            }
        });
    }

    // Handle search
    handleSearch() {
        const city = uiManager.elements.citySearch.value.trim();
        if (city) {
            this.searchCity(city);
        }
    }

    // Search city
    async searchCity(city) {
        if (!city) return;

        this.currentCity = city;
        uiManager.elements.citySearch.value = city;
        uiManager.hideAutocomplete();

        try {
            uiManager.showLoading();
            
            const [currentData, forecastData] = await Promise.all([
                weatherService.getCurrentWeather(city, this.currentUnit),
                weatherService.getForecast(city, this.currentUnit)
            ]);

            const formattedCurrent = weatherService.formatCurrentWeather(currentData, this.currentUnit);
            const formattedForecast = weatherService.formatForecast(forecastData, this.currentUnit);

            uiManager.displayCurrentWeather(formattedCurrent);
            uiManager.displayForecast(formattedForecast);
            uiManager.showWeatherContent();
            uiManager.updateFavoriteButton(formattedCurrent.city);

            preferencesStorage.setLastCity(city);
            uiManager.hideLoading();
        } catch (error) {
            uiManager.hideLoading();
            uiManager.showError(error.message);
            console.error('Error fetching weather:', error);
        }
    }

    // Handle location search
    // Handle location search
handleLocationSearch() {
    if (!navigator.geolocation) {
        uiManager.showError('Geolocation is not supported by your browser.');
        return;
    }

    uiManager.showLoading();
    uiManager.elements.locationBtn.disabled = true;

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            try {
                // Extract and validate coordinates
                const lat = Number(position.coords.latitude);
                const lon = Number(position.coords.longitude);
                
                // Validate coordinates
                if (isNaN(lat) || isNaN(lon)) {
                    throw new Error('Invalid location coordinates received.');
                }
                
                if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
                    throw new Error('Location coordinates are out of valid range.');
                }
                
                console.log('Fetching weather for coordinates:', lat, lon);
                const weatherData = await weatherService.getWeatherByCoords(lat, lon, this.currentUnit);

                const formattedCurrent = weatherService.formatCurrentWeather(weatherData.current, this.currentUnit);
                const formattedForecast = weatherService.formatForecast(weatherData.forecast, this.currentUnit);

                this.currentCity = formattedCurrent.city;
                uiManager.elements.citySearch.value = formattedCurrent.city.split(',')[0];

                uiManager.displayCurrentWeather(formattedCurrent);
                uiManager.displayForecast(formattedForecast);
                uiManager.showWeatherContent();
                uiManager.updateFavoriteButton(formattedCurrent.city);

                preferencesStorage.setLastCity(formattedCurrent.city);
                uiManager.hideLoading();
            } catch (error) {
                uiManager.hideLoading();
                uiManager.showError(error.message);
                console.error('Location weather error:', error);
            } finally {
                uiManager.elements.locationBtn.disabled = false;
            }
        },
        (error) => {
            uiManager.hideLoading();
            uiManager.elements.locationBtn.disabled = false;
            
            let errorMessage = 'Unable to retrieve your location.';
            if (error.code === error.PERMISSION_DENIED) {
                errorMessage = 'Location access denied. Please enable location permissions.';
            } else if (error.code === error.POSITION_UNAVAILABLE) {
                errorMessage = 'Location information unavailable.';
            } else if (error.code === error.TIMEOUT) {
                errorMessage = 'Location request timed out.';
            }
            
            uiManager.showError(errorMessage);
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}
    // handleLocationSearch() {
    //     if (!navigator.geolocation) {
    //         uiManager.showError('Geolocation is not supported by your browser.');
    //         return;
    //     }

    //     uiManager.showLoading();
    //     uiManager.elements.locationBtn.disabled = true;

    //     navigator.geolocation.getCurrentPosition(
    //         async (position) => {
    //             try {
    //                 const { lat, lon } = position.coords;
    //                 const weatherData = await weatherService.getWeatherByCoords(lat, lon, this.currentUnit);

    //                 const formattedCurrent = weatherService.formatCurrentWeather(weatherData.current, this.currentUnit);
    //                 const formattedForecast = weatherService.formatForecast(weatherData.forecast, this.currentUnit);

    //                 this.currentCity = formattedCurrent.city;
    //                 uiManager.elements.citySearch.value = formattedCurrent.city.split(',')[0];

    //                 uiManager.displayCurrentWeather(formattedCurrent);
    //                 uiManager.displayForecast(formattedForecast);
    //                 uiManager.showWeatherContent();
    //                 uiManager.updateFavoriteButton(formattedCurrent.city);

    //                 preferencesStorage.setLastCity(formattedCurrent.city);
    //                 uiManager.hideLoading();
    //             } catch (error) {
    //                 uiManager.hideLoading();
    //                 uiManager.showError(error.message);
    //             } finally {
    //                 uiManager.elements.locationBtn.disabled = false;
    //             }
    //         },
    //         (error) => {
    //             uiManager.hideLoading();
    //             uiManager.elements.locationBtn.disabled = false;
                
    //             let errorMessage = 'Unable to retrieve your location.';
    //             if (error.code === error.PERMISSION_DENIED) {
    //                 errorMessage = 'Location access denied. Please enable location permissions.';
    //             } else if (error.code === error.POSITION_UNAVAILABLE) {
    //                 errorMessage = 'Location information unavailable.';
    //             } else if (error.code === error.TIMEOUT) {
    //                 errorMessage = 'Location request timed out.';
    //             }
                
    //             uiManager.showError(errorMessage);
    //         }
    //     );
    // }

    // Change temperature unit
    async changeUnit(unit) {
        if (this.currentUnit === unit) return;

        this.currentUnit = unit;
        preferencesStorage.setUnit(unit);
        uiManager.updateUnitButtons(unit);

        if (this.currentCity) {
            await this.searchCity(this.currentCity);
        }
    }

    // Toggle favorite
    toggleFavorite() {
        if (!this.currentCity) return;

        const cityName = this.currentCity.split(',')[0];
        const isFavorite = favoritesStorage.isFavorite(cityName);

        if (isFavorite) {
            favoritesStorage.remove(cityName);
        } else {
            favoritesStorage.add(cityName);
        }

        this.displayFavorites();
        uiManager.updateFavoriteButton(this.currentCity);
    }

    // Remove favorite
    removeFavorite(city) {
        favoritesStorage.remove(city);
        this.displayFavorites();
        
        if (this.currentCity && this.currentCity.split(',')[0] === city) {
            uiManager.updateFavoriteButton(this.currentCity);
        }
    }

    // Display favorites
    displayFavorites() {
        uiManager.displayFavorites();
    }

    // Update unit buttons
    updateUnitButtons() {
        uiManager.updateUnitButtons(this.currentUnit);
    }

    // Load last searched city
    async loadLastCity() {
        const lastCity = preferencesStorage.getLastCity();
        if (lastCity) {
            await this.searchCity(lastCity);
        }
    }
}

// Check if running via file:// protocol (may have CORS issues)
if (window.location.protocol === 'file:') {
    console.warn('⚠️ Running via file:// protocol. ES modules may not work properly.');
    console.warn('💡 Tip: Use a local server for best results:');
    console.warn('   - Python: python -m http.server 8000');
    console.warn('   - Node.js: npx http-server -p 8000');
    console.warn('   - Or use VS Code Live Server extension');
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('Initializing Weather App...');
        new WeatherApp();
        console.log('Weather App initialized successfully!');
    } catch (error) {
        console.error('Error initializing Weather App:', error);
        const errorMsg = 'Error loading application. Please check the browser console for details.';
        const corsMsg = '\n\nIf you see CORS errors, try using a local server:\n- Run: python -m http.server 8000\n- Then open: http://localhost:8000';
        alert(errorMsg + corsMsg);
    }
});



// Weather API service module
import { API_CONFIG } from './config.js';
import { cacheStorage } from './storage.js';

class WeatherService {
    constructor() {
        this.apiKey = API_CONFIG.API_KEY;
        this.baseUrl = API_CONFIG.BASE_URL;
    }

    // Build API URL
    buildUrl(endpoint, params = {}) {
        const url = new URL(`${this.baseUrl}${endpoint}`);
        url.searchParams.append('appid', this.apiKey);
        url.searchParams.append('units', params.units || 'metric');
        
        Object.keys(params).forEach(key => {
            if (key !== 'units' && key !== 'appid') {
                url.searchParams.append(key, params[key]);
            }
        });

        return url.toString();
    }

    // Fetch data from API with error handling
    async fetchData(url, cacheKey = null) {
        // Check cache first
        if (cacheKey) {
            const cached = cacheStorage.get(cacheKey);
            if (cached) {
                return cached;
            }
        }

        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Invalid API key. Please check your configuration.');
                } else if (response.status === 404) {
                    throw new Error('City not found. Please check the city name.');
                } else if (response.status === 429) {
                    throw new Error('API rate limit exceeded. Please try again later.');
                } else {
                    throw new Error(`API error: ${response.status} ${response.statusText}`);
                }
            }

            const data = await response.json();
            
            // Cache the data
            if (cacheKey) {
                cacheStorage.set(cacheKey, data, 10); // Cache for 10 minutes
            }

            return data;
        } catch (error) {
            if (error.message.startsWith('API error') || error.message.startsWith('Invalid') || 
                error.message.startsWith('City not found') || error.message.startsWith('API rate')) {
                throw error;
            }
            throw new Error('Failed to fetch weather data. Please check your internet connection.');
        }
    }

    // Get current weather by city name
    async getCurrentWeather(city, units = 'metric') {
        const url = this.buildUrl(API_CONFIG.ENDPOINTS.CURRENT_WEATHER, {
            q: city,
            units: units
        });
        
        const cacheKey = `current_${city}_${units}`;
        return await this.fetchData(url, cacheKey);
    }

    // Get 5-day forecast by city name
    async getForecast(city, units = 'metric') {
        const url = this.buildUrl(API_CONFIG.ENDPOINTS.FORECAST, {
            q: city,
            units: units
        });
        
        const cacheKey = `forecast_${city}_${units}`;
        return await this.fetchData(url, cacheKey);
    }

    // Get weather by coordinates
    async getWeatherByCoords(lat, lon, units = 'metric') {
        const currentUrl = this.buildUrl(API_CONFIG.ENDPOINTS.CURRENT_WEATHER, {
            lat: lat,
            lon: lon,
            units: units
        });

        const forecastUrl = this.buildUrl(API_CONFIG.ENDPOINTS.FORECAST, {
            lat: lat,
            lon: lon,
            units: units
        });

        const cacheKey = `coords_${lat}_${lon}_${units}`;
        
        const [current, forecast] = await Promise.all([
            this.fetchData(currentUrl, `current_${cacheKey}`),
            this.fetchData(forecastUrl, `forecast_${cacheKey}`)
        ]);

        return { current, forecast };
    }

    // Search cities (autocomplete)
    async searchCities(query) {
        if (!query || query.length < 2) return [];

        const url = this.buildUrl(API_CONFIG.ENDPOINTS.GEOCODING, {
            q: query,
            limit: 5
        });

        try {
            const response = await fetch(url);
            if (!response.ok) return [];
            
            const data = await response.json();
            return data.map(city => ({
                name: `${city.name}, ${city.country}`,
                lat: city.lat,
                lon: city.lon
            }));
        } catch (error) {
            console.error('Error searching cities:', error);
            return [];
        }
    }

    // Format weather data for display
    formatCurrentWeather(data, units) {
        const tempUnit = units === 'metric' ? '°C' : '°F';
        const speedUnit = units === 'metric' ? 'km/h' : 'mph';
        
        return {
            city: `${data.name}, ${data.sys.country}`,
            temperature: Math.round(data.main.temp) + tempUnit,
            feelsLike: Math.round(data.main.feels_like) + tempUnit,
            condition: data.weather[0].main,
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            humidity: `${data.main.humidity}%`,
            windSpeed: `${Math.round(data.wind.speed * (units === 'metric' ? 3.6 : 1))} ${speedUnit}`,
            windDirection: this.getWindDirection(data.wind.deg),
            pressure: `${data.main.pressure} hPa`,
            timestamp: new Date(data.dt * 1000)
        };
    }

    // Format forecast data
    formatForecast(data, units) {
        const tempUnit = units === 'metric' ? '°C' : '°F';
        const forecasts = [];
        const dailyData = {};

        // Group forecasts by date
        data.list.forEach(item => {
            const date = new Date(item.dt * 1000);
            const dateKey = date.toDateString();
            
            if (!dailyData[dateKey]) {
                dailyData[dateKey] = {
                    date: date,
                    temps: [],
                    conditions: [],
                    icons: []
                };
            }

            dailyData[dateKey].temps.push(item.main.temp);
            dailyData[dateKey].conditions.push(item.weather[0].main);
            dailyData[dateKey].icons.push(item.weather[0].icon);
        });

        // Get next 5 days
        const sortedDates = Object.keys(dailyData).sort((a, b) => {
            return new Date(a) - new Date(b);
        }).slice(0, 5);

        sortedDates.forEach(dateKey => {
            const day = dailyData[dateKey];
            const maxTemp = Math.max(...day.temps);
            const minTemp = Math.min(...day.temps);
            const mostCommonCondition = this.getMostCommon(day.conditions);
            const mostCommonIcon = this.getMostCommon(day.icons);

            forecasts.push({
                date: day.date,
                maxTemp: Math.round(maxTemp) + tempUnit,
                minTemp: Math.round(minTemp) + tempUnit,
                condition: mostCommonCondition,
                icon: mostCommonIcon
            });
        });

        return forecasts;
    }

    // Helper: Get most common value in array
    getMostCommon(arr) {
        const counts = {};
        arr.forEach(item => {
            counts[item] = (counts[item] || 0) + 1;
        });
        return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    }

    // Helper: Get wind direction
    getWindDirection(degrees) {
        const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        const index = Math.round(degrees / 45) % 8;
        return directions[index];
    }
}

export const weatherService = new WeatherService();



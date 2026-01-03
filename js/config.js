// API Configuration
// IMPORTANT: Replace 'YOUR_API_KEY_HERE' with your actual OpenWeatherMap API key
// Get your free API key from: https://openweathermap.org/api

export const API_CONFIG = {
    API_KEY: 'fd4b7dbc3299bae5fb587e5fb9429270', // Replace with your actual API key
    BASE_URL: 'https://api.openweathermap.org/data/2.5',
    ENDPOINTS: {
        CURRENT_WEATHER: '/weather',
        FORECAST: '/forecast',
        GEOCODING: '/geo/1.0/direct'
    }
};

// Check if API key is set
if (API_CONFIG.API_KEY === 'YOUR_API_KEY_HERE') {
    console.warn('⚠️ Please set your OpenWeatherMap API key in js/config.js');
}



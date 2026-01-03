# Weather Application

A responsive weather application that fetches real-time weather data from OpenWeatherMap API. Features include current weather, 5-day forecast, city search, and temperature conversion.

## Features

- Current weather conditions
- 5-day weather forecast
- City search with autocomplete
- Celsius/Fahrenheit conversion
- Favorite cities storage
- Responsive design
- Error handling and loading states
- Data caching with localStorage

## Setup Instructions

1. Get API key from OpenWeatherMap
   - Visit https://openweathermap.org/api
   - Sign up for a free account
   - Generate an API key from your dashboard

2. Copy .env.example to .env and add your API key
   - Copy the `.env.example` file and rename it to `.env`
   - Replace `your_api_key_here` with your actual API key

3. Open index.html in browser or deploy to GitHub Pages
   - For local development: Open `index.html` directly in your browser
   - For production: Deploy to GitHub Pages or any static hosting service

## API Used

OpenWeatherMap API - Free tier provides current weather and 5-day forecast

## Project Structure

```
week4-weather-app/
├── index.html
├── css/
│   ├── style.css
│   ├── weather-icons.css
│   └── responsive.css
├── js/
│   ├── app.js
│   ├── weatherService.js
│   ├── ui.js
│   ├── storage.js
│   └── config.js
├── assets/
│   ├── icons/
│   └── images/
├── README.md
├── .env.example
└── .gitignore
```

## Usage

1. Enter a city name in the search box
2. Click "Search" or press Enter
3. View current weather and 5-day forecast
4. Toggle between Celsius and Fahrenheit
5. Use "Use my location" to get weather for your current location
6. Add cities to favorites for quick access

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)







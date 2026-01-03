# Step-by-Step Execution Guide

## Prerequisites
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- An internet connection
- A free OpenWeatherMap API key

---

## Step 1: Get Your API Key

1. **Visit OpenWeatherMap**
   - Go to: https://openweathermap.org/api
   - Click on "Sign Up" (top right corner)

2. **Create Account**
   - Fill in your details
   - Verify your email address

3. **Get API Key**
   - Log in to your account
   - Navigate to "API Keys" section
   - Copy your default API key (or create a new one)

---

## Step 2: Configure the Application

1. **Open the Config File**
   - Navigate to: `week4-weather-app/js/config.js`
   - Open it in any text editor

2. **Add Your API Key**
   - Find the line: `API_KEY: 'YOUR_API_KEY_HERE'`
   - Replace `'YOUR_API_KEY_HERE'` with your actual API key
   - Example: `API_KEY: 'abc123def456ghi789'`
   - Save the file

---

## Step 3: Run the Application

### Option A: Direct Browser Method (Easiest)

1. **Open the HTML File**
   - Navigate to the `week4-weather-app` folder
   - Double-click on `index.html`
   - It will open in your default browser

2. **Test the Application**
   - Enter a city name (e.g., "London", "New York")
   - Click the search button or press Enter
   - You should see the weather data displayed

### Option B: Using a Local Server (Recommended for Development)

#### Using Python (if installed):
```bash
# Navigate to the project folder
cd week4-weather-app

# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Then open: `http://localhost:8000` in your browser

#### Using Node.js (if installed):
```bash
# Install http-server globally (one time)
npm install -g http-server

# Navigate to the project folder
cd week4-weather-app

# Start the server
http-server

# Or with a specific port
http-server -p 8000
```

Then open: `http://localhost:8080` (or your specified port)

#### Using VS Code Live Server:
1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

---

## Step 4: Test All Features

### Basic Features:
1. **City Search**
   - Type a city name in the search box
   - Wait for autocomplete suggestions (appears after 2+ characters)
   - Click on a suggestion or press Enter

2. **Temperature Unit Conversion**
   - Click "°C" to switch to Celsius
   - Click "°F" to switch to Fahrenheit
   - Weather data will update automatically

3. **Location-Based Weather**
   - Click "Use my location" button
   - Allow location access when prompted
   - Weather for your current location will be displayed

### Advanced Features:
4. **Favorites**
   - After searching a city, click "Add to Favorites"
   - Favorite cities appear in the Favorites section
   - Click on a favorite city to view its weather
   - Click "×" to remove from favorites

5. **5-Day Forecast**
   - After searching, scroll down to see the 5-day forecast
   - Each day shows: date, icon, max/min temperature, and condition

6. **Data Caching**
   - Weather data is cached for 10 minutes
   - Searching the same city again within 10 minutes uses cached data
   - This reduces API calls and improves performance

---

## Step 5: Troubleshooting

### Issue: "Invalid API key" Error
**Solution:**
- Double-check that you've replaced `YOUR_API_KEY_HERE` in `config.js`
- Make sure there are no extra spaces or quotes
- Verify your API key is active in OpenWeatherMap dashboard
- Wait a few minutes after creating the key (it may take time to activate)

### Issue: "City not found" Error
**Solution:**
- Check the spelling of the city name
- Try using the format: "City, Country" (e.g., "London, UK")
- Use the autocomplete suggestions for accurate city names

### Issue: "API rate limit exceeded" Error
**Solution:**
- Free tier has 60 calls/minute limit
- Wait a minute and try again
- Clear cache: Open browser console and run `localStorage.clear()`

### Issue: Location not working
**Solution:**
- Make sure you've allowed location permissions in your browser
- Check if your browser supports geolocation
- Try using HTTPS (some browsers require it for geolocation)

### Issue: Page not loading/styles broken
**Solution:**
- Make sure all files are in the correct folder structure
- Check browser console for errors (F12)
- Ensure all file paths are correct
- Try clearing browser cache

---

## Step 6: Deploy to GitHub Pages (Optional)

1. **Create GitHub Repository**
   - Go to GitHub and create a new repository
   - Name it: `weather-app` (or any name you prefer)

2. **Upload Files**
   - Initialize git: `git init`
   - Add files: `git add .`
   - Commit: `git commit -m "Initial commit"`
   - Add remote: `git remote add origin <your-repo-url>`
   - Push: `git push -u origin main`

3. **Enable GitHub Pages**
   - Go to repository Settings
   - Navigate to Pages section
   - Select source branch (usually `main`)
   - Select folder: `/ (root)`
   - Click Save

4. **Access Your App**
   - Your app will be available at: `https://<username>.github.io/<repo-name>`
   - Note: You'll need to keep your API key in the code (not recommended for production)
   - For production, use environment variables or a backend proxy

---

## File Structure Reference

```
week4-weather-app/
├── index.html              # Main HTML file
├── css/
│   ├── style.css          # Main styles
│   ├── weather-icons.css  # Weather icon styles
│   └── responsive.css     # Responsive design
├── js/
│   ├── config.js          # API configuration (EDIT THIS!)
│   ├── weatherService.js  # API service functions
│   ├── storage.js         # LocalStorage utilities
│   ├── ui.js              # UI management
│   └── app.js             # Main application logic
├── assets/
│   ├── icons/             # Icon files (if needed)
│   └── images/            # Image files (if needed)
├── README.md              # Project documentation
├── SETUP_GUIDE.md         # This file
└── .gitignore             # Git ignore file
```

---

## Next Steps

1. **Customize the Design**
   - Edit `css/style.css` to change colors, fonts, and layout
   - Modify `css/weather-icons.css` for different icon styles

2. **Add Features**
   - Weather maps integration
   - Weather alerts and warnings
   - Share functionality
   - More detailed forecasts

3. **Optimize**
   - Add service worker for offline support
   - Implement better error handling
   - Add unit tests

---

## Support

If you encounter any issues:
1. Check the browser console (F12) for error messages
2. Verify your API key is correct
3. Ensure all files are in the correct locations
4. Check your internet connection

---

**Happy Coding! 🌤️**







// LocalStorage utility functions for caching and favorites

const STORAGE_KEYS = {
    FAVORITES: 'weatherApp_favorites',
    CACHE: 'weatherApp_cache',
    LAST_CITY: 'weatherApp_lastCity',
    UNIT: 'weatherApp_unit'
};

// Favorites management
export const favoritesStorage = {
    get: () => {
        try {
            const favorites = localStorage.getItem(STORAGE_KEYS.FAVORITES);
            return favorites ? JSON.parse(favorites) : [];
        } catch (error) {
            console.error('Error reading favorites:', error);
            return [];
        }
    },

    add: (city) => {
        try {
            const favorites = favoritesStorage.get();
            if (!favorites.find(f => f.toLowerCase() === city.toLowerCase())) {
                favorites.push(city);
                localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error adding favorite:', error);
            return false;
        }
    },

    remove: (city) => {
        try {
            const favorites = favoritesStorage.get();
            const filtered = favorites.filter(f => f.toLowerCase() !== city.toLowerCase());
            localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(filtered));
            return true;
        } catch (error) {
            console.error('Error removing favorite:', error);
            return false;
        }
    },

    isFavorite: (city) => {
        const favorites = favoritesStorage.get();
        return favorites.some(f => f.toLowerCase() === city.toLowerCase());
    }
};

// Cache management (with expiration)
export const cacheStorage = {
    set: (key, data, expirationMinutes = 10) => {
        try {
            const cache = {
                data,
                timestamp: Date.now(),
                expiration: expirationMinutes * 60 * 1000
            };
            localStorage.setItem(`${STORAGE_KEYS.CACHE}_${key}`, JSON.stringify(cache));
        } catch (error) {
            console.error('Error setting cache:', error);
        }
    },

    get: (key) => {
        try {
            const cached = localStorage.getItem(`${STORAGE_KEYS.CACHE}_${key}`);
            if (!cached) return null;

            const { data, timestamp, expiration } = JSON.parse(cached);
            const now = Date.now();

            if (now - timestamp > expiration) {
                localStorage.removeItem(`${STORAGE_KEYS.CACHE}_${key}`);
                return null;
            }

            return data;
        } catch (error) {
            console.error('Error reading cache:', error);
            return null;
        }
    },

    clear: () => {
        try {
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith(STORAGE_KEYS.CACHE)) {
                    localStorage.removeItem(key);
                }
            });
        } catch (error) {
            console.error('Error clearing cache:', error);
        }
    }
};

// User preferences
export const preferencesStorage = {
    getLastCity: () => {
        return localStorage.getItem(STORAGE_KEYS.LAST_CITY) || '';
    },

    setLastCity: (city) => {
        localStorage.setItem(STORAGE_KEYS.LAST_CITY, city);
    },

    getUnit: () => {
        return localStorage.getItem(STORAGE_KEYS.UNIT) || 'metric';
    },

    setUnit: (unit) => {
        localStorage.setItem(STORAGE_KEYS.UNIT, unit);
    }
};







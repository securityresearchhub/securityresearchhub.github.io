import { useState, useEffect } from 'react';

export interface LocationData {
    country: string;
    state: string | null;
    timezone: string;
}

const SESSION_CACHE_KEY = 'geo_location_data';

export const useGeoLocation = () => {
    const [location, setLocation] = useState<LocationData | null>(() => {
        const cached = sessionStorage.getItem(SESSION_CACHE_KEY);
        return cached ? JSON.parse(cached) : null;
    });
    const [loading, setLoading] = useState(!location);

    useEffect(() => {
        if (location) return;

        const fetchGeo = async () => {
            try {
                // Primary: IP-based geolocation
                const response = await fetch('https://ipapi.co/json/');
                if (!response.ok) throw new Error('Geo API failed');
                const data = await response.json();

                const geoData: LocationData = {
                    country: data.country_name || 'Global',
                    state: data.region || null,
                    timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
                };

                sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(geoData));
                setLocation(geoData);
            } catch (error) {
                console.warn('Geolocation API failed, using fallback.');

                // Fallback: Browser Intelligence
                const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
                const fallbackData: LocationData = {
                    country: tz.includes('Kolkata') ? 'India' : 'Global',
                    state: null, // State cannot be reliably detected from TZ
                    timezone: tz,
                };

                setLocation(fallbackData);
            } finally {
                setLoading(false);
            }
        };

        fetchGeo();
    }, [location]);

    return { location, loading };
};

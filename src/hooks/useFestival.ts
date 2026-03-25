import { useState, useMemo, useEffect } from 'react';
import { useGeoLocation } from './useGeoLocation';
import { getActiveFestival, Festival } from '../../utils/festivalUtils';

const TOGGLE_KEY = 'festival_overlay_disabled';

export const useFestival = () => {
    const { location, loading: geoLoading } = useGeoLocation();
    const [isFirstLoad, setIsFirstLoad] = useState(true);

    const [isDisabled, setIsDisabled] = useState(() => {
        return sessionStorage.getItem(TOGGLE_KEY) === 'true';
    });

    useEffect(() => {
        if (!geoLoading && location) {
            const timer = setTimeout(() => setIsFirstLoad(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [geoLoading, location]);

    const activeFestival = useMemo(() => {
        if (geoLoading || !location || isDisabled) return null;
        return getActiveFestival(location.country, location.state);
    }, [location, geoLoading, isDisabled]);

    const toggleFestival = () => {
        const newState = !isDisabled;
        setIsDisabled(newState);
        sessionStorage.setItem(TOGGLE_KEY, newState.toString());
    };

    return {
        festival: activeFestival,
        isDisabled,
        toggleFestival,
        loading: geoLoading,
        isFirstLoad
    };
};

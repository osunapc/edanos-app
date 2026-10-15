import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Platform } from 'react-native';

interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number | null;
  altitudeAccuracy?: number | null;
}

interface GeolocationHook {
  coordinates: Coordinates | null;
  error: string | null;
  isLoading: boolean;
  requestPermission: () => Promise<boolean>;
  getCurrentLocation: () => Promise<void>;
}

export function useGeolocation(): GeolocationHook {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const requestPermission = async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setIsLoading(false);
      
      if (status !== 'granted') {
        setError('Permiso de ubicación denegado');
        return false;
      }
      
      return true;
    } catch (err) {
      setIsLoading(false);
      setError('Error al solicitar permisos: ' + (err instanceof Error ? err.message : String(err)));
      return false;
    }
  };

  const getCurrentLocation = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // First check if we have permission
      const { status } = await Location.getForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        const hasPermission = await requestPermission();
        if (!hasPermission) return;
      }

      // Get the location with appropriate settings
      const location = await Location.getCurrentPositionAsync({
        accuracy: Platform.OS === 'android' 
          ? Location.Accuracy.High 
          : Location.Accuracy.Highest,
        timeInterval: 5000, // 5 seconds
        mayShowUserSettingsDialog: true
      });

      setCoordinates({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        altitude: location.coords.altitude,
        altitudeAccuracy: location.coords.altitudeAccuracy,
      });
    } catch (err) {
      setError('Error al obtener ubicación: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  // Initially try to get location when component mounts
  useEffect(() => {
    requestPermission().then(hasPermission => {
      if (hasPermission) {
        getCurrentLocation();
      }
    });
  }, []);

  return {
    coordinates,
    error,
    isLoading,
    requestPermission,
    getCurrentLocation
  };
}
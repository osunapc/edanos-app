import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => Promise<void>, boolean, Error | null] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load from storage on mount
  useEffect(() => {
    async function getValueFromStorage() {
      try {
        const item = await SecureStore.getItemAsync(key);
        
        if (item !== null) {
          setStoredValue(JSON.parse(item));
        } else {
          // If item doesn't exist in storage, use initial value
          setStoredValue(initialValue);
          await SecureStore.setItemAsync(key, JSON.stringify(initialValue));
        }
      } catch (e) {
        setError(e instanceof Error ? e : new Error(String(e)));
      } finally {
        setLoading(false);
      }
    }
    
    getValueFromStorage();
  }, [key, initialValue]);

  // Save to storage
  const setValue = async (value: T): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // Save state
      setStoredValue(value);
      
      // Save to secure storage
      await SecureStore.setItemAsync(key, JSON.stringify(value));
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  };

  return [storedValue, setValue, loading, error];
}
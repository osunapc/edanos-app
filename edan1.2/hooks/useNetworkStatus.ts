import { useState, useEffect, useCallback } from 'react';
import * as Network from 'expo-network';

export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isInternetReachable, setIsInternetReachable] = useState<
    boolean | null
  >(null);
  const [networkType, setNetworkType] = useState<string | null>(null);

  const checkNetwork = useCallback(async () => {
    try {
      const networkState = await Network.getNetworkStateAsync();
      setIsConnected(networkState.isConnected);
      setIsInternetReachable(networkState.isInternetReachable);
      setNetworkType(networkState.type);
    } catch (error) {
      console.error('Error checking network status:', error);
      setIsConnected(false);
      setIsInternetReachable(false);
    }
  }, []);

  useEffect(() => {
    checkNetwork();

    // Set up an interval to periodically check network status
    const intervalId = setInterval(checkNetwork, 10000); // Check every 10 seconds

    return () => clearInterval(intervalId);
  }, [checkNetwork]);

  return {
    isConnected,
    isInternetReachable,
    networkType,
    checkNetwork,
  };
}

import React, { createContext, useState, useEffect, useContext } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeSocket, disconnectSocket } from '../services/socketService';
import { LoginCredentials, User, AuthContextType } from '../types/auth';
import { API_URL, AUTH_TOKEN_KEY, USER_DATA_KEY } from '../confg/constants';
import { Socket } from 'socket.io-client';
import { Evento } from '../types/evaluation';

const EVENTO_ACTIVO_KEY = 'evento_activo';

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  socket: null,
  login: async () => {},
  logout: async () => {},
  error: null,
  eventoActivo: null,
  selectEvento: async () => {},
  clearEvento: async () => {},
});

const storage = {
  async getItem(key: string): Promise<string | null> {
    if (key === AUTH_TOKEN_KEY) {
      return SecureStore.getItemAsync(key);
    }
    return AsyncStorage.getItem(key);
  },
  async setItem(key: string, value: string): Promise<void> {
    if (key === AUTH_TOKEN_KEY) {
      await SecureStore.setItemAsync(key, value);
    } else {
      await AsyncStorage.setItem(key, value);
    }
  },
  async removeItem(key: string): Promise<void> {
    if (key === AUTH_TOKEN_KEY) {
      await SecureStore.deleteItemAsync(key);
    } else {
      await AsyncStorage.removeItem(key);
    }
  },
};

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventoActivo, setEventoActivo] = useState<Evento | null>(null);

  useEffect(() => {
    async function loadUserAndSetupSocket() {
      try {
        const token = await storage.getItem(AUTH_TOKEN_KEY);
        const userDataString = await storage.getItem(USER_DATA_KEY);
        const eventoString = await storage.getItem(EVENTO_ACTIVO_KEY);

        if (token && userDataString) {
          const userData = JSON.parse(userDataString);
          setUser(userData);
          const newSocket = initializeSocket(token);
          setSocket(newSocket);
        }

        if (eventoString) {
          setEventoActivo(JSON.parse(eventoString));
        }
      } catch (err) {
        console.error('Error al cargar datos de autenticación:', err);
        setUser(null);
        if (socket) {
          disconnectSocket();
          setSocket(null);
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadUserAndSetupSocket();

    return () => {
      if (socket) {
        disconnectSocket();
      }
    };
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/usuarios/loginMovil`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en la autenticación');
      }
      if (typeof data.token !== 'string' || data.token.length === 0) {
        throw new Error('Token inválido o no proporcionado por el servidor.');
      }

      await storage.setItem(AUTH_TOKEN_KEY, data.token);
      await storage.setItem(USER_DATA_KEY, JSON.stringify(data));
      setUser(data);

      const newSocket = initializeSocket(data.token);
      setSocket(newSocket);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión');
      console.error('Error en el login:', err);
      setUser(null);
      if (socket) {
        disconnectSocket();
        setSocket(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      if (socket) {
        disconnectSocket();
        setSocket(null);
      }
      await storage.removeItem(AUTH_TOKEN_KEY);
      await storage.removeItem(USER_DATA_KEY);
      await storage.removeItem(EVENTO_ACTIVO_KEY);
      setUser(null);
      setEventoActivo(null);
    } catch (err) {
      console.error('Error en el logout:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const selectEvento = async (evento: Evento) => {
    setEventoActivo(evento);
    await storage.setItem(EVENTO_ACTIVO_KEY, JSON.stringify(evento));
  };

  const clearEvento = async () => {
    setEventoActivo(null);
    await storage.removeItem(EVENTO_ACTIVO_KEY);
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    socket,
    login,
    logout,
    error,
    eventoActivo,
    selectEvento,
    clearEvento,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

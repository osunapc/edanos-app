import { useState, useEffect, useCallback } from 'react';
import { Evento } from '../types/evaluation';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../confg/constants';

export function useEventos() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchEventos = useCallback(async () => {
    try {
      setIsLoading(true);
      // En móvil solo nos interesan los eventos activos para crear evaluaciones
      const response = await fetch(`${API_URL}/api/eventos/activos`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al cargar eventos');
      }

      const data = await response.json();
      setEventos(data);
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    if (user?.token) {
      fetchEventos();
    }
  }, [fetchEventos, user?.token]);

  return {
    eventos,
    isLoading,
    error,
    refreshEventos: fetchEventos,
  };
}

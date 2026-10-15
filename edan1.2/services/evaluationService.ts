import { API_URL, EVALUATIONS_KEY } from '../confg/constants';
import { EvaluationSummary } from '../types/evaluation';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Platform-specific storage helpers
const getStorageItem = async (key: string): Promise<string | null> => {
  try {
    if (key === 'auth_token') {
      return await SecureStore.getItemAsync(key);
    } else {
      return await AsyncStorage.getItem(key);
    }
  } catch (e) {
    console.error(`Error getting item for key ${key}`, e);
    return null;
  }
};

const setStorageItem = async (key: string, value: string): Promise<void> => {
  try {
    // Usamos AsyncStorage para la caché de evaluaciones por su capacidad de datos grandes
    // El auth_token lo seguimos manejando con SecureStore por seguridad
    if (key === 'auth_token') {
      await SecureStore.setItemAsync(key, value);
    } else {
      await AsyncStorage.setItem(key, value);
    }
  } catch (e) {
    console.error(`Error setting item for key ${key}`, e);
  }
};

// Helper function to get cached evaluations
const getCachedEvaluations = async (): Promise<EvaluationSummary[]> => {
  try {
    const cachedData = await getStorageItem(EVALUATIONS_KEY);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
  } catch (error) {
    console.error('Error retrieving cached evaluations:', error);
  }
  return [];
};

// Helper function to set cached evaluations
const setCachedEvaluations = async (
  evaluations: EvaluationSummary[],
): Promise<void> => {
  try {
    await setStorageItem(EVALUATIONS_KEY, JSON.stringify(evaluations));
  } catch (error) {
    console.error('Error caching evaluations:', error);
  }
};

// Function to fetch evaluations from API
export const fetchEvaluations = async (eventoId?: number): Promise<EvaluationSummary[]> => {
  try {
    const token = await getStorageItem('auth_token');
    const url = eventoId
      ? `${API_URL}/api/edan?eventoId=${eventoId}`
      : `${API_URL}/api/edan`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    //console.log('Fetch evaluations response status:', response);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    // Cache the fetched data
    await setCachedEvaluations(data);

    // Mark as synced
    const syncedData = data.map((item: EvaluationSummary) => ({
      ...item,
      synced: true,
    }));

    return syncedData;
  } catch (error) {
    console.warn('Error fetching evaluations, falling back to cache:', error);

    // Fallback to cached data
    const cachedData = await getCachedEvaluations();

    return cachedData;
  }
};

const getFileName = (uri: string) => uri.split('/').pop() || 'image.jpg';

// Function to create a new evaluation
export const createEvaluation = async (
  evaluationData: any,
): Promise<EvaluationSummary> => {
  try {
    const token = await getStorageItem('auth_token');
    const formData = new FormData();

    // 1. Adjuntar archivos de imagen
    if (Platform.OS === 'web') {
      if (evaluationData.fotoFamiliarFile) {
        const uri = evaluationData.fotoFamiliarFile;
        const response = await fetch(uri);
        const blob = await response.blob();
        formData.append('fotoFamiliar', blob, getFileName(uri));
      }

      if (
        evaluationData.fotosAdicionalesFiles &&
        evaluationData.fotosAdicionalesFiles.length > 0
      ) {
        for (const uri of evaluationData.fotosAdicionalesFiles) {
          const response = await fetch(uri);
          const blob = await response.blob();
          formData.append('fotosAdicionales', blob, getFileName(uri));
        }
      }
    } else {
      // Mobile
      if (evaluationData.fotoFamiliarFile) {
        const uri = evaluationData.fotoFamiliarFile;
        const fileName = getFileName(uri);
        const fileType = fileName.includes('.')
          ? `image/${fileName.split('.').pop()}`
          : 'image/jpeg';

        const file = {
          uri: uri,
          name: fileName,
          type: fileType,
        } as any;
        formData.append('fotoFamiliar', file);
      }

      if (
        evaluationData.fotosAdicionalesFiles &&
        evaluationData.fotosAdicionalesFiles.length > 0
      ) {
        for (const uri of evaluationData.fotosAdicionalesFiles) {
          const fileName = getFileName(uri);
          const fileType = fileName.includes('.')
            ? `image/${fileName.split('.').pop()}`
            : 'image/jpeg';

          const file = {
            uri: uri,
            name: fileName,
            type: fileType,
          } as any;
          formData.append('fotosAdicionales', file);
        }
      }
    }

    // 2. Eliminar los campos de archivo del objeto principal para no enviarlos dos veces
    delete evaluationData.fotoFamiliarFile;
    delete evaluationData.fotosAdicionalesFiles;

    // 3. Adjuntar el resto de los datos como strings
    for (const key in evaluationData) {
      if (Object.prototype.hasOwnProperty.call(evaluationData, key)) {
        const value = evaluationData[key];
        // Los arrays (excepto los de archivos) y objetos se convierten a string JSON
        if (
          Array.isArray(value) ||
          (typeof value === 'object' && value !== null)
        ) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      }
    }

    // 4. Enviar la petición
    const response = await fetch(`${API_URL}/api/edan`, {
      method: 'POST',
      headers: {
        // NO establecer 'Content-Type': 'multipart/form-data'.
        // El navegador lo hace automáticamente y añade el boundary correcto.
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Error response from server:', errorBody);
      throw new Error('Failed to create evaluation on server');
    }

    const newEvaluation = await response.json();

    // Update cache with new evaluation
    const cachedEvaluations = await getCachedEvaluations();
    const updatedCache = [
      ...cachedEvaluations,
      { ...newEvaluation, synced: true },
    ];
    await setCachedEvaluations(updatedCache);

    return { ...newEvaluation, synced: true };
  } catch (error) {
    console.error('Error creating evaluation:', error);

    // Guardado local en caso de fallo de red (lógica existente)
    const offlineEvaluation: EvaluationSummary = {
      ...evaluationData,
      id: `temp_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      synced: false,
    };

    const cachedEvaluations = await getCachedEvaluations();
    const updatedCache = [...cachedEvaluations, offlineEvaluation];
    await setCachedEvaluations(updatedCache);

    throw new Error(
      'La evaluación se guardó localmente pero no se pudo sincronizar con el servidor.',
    );
  }
};

// Function to update an evaluation
export const updateEvaluation = async (
  id: string,
  evaluationData: any,
): Promise<EvaluationSummary> => {
  try {
    const response = await fetch(`${API_URL}/api/edan/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(evaluationData),
    });

    if (!response.ok) {
      throw new Error('Failed to update evaluation');
    }

    const updatedEvaluation = await response.json();

    // Update cache
    const cachedEvaluations = await getCachedEvaluations();
    const updatedCache = cachedEvaluations.map((item) =>
      item.id === id ? { ...updatedEvaluation, synced: true } : item,
    );
    await setCachedEvaluations(updatedCache);

    return { ...updatedEvaluation, synced: true };
  } catch (error) {
    console.error('Error updating evaluation:', error);

    // Update in cache with offline flag
    const cachedEvaluations = await getCachedEvaluations();
    const updatedCache = cachedEvaluations.map((item) =>
      item.id === id
        ? {
            ...evaluationData,
            id,
            updatedAt: new Date().toISOString(),
            synced: false,
          }
        : item,
    );
    await setCachedEvaluations(updatedCache);

    throw new Error(
      'Los cambios se guardaron localmente pero no se pudieron sincronizar con el servidor.',
    );
  }
};

// Function to delete an evaluation
export const deleteEvaluation = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/api/edan/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete evaluation');
    }

    // Update cache
    const cachedEvaluations = await getCachedEvaluations();
    const updatedCache = cachedEvaluations.filter((item) => item.id !== id);
    await setCachedEvaluations(updatedCache);
  } catch (error) {
    console.error('Error deleting evaluation:', error);

    // If it's a temporary evaluation, remove from cache
    if (id.startsWith('temp_')) {
      const cachedEvaluations = await getCachedEvaluations();
      const updatedCache = cachedEvaluations.filter((item) => item.id !== id);
      await setCachedEvaluations(updatedCache);
    } else {
      // Mark for deletion in cache
      const cachedEvaluations = await getCachedEvaluations();
      const updatedCache = cachedEvaluations.map((item) =>
        item.id === id ? { ...item, _deleted: true, synced: false } : item,
      );
      await setCachedEvaluations(updatedCache);
    }

    throw new Error(
      'La evaluación se eliminó localmente pero no se pudo sincronizar con el servidor.',
    );
  }
};

// Function to get a single evaluation by ID
export const getEvaluationById = async (id: string): Promise<any> => {
  try {
    // First check cache
    const cachedEvaluations = await getCachedEvaluations();
    const cachedEvaluation = cachedEvaluations.find((item) => item.id === id);

    if (cachedEvaluation) {
      return cachedEvaluation;
    }

    // If not in cache, fetch from API
    const token = await getStorageItem('auth_token');
    const response = await fetch(`${API_URL}/api/edan/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    //console.log('Get evaluation by ID response status:', response);

    if (!response.ok) {
      throw new Error('Failed to fetch evaluation');
    }

    const evaluation = await response.json();
    return { ...evaluation, synced: true };
  } catch (error) {
    console.error('Error fetching evaluation:', error);
    throw new Error('No se pudo obtener la evaluación.');
  }
};

export const uploadImages = async (files: {
  fotoFamiliarFile?: string;
  fotosAdicionalesFiles?: string[];
}): Promise<{ fotoFamiliar?: string; fotosAdicionales?: string[] }> => {
  try {
    const token = await getStorageItem('auth_token');
    const formData = new FormData();

    // Platform-specific file handling
    if (Platform.OS === 'web') {
      // Web: fetch URI to get blob, works for blob: URLs
      if (files.fotoFamiliarFile) {
        const uri = files.fotoFamiliarFile;
        const response = await fetch(uri);
        const blob = await response.blob();
        formData.append('fotoFamiliar', blob, getFileName(uri));
      }

      if (
        files.fotosAdicionalesFiles &&
        files.fotosAdicionalesFiles.length > 0
      ) {
        for (const uri of files.fotosAdicionalesFiles) {
          const response = await fetch(uri);
          const blob = await response.blob();
          formData.append(
            `fotosAdicionales[${Date.now()}]`,
            blob,
            getFileName(uri),
          );
        }
      }
    } else {
      // Mobile: pass file URI directly to FormData
      if (files.fotoFamiliarFile) {
        const uri = files.fotoFamiliarFile;
        const fileName = getFileName(uri);
        const fileType = fileName.includes('.')
          ? `image/${fileName.split('.').pop()}`
          : 'image/jpeg';

        const file = {
          uri: uri,
          name: fileName,
          type: fileType,
        } as any;
        formData.append('fotoFamiliar', file);
      }

      if (
        files.fotosAdicionalesFiles &&
        files.fotosAdicionalesFiles.length > 0
      ) {
        for (const uri of files.fotosAdicionalesFiles) {
          const fileName = getFileName(uri);
          const fileType = fileName.includes('.')
            ? `image/${fileName.split('.').pop()}`
            : 'image/jpeg';

          const file = {
            uri: uri,
            name: fileName,
            type: fileType,
          } as any;
          formData.append(`fotosAdicionales[${Date.now()}]`, file);
        }
      }
    }

    const response = await fetch(`${API_URL}/api/edan/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    console.log('respuesta de servidor:', response);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Error response from server (uploadImages):', errorBody);
      throw new Error('Failed to upload images');
    }

    return await response.json();
  } catch (error: unknown) {
    console.error(
      'Error uploading images:',
      error instanceof Error ? error.message : String(error),
    );
    throw new Error('No se pudieron subir las imágenes.');
  }
};

// Function to sync offline evaluations
export const syncOfflineEvaluations = async (): Promise<void> => {
  const cachedEvaluations = await getCachedEvaluations();
  const offlineEvaluations = cachedEvaluations.filter((item) => !item.synced);

  if (offlineEvaluations.length === 0) {
    return;
  }

  for (const evaluation of offlineEvaluations) {
    try {
      // Handle deleted items
      if (evaluation._deleted) {
        await fetch(`${API_URL}/api/edan/${evaluation.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        continue;
      }

      // Handle new items (temporary IDs)
      if (evaluation.id.startsWith('temp_')) {
        const { id, synced, _deleted, ...evalData } = evaluation;
        await fetch(`${API_URL}/api/edan`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(evalData),
        });
        continue;
      }

      // Handle updated items
      const { synced, _deleted, ...evalData } = evaluation;
      await fetch(`${API_URL}/api/edan/${evaluation.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(evalData),
      });
    } catch (error) {
      console.error(`Error syncing evaluation ${evaluation.id}:`, error);
    }
  }

  // Refresh the evaluations from server
  await fetchEvaluations(undefined);
};

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  getEvaluationById,
  updateEvaluation,
} from '@/services/evaluationService';
import { useAuth } from '@/context/AuthContext';
import EvaluationForm from '@/components/EvaluationForm';
import { FormData } from '@/types/evaluation';
import colors from '@/constants/colors';
import { socket } from '@/services/socketService';

export default function EditEvaluationScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuth();

  const [initialData, setInitialData] = useState<Partial<FormData> | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (id) {
      const fetchEvaluation = async () => {
        try {
          setIsLoading(true);
          const evaluation = await getEvaluationById(id);
          setInitialData(evaluation);
        } catch (err) {
          setError('No se pudo cargar la evaluación.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchEvaluation();
    }
  }, [id]);

  const handleUpdateEvaluation = async (data: FormData) => {
    console.log('actualizando evaluacion data:', data);
    if (!id) return;

    try {
      setIsSubmitting(true);
      socket.emit('app:update-evaluation', { data });
      Alert.alert(
        'Evaluación Actualizada',
        'La evaluación se ha actualizado exitosamente.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/'),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error
          ? error.message
          : 'Ha ocurrido un error al actualizar la evaluación.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando Evaluación...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Editar Evaluación</Text>
      </View>
      {initialData && (
        <EvaluationForm
          initialData={initialData}
          onSubmit={handleUpdateEvaluation}
          isSubmitting={isSubmitting}
          submitButtonText="Actualizar Evaluación"
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.card,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.textLight,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
  },
});

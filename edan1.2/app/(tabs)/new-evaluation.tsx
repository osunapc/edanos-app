import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { uploadImages } from '@/services/evaluationService';
import { useAuth } from '@/context/AuthContext';
import EvaluationForm from '@/components/EvaluationForm';
import { FormData } from '@/types/evaluation';
import colors from '@/constants/colors';
import { getSocket } from '@/services/socketService';

export default function NewEvaluationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isAuthenticated, eventoActivo } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    } else if (!eventoActivo) {
      Alert.alert(
        'Código requerido',
        'Debe ingresar un código de evento antes de crear una evaluación.',
        [{ text: 'OK', onPress: () => router.replace('/(tabs)') }],
      );
    }
  }, [isAuthenticated, eventoActivo, router]);

  const handleCreateEvaluation = async (data: FormData) => {
    console.log('Datos recibidos del formulario:', data);
    try {
      setIsSubmitting(true);

      // 1. Extraer y subir las imágenes primero
      const { fotoFamiliarFile, fotosAdicionalesFiles, ...restOfData } = data;
      let uploadedImageUrls: { fotoFamiliar?: string; fotosAdicionales?: string[] } = {};

      if (
        fotoFamiliarFile ||
        (fotosAdicionalesFiles && fotosAdicionalesFiles.length > 0)
      ) {
        console.log('Subiendo imágenes...');
        uploadedImageUrls = await uploadImages({
          fotoFamiliarFile,
          fotosAdicionalesFiles,
        });
        console.log('URLs de imágenes recibidas:', uploadedImageUrls);
      }

      // 2. Combinar los datos del formulario con las URLs de las imágenes
      const finalData = {
        ...restOfData,
        fotoFamiliar: uploadedImageUrls.fotoFamiliar || null,
        fotosAdicionales: uploadedImageUrls.fotosAdicionales || [],
        eventoId: eventoActivo?.id || null,
      };

      // 3. Enviar los datos finales a través del socket
      console.log('Enviando datos finales por socket:', finalData);
      getSocket().emit('app:create-evaluation', { data: finalData });

      Alert.alert(
        'Evaluación Enviada',
        'La evaluación se ha enviado para su procesamiento.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error
          ? error.message
          : 'Ha ocurrido un error al crear la evaluación.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nueva Evaluación</Text>
      </View>
      <EvaluationForm
        onSubmit={handleCreateEvaluation}
        isSubmitting={isSubmitting}
        submitButtonText="Crear Evaluación"
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.card,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
});

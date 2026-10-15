import { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import * as Updates from 'expo-updates';
import { isRunningInExpoGo } from 'expo';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkForUpdates = async () => {
      // Solo intentar actualizar si NO estamos en Expo Go
      if (isRunningInExpoGo()) {
        // console.log('Saltando actualización en Expo Go');
        return;
      }
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (error) {
        console.error('Error checking for updates:', error);
      }
    };

    checkForUpdates();
  }, []);

  useEffect(() => {
    // Short delay to show splash screen
    const timer = setTimeout(() => {
      if (isLoading) return;

      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/login');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, isLoading, router]);

  return (
    <ImageBackground
      source={require('@/assets/images/hor.webp')}
      style={styles.container}
      imageStyle={styles.backgroundImage}
      resizeMode="cover"
      blurRadius={2} // Puedes ajustar este valor para más o menos desenfoque
    >
      <View style={styles.overlay}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require('@/assets/images/icon.png')}
          />
        </View>
        <Text style={styles.title}>EDANOS</Text>
        <Text style={styles.subtitle}>
          Evaluación de Daños y Análisis de Necesidades EDANOS
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Capa oscura para mejorar legibilidad
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,

    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    overflow: 'hidden',
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    fontFamily: 'Roboto-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    maxWidth: '80%',
    fontFamily: 'Roboto-Regular',
  },
});

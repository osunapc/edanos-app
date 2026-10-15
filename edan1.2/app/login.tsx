import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import colors from '@/constants/colors';
import Button from '@/components/ui/Button';

export default function Login() {
  const [cedula, setCedula] = useState('');
  const [contrasena, setcontrasena] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!cedula.trim()) {
      Alert.alert('Error', 'Por favor ingrese su cédula');
      return;
    }

    if (!contrasena) {
      Alert.alert('Error', 'Por favor ingrese su contraseña');
      return;
    }

    try {
      await login({ cedula, contrasena });
    } catch (err) {
      // Error handling is done in the AuthContext
      console.error(err);
    }
  };
  // Navegación condicional después de montar el componente
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, router]);

  const handleForgotPassword = () => {
    // Implement forgot password flow
    Alert.alert(
      'Recuperar Contraseña',
      'Por favor contacte a su administrador para restablecer su contraseña.',
      [{ text: 'OK' }]
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require('@/assets/images/icon.png')}
          />
        </View>

        <Text style={styles.title}>EDAN</Text>
        <Text style={styles.subtitle}>
          Evaluación de Daños y Análisis de Necesidades
        </Text>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <MaterialIcons
              name="person"
              size={24}
              color={colors.textLight}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Cédula"
              placeholderTextColor={colors.textLight}
              keyboardType="numeric"
              value={cedula}
              onChangeText={setCedula}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons
              name="lock"
              size={24}
              color={colors.textLight}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor={colors.textLight}
              secureTextEntry={!showPassword}
              value={contrasena}
              onChangeText={setcontrasena}
            />
            <TouchableOpacity
              style={styles.visibilityIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <MaterialIcons
                name={showPassword ? 'visibility-off' : 'visibility'}
                size={24}
                color={colors.textLight}
              />
            </TouchableOpacity>
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <Button
            title="Iniciar Sesión"
            onPress={handleLogin}
            isLoading={isLoading}
            style={styles.loginButton}
          />

          <TouchableOpacity
            style={styles.forgotPasswordButton}
            onPress={handleForgotPassword}
          >
            <Text style={styles.forgotPasswordText}>
              ¿Olvidó su contraseña?
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
    fontFamily: 'Roboto-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 32,
    textAlign: 'center',
    fontFamily: 'Roboto-Regular',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: colors.text,
  },
  visibilityIcon: {
    padding: 8,
  },
  loginButton: {
    backgroundColor: colors.primary,
    marginTop: 8,
    height: 56,
  },
  forgotPasswordButton: {
    alignSelf: 'center',
    marginTop: 16,
    padding: 8,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
  },
  errorText: {
    color: colors.error,
    marginBottom: 16,
    textAlign: 'center',
  },
});

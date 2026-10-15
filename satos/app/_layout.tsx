import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Animated, Image, StyleSheet, View } from "react-native";

// Mantener el splash screen nativo visible hasta que estemos listos para ocultarlo manualmente
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [appIsReady, setAppIsReady] = useState(false);
	const fadeAnim = useState(new Animated.Value(1))[0];

	useEffect(() => {
		async function prepare() {
			try {
				// Ocultar el splash nativo inmediatamente para mostrar nuestro splash simulado
				await SplashScreen.hideAsync();

				// Simulación de carga inicial de 3 segundos
				// Aquí podrías cargar fuentes, datos iniciales, etc.
				await new Promise((resolve) => setTimeout(resolve, 3000));

				// Animación de desvanecimiento (fade out) antes de mostrar la app
				Animated.timing(fadeAnim, {
					toValue: 0,
					duration: 500,
					useNativeDriver: true,
				}).start();

				// Esperar a que termine la animación
				await new Promise((resolve) => setTimeout(resolve, 500));
			} catch (e) {
				console.warn("Error en la inicialización:", e);
			} finally {
				// Indicar que la aplicación está lista para renderizar el contenido principal
				setAppIsReady(true);
			}
		}

		prepare();
	}, []);

	// Mostrar splash screen simulado mientras la app no está lista
	if (!appIsReady) {
		return (
			<View style={styles.splashContainer}>
				<StatusBar style="light" />
				<Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
					<Image
						source={require("../assets/images/splash-screen.png")}
						style={styles.splashLogo}
						resizeMode="cover"
					/>
				</Animated.View>
			</View>
		);
	}

	return (
		<>
			<StatusBar style="light" />
			<Stack
				screenOptions={{
					headerStyle: {
						backgroundColor: "#1f2937", // dark-gray-900 equivalent
					},
					headerTintColor: "#fff",
					headerTitleStyle: {
						fontWeight: "bold",
					},
					contentStyle: {
						backgroundColor: "#111827", // dark-gray-950
					},
				}}
			>
				<Stack.Screen
					name="index"
					options={{ title: "Satos Alerta", headerShown: false }}
				/>
				<Stack.Screen name="report" options={{ title: "Nuevo Reporte" }} />
			</Stack>
		</>
	);
}

const styles = StyleSheet.create({
	splashContainer: {
		flex: 1,
		backgroundColor: "#111827", // Mismo color oscuro de la app
	},
	logoContainer: {
		flex: 1,
		width: "100%",
		height: "100%",
	},
	splashLogo: {
		width: "100%",
		height: "100%",
	},
});

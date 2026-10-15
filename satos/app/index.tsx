import { useCameraPermissions } from "expo-camera";
import { useForegroundPermissions } from "expo-location";
import { router, Stack } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AnimatedBackground from "../components/AnimatedBackground";

export default function HomeScreen() {
	const [cameraPermission, requestCameraPermission] = useCameraPermissions();
	const [locationPermission, requestLocationPermission] =
		useForegroundPermissions();

	useEffect(() => {
		async function checkPermissions() {
			if (!cameraPermission?.granted) {
				await requestCameraPermission();
			}
			if (!locationPermission?.granted) {
				await requestLocationPermission();
			}
		}
		checkPermissions();
	}, [cameraPermission, locationPermission]);

	return (
		<SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
			<Stack.Screen options={{ headerShown: false }} />
			<AnimatedBackground />

			{/* Header */}
			<View style={styles.header}>
				<Text style={styles.title}>SATOS</Text>
				<Text style={styles.subtitle}>Sistema de Alerta Temprana</Text>
			</View>

			{/* Botón Principal */}
			<View style={styles.content}>
				<TouchableOpacity
					style={styles.panicButton}
					activeOpacity={0.8}
					onPress={() => router.push("/report")}
				>
					<View style={styles.panicButtonInner}>
						<Text style={styles.panicButtonIcon}>🚨</Text>
						<Text style={styles.panicButtonText}>REPORTAR{"\n"}EMERGENCIA</Text>
					</View>
				</TouchableOpacity>

				<Text style={styles.instructionText}>
					Presione para reportar una emergencia en su comunidad
				</Text>
			</View>

			{/* Footer */}
			<View style={styles.footer}>
				<Text style={styles.footerText}>De Osuna para Venezuela</Text>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#0a0a0f",
		padding: 20,
	},
	header: {
		marginTop: 20,
		alignItems: "center",
	},
	title: {
		fontSize: 48,
		fontWeight: "900",
		color: "#f97316",
		letterSpacing: 8,
		textShadowColor: "#f97316",
		textShadowOffset: { width: 0, height: 0 },
		textShadowRadius: 15,
	},
	subtitle: {
		fontSize: 14,
		color: "#888",
		marginTop: 8,
		letterSpacing: 3,
	},
	content: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	panicButton: {
		width: 260,
		height: 260,
		borderRadius: 130,
		backgroundColor: "rgba(239, 68, 68, 0.15)",
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 3,
		borderColor: "#ef4444",
		shadowColor: "#ef4444",
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.8,
		shadowRadius: 30,
		elevation: 20,
	},
	panicButtonInner: {
		width: 220,
		height: 220,
		borderRadius: 110,
		backgroundColor: "#ef4444",
		justifyContent: "center",
		alignItems: "center",
		shadowColor: "#ef4444",
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.6,
		shadowRadius: 25,
		elevation: 15,
	},
	panicButtonIcon: {
		fontSize: 50,
		marginBottom: 10,
	},
	panicButtonText: {
		color: "#fff",
		fontSize: 22,
		fontWeight: "bold",
		letterSpacing: 3,
		textAlign: "center",
		lineHeight: 28,
	},
	instructionText: {
		color: "#555",
		textAlign: "center",
		marginTop: 40,
		fontSize: 15,
		maxWidth: "75%",
		lineHeight: 22,
	},
	footer: {
		alignItems: "center",
		paddingBottom: 20,
	},
	footerText: {
		color: "#333",
		fontSize: 12,
		letterSpacing: 2,
	},
});

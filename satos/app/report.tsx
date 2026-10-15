import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AnimatedBackground from "../components/AnimatedBackground";

// Constantes
const API_URL = "http://192.168.1.107:4500/api/satos/report";

// Niveles SAT
const LEVELS = [
	{ id: 1, color: "#3b82f6", label: "MÍNIMO", desc: "Aviso informativo" },
	{ id: 2, color: "#22c55e", label: "BAJO", desc: "Sin peligro significativo" },
	{ id: 3, color: "#eab308", label: "MODERADO", desc: "Posible daño" },
	{ id: 4, color: "#f97316", label: "ALTO", desc: "Protocolos activados" },
	{ id: 5, color: "#ef4444", label: "MÁXIMO", desc: "Emergencia total" },
];

export default function ReportScreen() {
	const [step, setStep] = useState<1 | 2>(1); // 1: Niveles, 2: Cámara
	const [location, setLocation] = useState<Location.LocationObject | null>(
		null
	);
	const [permission, requestPermission] = useCameraPermissions();
	const [level, setLevel] = useState<number>(0);
	const [loading, setLoading] = useState(false);
	const [cameraRef, setCameraRef] = useState<CameraView | null>(null);

	// Obtener GPS y permisos al entrar
	useEffect(() => {
		(async () => {
			// Permisos de ubicación
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status === "granted") {
				try {
					let loc = await Location.getLastKnownPositionAsync({});
					if (!loc) {
						const timeout = new Promise<Location.LocationObject>((_, reject) =>
							setTimeout(() => reject(new Error("Timeout")), 5000)
						);
						const gps = Location.getCurrentPositionAsync({
							accuracy: Location.Accuracy.Balanced,
						});
						loc = await Promise.race([gps, timeout]).catch(() => ({
							coords: {
								latitude: 8.595245,
								longitude: -71.14444,
								altitude: 0,
								accuracy: 100,
								altitudeAccuracy: 0,
								heading: 0,
								speed: 0,
							},
							timestamp: Date.now(),
						}));
					}
					setLocation(loc);
				} catch {
					setLocation({
						coords: {
							latitude: 8.595245,
							longitude: -71.14444,
							altitude: 0,
							accuracy: 100,
							altitudeAccuracy: 0,
							heading: 0,
							speed: 0,
						},
						timestamp: Date.now(),
					});
				}
			}
			// Permisos de cámara
			await requestPermission();
		})();
	}, []);

	// Seleccionar nivel y abrir cámara
	const selectLevel = (selectedLevel: number) => {
		setLevel(selectedLevel);
		setStep(2);
	};

	// Tomar foto y enviar automáticamente
	const takePictureAndSubmit = async () => {
		if (!cameraRef || !location) return;
		setLoading(true);

		try {
			const photo = await cameraRef.takePictureAsync({
				quality: 0.5,
				base64: false,
			});
			if (!photo?.uri) throw new Error("No se pudo capturar la foto");

			const formData = new FormData();
			const filename = photo.uri.split("/").pop();
			const match = /\.(\w+)$/.exec(filename || "");
			const type = match ? `image/${match[1]}` : `image`;

			// @ts-ignore
			formData.append("photo", { uri: photo.uri, name: filename, type });
			formData.append("gridLatitude", location.coords.latitude.toString());
			formData.append("gridLongitude", location.coords.longitude.toString());
			formData.append("level", level.toString());
			formData.append("emergency", level >= 4 ? "true" : "false");
			formData.append("comment", "Reporte desde Satos App");

			const response = await fetch(API_URL, {
				method: "POST",
				headers: { "Content-Type": "multipart/form-data" },
				body: formData,
			});

			if (response.ok) {
				Alert.alert("✓ Enviado", "Las autoridades han sido notificadas.", [
					{ text: "OK", onPress: () => router.replace("/") },
				]);
			} else {
				throw new Error("Error del servidor");
			}
		} catch (error) {
			console.error(error);
			Alert.alert("Error", "No se pudo enviar. Verifique su conexión.");
			setStep(1);
		} finally {
			setLoading(false);
		}
	};

	// Pantalla de carga
	if (loading) {
		return (
			<View style={styles.container}>
				<View style={styles.loadingBox}>
					<ActivityIndicator size="large" color="#00f0ff" />
					<Text style={styles.loadingText}>TRANSMITIENDO...</Text>
				</View>
			</View>
		);
	}

	// Esperando permisos
	if (!permission?.granted) {
		return (
			<View style={styles.container}>
				<Text style={styles.permissionText}>Solicitando permisos...</Text>
			</View>
		);
	}

	return (
		<SafeAreaView
			style={styles.container}
			edges={["top", "left", "right", "bottom"]}
		>
			<Stack.Screen options={{ headerShown: false }} />
			<AnimatedBackground />

			{/* Botón Volver */}
			<View style={styles.backButtonContainer}>
				<TouchableOpacity
					style={styles.backButton}
					onPress={() => router.back()}
				>
					<Ionicons name="arrow-back" size={28} color="#f97316" />
				</TouchableOpacity>
			</View>

			{/* PASO 1: Selección de Nivel */}
			{step === 1 && (
				<View style={styles.levelsContainer}>
					{LEVELS.map((item) => (
						<TouchableOpacity
							key={item.id}
							style={[
								styles.levelButton,
								{ borderColor: item.color, shadowColor: item.color },
							]}
							onPress={() => selectLevel(item.id)}
							activeOpacity={0.7}
						>
							<View
								style={[styles.levelIndicator, { backgroundColor: item.color }]}
							/>
							<View style={styles.levelTextContainer}>
								<Text style={[styles.levelLabel, { color: item.color }]}>
									{item.label}
								</Text>
								<Text style={styles.levelDesc}>{item.desc}</Text>
							</View>
						</TouchableOpacity>
					))}
				</View>
			)}

			{/* PASO 2: Cámara */}
			{step === 2 && (
				<View style={styles.cameraContainer}>
					<CameraView
						style={styles.camera}
						facing="back"
						ref={(ref) => setCameraRef(ref)}
					>
						<View style={styles.cameraOverlay}>
							<Text style={styles.cameraInstruction}>CAPTURA LA EVIDENCIA</Text>
							<TouchableOpacity
								style={styles.captureButton}
								onPress={takePictureAndSubmit}
							>
								<View style={styles.captureInner} />
							</TouchableOpacity>
						</View>
					</CameraView>
				</View>
			)}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#0a0a0f",
	},
	backButtonContainer: {
		position: "absolute",
		top: 15,
		left: 0,
		zIndex: 10,
		paddingTop: 20,
		paddingLeft: 20,
	},
	backButton: {
		padding: 12,
		backgroundColor: "rgba(249, 115, 22, 0.1)",
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "rgba(249, 115, 22, 0.3)",
	},
	// Loading
	loadingBox: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	loadingText: {
		color: "#f97316",
		fontSize: 18,
		fontWeight: "bold",
		marginTop: 20,
		letterSpacing: 3,
	},
	permissionText: {
		color: "#666",
		fontSize: 16,
		textAlign: "center",
		marginTop: 100,
	},
	// Niveles
	levelsContainer: {
		flex: 1,
		paddingHorizontal: 20,
		paddingTop: 80,
		paddingBottom: 30,
		justifyContent: "space-between",
	},
	title: {
		color: "#00f0ff",
		fontSize: 22,
		fontWeight: "bold",
		textAlign: "center",
		letterSpacing: 4,
		marginBottom: 20,
		textShadowColor: "#00f0ff",
		textShadowOffset: { width: 0, height: 0 },
		textShadowRadius: 10,
	},
	levelButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#111118",
		paddingVertical: 20,
		paddingHorizontal: 20,
		borderRadius: 12,
		borderWidth: 2,
		elevation: 8,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.5,
		shadowRadius: 8,
	},
	levelIndicator: {
		width: 20,
		height: 20,
		borderRadius: 10,
		marginRight: 20,
	},
	levelTextContainer: {
		flex: 1,
		alignItems: "center",
	},
	levelLabel: {
		fontSize: 22,
		fontWeight: "bold",
		letterSpacing: 2,
		textAlign: "center",
	},
	levelDesc: {
		color: "#888",
		fontSize: 14,
		marginTop: 4,
		textAlign: "center",
	},
	// Cámara
	cameraContainer: {
		flex: 1,
	},
	camera: {
		flex: 1,
	},
	cameraOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.3)",
		justifyContent: "flex-end",
		alignItems: "center",
		paddingBottom: 60,
	},
	cameraInstruction: {
		color: "#f97316",
		fontSize: 16,
		fontWeight: "bold",
		letterSpacing: 2,
		marginBottom: 30,
		textShadowColor: "#f97316",
		textShadowOffset: { width: 0, height: 0 },
		textShadowRadius: 10,
	},
	captureButton: {
		width: 90,
		height: 90,
		borderRadius: 45,
		backgroundColor: "rgba(249, 115, 22, 0.2)",
		borderWidth: 4,
		borderColor: "#f97316",
		justifyContent: "center",
		alignItems: "center",
	},
	captureInner: {
		width: 70,
		height: 70,
		borderRadius: 35,
		backgroundColor: "#f97316",
	},
});

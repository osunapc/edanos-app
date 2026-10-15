import React, { useState } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	Alert,
	Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../src/context/AuthContext";

export default function LoginScreen() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const { login } = useAuth();

	const handleLogin = async () => {
		if (!email || !password) {
			Alert.alert(
				"ACCESO DENEGADO",
				"Identificación incompleta. Ingrese credenciales."
			);
			return;
		}

		setLoading(true);
		try {
			await login(email, password);
		} catch (error: any) {
			Alert.alert(
				"ERROR DE SISTEMA",
				error.message || "Credenciales inválidas"
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={styles.keyboardView}
			>
				<View style={styles.gridBackground}>
					{/* Decorative graphic elements */}
					<View style={styles.cyberCircle} />
					<View style={styles.cyberLine} />
				</View>

				<View style={styles.content}>
					<View style={styles.headerContainer}>
						<View style={styles.logoContainer}>
							<Text style={styles.logoText}>HERO</Text>
							<Text style={styles.logoVersion}>V.1.0.0</Text>
						</View>
						<Text style={styles.subtitle}>SISTEMA DE RESPUESTA TACTICA</Text>
						<View style={styles.divider}>
							<View style={styles.dividerLine} />
							<Text style={styles.dividerText}>PC MERIDA</Text>
							<View style={styles.dividerLine} />
						</View>
					</View>

					<View style={styles.form}>
						<View style={styles.inputContainer}>
							<Text style={styles.inputLabel}>IDENTIFICADOR (EMAIL)</Text>
							<TextInput
								style={styles.input}
								placeholder="AGENTE@PCMERIDA.GOB"
								placeholderTextColor="#475569"
								value={email}
								onChangeText={setEmail}
								autoCapitalize="none"
								keyboardType="email-address"
							/>
							<View style={styles.cornerTopLeft} />
							<View style={styles.cornerBottomRight} />
						</View>

						<View style={styles.inputContainer}>
							<Text style={styles.inputLabel}>CODIGO DE ACCESO</Text>
							<TextInput
								style={styles.input}
								placeholder="••••••••"
								placeholderTextColor="#475569"
								value={password}
								onChangeText={setPassword}
								secureTextEntry
							/>
							<View style={styles.cornerTopLeft} />
							<View style={styles.cornerBottomRight} />
						</View>

						<TouchableOpacity
							style={[styles.button, loading && styles.buttonDisabled]}
							onPress={handleLogin}
							disabled={loading}
							activeOpacity={0.8}
						>
							{loading ? (
								<ActivityIndicator color="#050510" size="small" />
							) : (
								<Text style={styles.buttonText}>INICIAR ENLACE</Text>
							)}
							<View style={styles.scanLine} />
						</TouchableOpacity>
					</View>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#050510", // Deep cyberpunk dark
	},
	keyboardView: {
		flex: 1,
		position: "relative",
	},
	gridBackground: {
		...StyleSheet.absoluteFillObject,
		opacity: 0.15,
		zIndex: -1,
	},
	cyberCircle: {
		position: "absolute",
		top: -80,
		right: -80,
		width: 300,
		height: 300,
		borderRadius: 150,
		borderWidth: 2,
		borderColor: "#ff6600",
		opacity: 0.3,
		shadowColor: "#ff6600",
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.5,
		shadowRadius: 20,
	},
	cyberLine: {
		position: "absolute",
		bottom: 100,
		left: 0,
		width: "100%",
		height: 4,
		backgroundColor: "#ff6600",
		opacity: 0.1,
		shadowColor: "#ff6600",
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.8,
		shadowRadius: 10,
	},
	content: {
		flex: 1,
		padding: 30,
		justifyContent: "center",
		zIndex: 1,
	},
	headerContainer: {
		marginBottom: 50,
		alignItems: "center",
	},
	logoContainer: {
		alignItems: "center",
		marginBottom: 10,
	},
	logoText: {
		fontSize: 56,
		fontWeight: "900",
		color: "#ff6600",
		letterSpacing: 2,
		textShadowColor: "rgba(255, 102, 0, 0.8)",
		textShadowOffset: { width: 0, height: 0 },
		textShadowRadius: 25,
		fontVariant: ["tabular-nums"],
	},
	logoVersion: {
		fontSize: 12,
		color: "#ff6600",
		marginTop: 5,
		fontWeight: "bold",
		opacity: 0.8,
		textShadowColor: "rgba(255, 102, 0, 0.5)",
		textShadowRadius: 10,
	},
	subtitle: {
		fontSize: 14,
		color: "#cbd5e1",
		letterSpacing: 3,
		marginBottom: 20,
		fontWeight: "600",
		textAlign: "center",
	},
	divider: {
		flexDirection: "row",
		alignItems: "center",
		width: "80%",
	},
	dividerLine: {
		flex: 1,
		height: 1,
		backgroundColor: "rgba(255, 255, 255, 0.2)",
	},
	dividerText: {
		marginHorizontal: 15,
		color: "#64748b",
		fontSize: 10,
		fontWeight: "bold",
	},
	form: {
		width: "100%",
	},
	inputContainer: {
		marginBottom: 24,
		position: "relative",
	},
	inputLabel: {
		color: "#ff6600",
		fontSize: 12,
		fontWeight: "bold",
		marginBottom: 8,
		letterSpacing: 1,
		marginLeft: 10,
		textShadowColor: "rgba(255, 102, 0, 0.3)",
		textShadowRadius: 5,
	},
	input: {
		backgroundColor: "rgba(30, 41, 59, 0.6)",
		color: "#fff",
		padding: 18,
		paddingHorizontal: 24,
		borderRadius: 24,
		fontSize: 16,
		borderWidth: 1.5,
		borderColor: "rgba(51, 65, 85, 0.5)",
		fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 8,
		elevation: 4,
	},
	cornerTopLeft: {
		display: "none", // Removed for rounded style
	},
	cornerBottomRight: {
		display: "none", // Removed for rounded style
	},
	button: {
		backgroundColor: "#ff6600",
		padding: 20,
		borderRadius: 30, // Fully rounded pill shape
		alignItems: "center",
		marginTop: 30,
		shadowColor: "#ff6600",
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.6,
		shadowRadius: 20,
		elevation: 15,
		position: "relative",
		overflow: "hidden",
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.2)",
	},
	buttonDisabled: {
		backgroundColor: "#522204",
		opacity: 0.6,
		shadowOpacity: 0.1,
	},
	buttonText: {
		color: "#fff", // White text for better contrast on orange
		fontSize: 18,
		fontWeight: "800",
		letterSpacing: 2,
		textTransform: "uppercase",
		textShadowColor: "rgba(0, 0, 0, 0.2)",
		textShadowRadius: 2,
	},
	scanLine: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		height: 2,
		backgroundColor: "rgba(255,255,255,0.4)",
		opacity: 0.5,
	},
});

import React, { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
	Switch,
	Alert,
	StatusBar as RNStatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../src/context/AuthContext";
import { useSocketConnection } from "../src/hooks/useSocketConnection";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
	const { user, logout } = useAuth();
	const { connected, toggleGuardia } = useSocketConnection();
	const [isDeGuardia, setIsDeGuardia] = useState(false);

	const handleToggleGuardia = (value: boolean) => {
		setIsDeGuardia(value);
		toggleGuardia(value);

		if (value) {
			Alert.alert(
				"SISTEMA ACTIVO",
				"Protocolo de guardia iniciado. Monitoreando canales de emergencia."
			);
		}
	};

	return (
		<SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
			<RNStatusBar barStyle="light-content" backgroundColor="#050510" />

			{/* Grid Background */}
			<View style={styles.gridBackground}>
				<View style={styles.cyberLine} />
			</View>

			{/* Status Bar / Header */}
			<View style={styles.header}>
				<View style={styles.userInfo}>
					<View style={styles.badgeContainer}>
						<Text style={styles.badgeText}>CMD</Text>
					</View>
					<View>
						<Text style={styles.userName}>{user?.nombre?.toUpperCase()}</Text>
						<Text style={styles.userRole}>OPERADOR PC: NIVEL 1</Text>
					</View>
				</View>
				<View style={styles.statusContainer}>
					<Text
						style={[
							styles.statusText,
							connected ? styles.textOnline : styles.textOffline,
						]}
					>
						{connected ? "EN LINEA" : "OFFLINE"}
					</Text>
					<View
						style={[
							styles.statusDot,
							connected ? styles.online : styles.offline,
						]}
					/>
				</View>
			</View>

			<ScrollView contentContainerStyle={styles.content}>
				{/* System Status / Guardia Toggle */}
				<View style={styles.panel}>
					<View style={styles.panelCornerTopLeft} />
					<View style={styles.panelCornerBottomRight} />

					<View style={styles.panelHeader}>
						<Ionicons
							name="shield-checkmark-outline"
							size={24}
							color="#ff6600"
						/>
						<Text style={styles.panelTitle}>ESTADO DEL SISTEMA</Text>
					</View>

					<View style={styles.panelContent}>
						<View>
							<Text style={styles.panelLabel}>MODO GUARDIA</Text>
							<Text
								style={[
									styles.panelValue,
									isDeGuardia ? styles.activeText : styles.inactiveText,
								]}
							>
								{isDeGuardia ? "ACTIVO // MONITOREANDO" : "INACTIVO // STANDBY"}
							</Text>
						</View>
						<Switch
							trackColor={{ false: "#1e293b", true: "#ff6600" }}
							thumbColor={isDeGuardia ? "#fff" : "#94a3b8"}
							ios_backgroundColor="#1e293b"
							onValueChange={handleToggleGuardia}
							value={isDeGuardia}
						/>
					</View>
				</View>

				{/* Alertas Feed */}
				<View style={styles.sectionHeader}>
					<Text style={styles.sectionTitle}>CANAL DE ALERTAS CRITICAS</Text>
					<View style={styles.sectionLine} />
				</View>

				<View style={styles.emptyState}>
					<View style={styles.radarCircle}>
						<Ionicons
							name="radio-outline"
							size={80}
							color="rgba(255, 102, 0, 0.3)"
						/>
						<View style={styles.scannerLine} />
					</View>
					<Text style={styles.emptyStateTitle}>SIN AMENAZAS ACTIVAS</Text>
					<Text style={styles.emptyStateText}>
						Escaneando red SATOS... Mantenga la posición.
					</Text>
				</View>
			</ScrollView>

			{/* Bottom Action Bar */}
			<View style={styles.bottomBar}>
				<TouchableOpacity
					style={styles.logoutButton}
					onPress={logout}
					activeOpacity={0.8}
				>
					<View style={styles.logoutBorder} />
					<Ionicons name="power-outline" size={20} color="#ef4444" />
					<Text style={styles.logoutText}>DESCONECTAR SISTEMA</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#050510", // Cyberpunk Dark
	},
	gridBackground: {
		...StyleSheet.absoluteFillObject,
		opacity: 0.1,
		zIndex: -1,
	},
	cyberLine: {
		position: "absolute",
		top: 100,
		left: 0,
		right: 0,
		height: 2,
		backgroundColor: "#ff6600",
		opacity: 0.2,
		shadowColor: "#ff6600",
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.8,
		shadowRadius: 10,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 24,
		paddingVertical: 20,
		backgroundColor: "rgba(5, 5, 16, 0.9)",
		borderBottomWidth: 1,
		borderBottomColor: "rgba(51, 65, 85, 0.3)",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		zIndex: 10,
	},
	userInfo: {
		flexDirection: "row",
		alignItems: "center",
	},
	badgeContainer: {
		backgroundColor: "rgba(255, 102, 0, 0.15)",
		paddingHorizontal: 10,
		paddingVertical: 4,
		marginRight: 12,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "rgba(255, 102, 0, 0.3)",
	},
	badgeText: {
		color: "#ff6600",
		fontSize: 10,
		fontWeight: "900",
		letterSpacing: 1,
	},
	userName: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "800",
		letterSpacing: 0.5,
	},
	userRole: {
		color: "#94a3b8",
		fontSize: 10,
		fontWeight: "700",
		marginTop: 2,
	},
	statusContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "rgba(30, 41, 59, 0.5)",
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: "rgba(51, 65, 85, 0.5)",
	},
	statusText: {
		fontSize: 10,
		fontWeight: "800",
		marginRight: 8,
		letterSpacing: 0.5,
	},
	textOnline: {
		color: "#22c55e",
	},
	textOffline: {
		color: "#ef4444",
	},
	statusDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
	},
	online: {
		backgroundColor: "#22c55e",
		shadowColor: "#22c55e",
		shadowRadius: 8,
		shadowOpacity: 1,
		elevation: 10,
	},
	offline: {
		backgroundColor: "#ef4444",
		shadowColor: "#ef4444",
		shadowRadius: 5,
		elevation: 5,
	},
	content: {
		padding: 24,
	},
	panel: {
		backgroundColor: "rgba(30, 41, 59, 0.4)",
		borderRadius: 24,
		padding: 24,
		marginBottom: 32,
		position: "relative",
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.05)",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 10,
	},
	panelCornerTopLeft: {
		display: "none",
	},
	panelCornerBottomRight: {
		display: "none",
	},
	panelHeader: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 20,
	},
	panelTitle: {
		color: "#fff",
		fontSize: 15,
		fontWeight: "800",
		marginLeft: 12,
		letterSpacing: 1,
	},
	panelContent: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: "rgba(15, 23, 42, 0.6)",
		padding: 16,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: "rgba(51, 65, 85, 0.3)",
	},
	panelLabel: {
		color: "#94a3b8",
		fontSize: 10,
		fontWeight: "bold",
		marginBottom: 4,
		letterSpacing: 0.5,
	},
	panelValue: {
		fontSize: 14,
		fontWeight: "800",
		letterSpacing: 0.5,
	},
	activeText: {
		color: "#ff6600",
		textShadowColor: "rgba(255, 102, 0, 0.6)",
		textShadowRadius: 15,
	},
	inactiveText: {
		color: "#64748b",
	},
	sectionHeader: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 24,
		paddingHorizontal: 8,
	},
	sectionTitle: {
		color: "#cbd5e1",
		fontSize: 13,
		fontWeight: "800",
		letterSpacing: 1,
		marginRight: 12,
	},
	sectionLine: {
		flex: 1,
		height: 2,
		backgroundColor: "#334155",
		borderRadius: 1,
	},
	emptyState: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 50,
		backgroundColor: "rgba(30, 41, 59, 0.2)",
		borderRadius: 24,
		borderWidth: 1,
		borderColor: "rgba(51, 65, 85, 0.3)",
	},
	radarCircle: {
		marginBottom: 24,
		position: "relative",
		shadowColor: "#ff6600",
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.4,
		shadowRadius: 20,
	},
	scannerLine: {
		position: "absolute",
		top: 0,
		left: 40,
		width: 3,
		height: 80,
		backgroundColor: "#ff6600",
		opacity: 0.6,
		borderRadius: 1.5,
		transform: [{ rotate: "45deg" }],
		shadowColor: "#ff6600",
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.8,
		shadowRadius: 5,
	},
	emptyStateTitle: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "800",
		marginBottom: 8,
		letterSpacing: 0.5,
	},
	emptyStateText: {
		color: "#94a3b8",
		fontSize: 14,
		fontWeight: "500",
	},
	bottomBar: {
		padding: 24,
		paddingBottom: 10,
	},
	logoutButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 18,
		backgroundColor: "rgba(239, 68, 68, 0.15)",
		borderRadius: 24,
		borderWidth: 1,
		borderColor: "rgba(239, 68, 68, 0.3)",
		shadowColor: "#ef4444",
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.2,
		shadowRadius: 10,
	},
	logoutText: {
		color: "#ef4444",
		fontSize: 14,
		fontWeight: "800",
		marginLeft: 10,
		letterSpacing: 1,
	},
	logoutBorder: {
		display: "none",
	},
});

import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Configurar para que las notificaciones se muestren incluso con app en foreground
Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: true,
		priority: Notifications.AndroidNotificationPriority.MAX,
	}),
});

export const NotificationService = {
	async registerForPushNotificationsAsync() {
		let token;

		const { status: existingStatus } =
			await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;

		if (existingStatus !== "granted") {
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		}

		if (finalStatus !== "granted") {
			return;
		}

		if (Platform.OS === "android") {
			Notifications.setNotificationChannelAsync("emergency-alerts", {
				name: "Alertas de Emergencia",
				importance: Notifications.AndroidImportance.MAX,
				vibrationPattern: [0, 250, 250, 250],
				lightColor: "#FF231F7C",
			});
		}

		return token;
	},

	async showCriticalAlert(reporte: any) {
		await Notifications.scheduleNotificationAsync({
			content: {
				title: "🚨 ALERTA CRÍTICA SATOS",
				body: `Nivel ${reporte.level} - ${reporte.comment || "Sin comentario"}`,
				data: { reporteId: reporte.id, lat: reporte.lat, lng: reporte.lng },
				priority: Notifications.AndroidNotificationPriority.MAX,
				vibrate: [0, 250, 250, 250],
			},
			trigger: null, // Inmediato
		});
	},
};

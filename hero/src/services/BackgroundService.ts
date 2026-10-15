import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CONFIG } from "../constants/Config";
import { NotificationService } from "./NotificationService";

const BACKGROUND_SOCKET_TASK = "background-socket-task";

// Definir la tarea de fondo
TaskManager.defineTask(BACKGROUND_SOCKET_TASK, async () => {
	try {
		const token = await AsyncStorage.getItem(CONFIG.TOKEN_KEY);
		const userStr = await AsyncStorage.getItem(CONFIG.USER_KEY);

		if (!token || !userStr) return BackgroundFetch.BackgroundFetchResult.NoData;

		const user = JSON.parse(userStr);
		if (!user.activo) return BackgroundFetch.BackgroundFetchResult.NoData;

		// Intentar mantener conexión si es necesario
		// Nota: Esto es un placeholder conceptual, el socket real vive en el hook
		// Pero aquí podríamos disparar un "ping" al servidor o verificar alertas pendientes

		return BackgroundFetch.BackgroundFetchResult.NewData;
	} catch (error) {
		return BackgroundFetch.BackgroundFetchResult.Failed;
	}
});

export const BackgroundService = {
	async registerTask() {
		try {
			await BackgroundFetch.registerTaskAsync(BACKGROUND_SOCKET_TASK, {
				minimumInterval: 60 * 1, // 1 minuto
				stopOnTerminate: false,
				startOnBoot: true,
			});
			console.log("Background task registered");
		} catch (err) {
			console.log("Background task registration failed:", err);
		}
	},

	async unregisterTask() {
		try {
			await BackgroundFetch.unregisterTaskAsync(BACKGROUND_SOCKET_TASK);
		} catch (err) {
			console.log("Background task unregistration failed:", err);
		}
	},
};

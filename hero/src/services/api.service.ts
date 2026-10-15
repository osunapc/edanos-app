import AsyncStorage from "@react-native-async-storage/async-storage";
import { CONFIG } from "../constants/Config";

export const apiService = {
	async get(endpoint: string, authenticated = true) {
		return this.request(endpoint, "GET", null, authenticated);
	},

	async post(endpoint: string, body: any, authenticated = true) {
		return this.request(endpoint, "POST", body, authenticated);
	},

	async put(endpoint: string, body: any, authenticated = true) {
		return this.request(endpoint, "PUT", body, authenticated);
	},

	async request(
		endpoint: string,
		method: string,
		body: any,
		authenticated = true
	) {
		const url = `${CONFIG.API_URL}${endpoint}`;
		const headers: any = {
			"Content-Type": "application/json",
		};

		if (authenticated) {
			const token = await AsyncStorage.getItem(CONFIG.TOKEN_KEY);
			if (token) {
				headers["Authorization"] = `Bearer ${token}`;
			}
		}

		const options: any = {
			method,
			headers,
		};

		if (body) {
			options.body = JSON.stringify(body);
		}

		try {
			const response = await fetch(url, options);
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Error en la petición");
			}

			return data;
		} catch (error) {
			console.error(`API Error [${method}] ${endpoint}:`, error);
			throw error;
		}
	},
};

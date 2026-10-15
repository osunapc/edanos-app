import { API_URL } from "../conf/constnts";
import { getStoredToken } from "../api/auth";

const authHeaders = () => ({
	"Content-Type": "application/json",
	...(getStoredToken() ? { Authorization: `Bearer ${getStoredToken()}` } : {}),
});

export interface SatosReport {
	id: number;
	lat: number;
	lng: number;
	level: number;
	comment?: string;
	emergency: boolean;
	photoUrl: string;
	isClosed: boolean;
	validated: boolean;
	createdAt: string;
}

export const SatosService = {
	// Obtener reportes con filtros (paginación, si está cerrado o es emergencia)
	getReports: async (params?: {
		page?: number;
		limit?: number;
		isClosed?: boolean;
		emergency?: boolean;
	}) => {
		try {
			const url = new URL(`${API_URL}/api/satos/reports`);
			if (params) {
				Object.keys(params).forEach((key) => {
					const value = params[key as keyof typeof params];
					if (value !== undefined) {
						url.searchParams.append(key, String(value));
					}
				});
			}

			const response = await fetch(url.toString(), {
				method: "GET",
				headers: authHeaders(),
				credentials: "include",
			});

			if (!response.ok) {
				throw new Error(`Error HTTP: ${response.status}`);
			}

			return await response.json();
		} catch (error) {
			console.error("Error al obtener reportes:", error);
			throw error;
		}
	},

	// Cerrar un reporte (cuando ya fue atendido por los funcionarios)
	closeReport: async (id: number) => {
		try {
			const response = await fetch(`${API_URL}/api/satos/reports/${id}/close`, {
				method: "PUT",
				headers: authHeaders(),
				credentials: "include",
			});

			if (!response.ok) {
				throw new Error(`Error HTTP: ${response.status}`);
			}

			return await response.json();
		} catch (error) {
			console.error("Error al cerrar el reporte:", error);
			throw error;
		}
	},

	// Validar un reporte (confirmar que la emergencia es real)
	validateReport: async (id: number) => {
		try {
			const response = await fetch(`${API_URL}/api/satos/reports/${id}/validate`, {
				method: "PUT",
				headers: authHeaders(),
				credentials: "include",
			});

			if (!response.ok) {
				throw new Error(`Error HTTP: ${response.status}`);
			}

			return await response.json();
		} catch (error) {
			console.error("Error al validar el reporte:", error);
			throw error;
		}
	},
};

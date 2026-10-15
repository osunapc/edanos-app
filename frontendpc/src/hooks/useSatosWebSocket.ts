import { useEffect, useState } from "react";
import { socket } from "../../services/socketService";
import { SatosReport } from "../services/satos.service";

export const useSatosWebSocket = () => {
	const [reports, setReports] = useState<SatosReport[]>([]);

	useEffect(() => {
		// Escuchar cuando llega un NUEVO reporte
		const handleNewReport = (newReport: SatosReport) => {
			// console.log('🚨 Nuevo reporte recibido:', newReport);

			setReports((prev) => [newReport, ...prev]);

			// Reproducir sonido de alerta
			if (newReport.emergency || newReport.level >= 4) {
				playEmergencySound();
			} else {
				playNotificationSound();
			}
		};

		// Escuchar cuando un reporte se ACTUALIZA
		const handleReportUpdated = (updatedReport: SatosReport) => {
			setReports((prev) =>
				prev.map((r) => (r.id === updatedReport.id ? updatedReport : r))
			);
		};

		// Suscribirse a los eventos en el socket global
		socket.on("satos:new-report", handleNewReport);
		socket.on("satos:report-updated", handleReportUpdated);

		// Limpieza: Desuscribirse al desmontar (pero NO desconectar el socket global)
		return () => {
			socket.off("satos:new-report", handleNewReport);
			socket.off("satos:report-updated", handleReportUpdated);
		};
	}, []);

	// Función para reproducir sonido de emergencia fuerte
	const playEmergencySound = () => {
		const audio = new Audio("/sounds/emergency.mp3"); // El archivo debe estar en la carpeta public/sounds
		audio.play().catch((e) => console.error("Error al reproducir sonido:", e));
	};

	// Función para reproducir sonido de notificación normal
	const playNotificationSound = () => {
		const audio = new Audio("/sounds/notification.mp3");
		audio.play().catch((e) => console.error("Error al reproducir sonido:", e));
	};

	// Devolvemos la lista de reportes y la función para modificarla (si fuera necesario)
	return { reports, setReports };
};

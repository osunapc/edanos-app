import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { CONFIG } from "../constants/Config";
import { useAuth } from "../context/AuthContext";
import { NotificationService } from "../services/NotificationService";

export const useSocketConnection = () => {
	const { token, user } = useAuth();
	const [connected, setConnected] = useState(false);
	const socketRef = useRef<Socket | null>(null);

	useEffect(() => {
		if (!token) return;

		// Initialize socket
		const socket = io(CONFIG.SOCKET_URL, {
			auth: { token },
			reconnection: true,
		});

		socket.on("connect", () => {
			console.log("Socket connected");
			setConnected(true);
		});

		socket.on("disconnect", () => {
			console.log("Socket disconnected");
			setConnected(false);
		});

		socket.on("af:alerta-critica", (reporte) => {
			console.log("Alerta crítica recibida:", reporte);
			NotificationService.showCriticalAlert(reporte);
		});

		socketRef.current = socket;

		return () => {
			socket.disconnect();
			socketRef.current = null;
		};
	}, [token]);

	const toggleGuardia = async (deGuardia: boolean) => {
		if (!socketRef.current) return;

		// El backend maneja la actualización de sala basado en el estado del funcionario
		// Pero podríamos emitir un evento si fuera necesario
	};

	return { connected, socket: socketRef.current, toggleGuardia };
};

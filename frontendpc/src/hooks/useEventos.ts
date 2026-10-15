import { useState, useEffect, useCallback, useRef } from "react";
import { Evento } from "../type/type";
import { socket } from "../../services/socketService";
import { getStoredToken } from "../api/auth";
import { API_URL } from "../conf/constnts";

export function useEventos(soloActivos: boolean = true) {
	const [eventos, setEventos] = useState<Evento[]>([]);
	const [eventoActivo, setEventoActivo] = useState<Evento | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const eventoActivoRef = useRef<Evento | null>(null);

	// Keep ref in sync with state
	eventoActivoRef.current = eventoActivo;

	const fetchEventos = useCallback(async () => {
		try {
			setIsLoading(true);
			const endpoint = soloActivos ? "/api/eventos/activos" : "/api/eventos";

			const response = await fetch(`${API_URL}${endpoint}`, {
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
					...(getStoredToken() ? { Authorization: `Bearer ${getStoredToken()}` } : {}),
				},
			});

			if (!response.ok) {
				throw new Error("Error al cargar eventos");
			}

			const data = await response.json();
			setEventos(data);

			const current = eventoActivoRef.current;
			if (current && !data.find((e: Evento) => e.id === current.id)) {
				setEventoActivo(null);
			}

			if (!current && data.length > 0 && soloActivos) {
				setEventoActivo(data[0]);
			}
		} catch (err: unknown) {
			const errorMessage =
				err instanceof Error ? err.message : "Error al cargar eventos";
			setError(errorMessage);
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	}, [soloActivos]);

	useEffect(() => {
		fetchEventos();

		const handleNuevoEvento = (nuevoEvento: Evento) => {
			setEventos((prev) => [nuevoEvento, ...prev]);
		};

		const handleEventoActualizado = (eventoActualizado: Evento) => {
			setEventos((prev) =>
				prev.map((e) =>
					e.id === eventoActualizado.id ? eventoActualizado : e,
				),
			);
			if (eventoActivoRef.current?.id === eventoActualizado.id) {
				setEventoActivo(eventoActualizado);
			}
		};

		const handleEventoCerrado = (eventoCerrado: Evento) => {
			if (soloActivos) {
				setEventos((prev) => prev.filter((e) => e.id !== eventoCerrado.id));
				if (eventoActivoRef.current?.id === eventoCerrado.id) {
					setEventoActivo(null);
				}
			} else {
				setEventos((prev) =>
					prev.map((e) => (e.id === eventoCerrado.id ? eventoCerrado : e)),
				);
			}
		};

		const handleEventoEliminado = ({ id }: { id: number }) => {
			setEventos((prev) => prev.filter((e) => e.id !== id));
			if (eventoActivoRef.current?.id === id) {
				setEventoActivo(null);
			}
		};

		socket.on("server:nuevo-evento", handleNuevoEvento);
		socket.on("server:evento-actualizado", handleEventoActualizado);
		socket.on("server:evento-cerrado", handleEventoCerrado);
		socket.on("server:evento-eliminado", handleEventoEliminado);

		return () => {
			socket.off("server:nuevo-evento", handleNuevoEvento);
			socket.off("server:evento-actualizado", handleEventoActualizado);
			socket.off("server:evento-cerrado", handleEventoCerrado);
			socket.off("server:evento-eliminado", handleEventoEliminado);
		};
	}, [fetchEventos, soloActivos]);

	const crearEvento = async (data: Partial<Evento>): Promise<Evento | null> => {
		const response = await fetch(`${API_URL}/api/eventos`, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				...(getStoredToken() ? { Authorization: `Bearer ${getStoredToken()}` } : {}),
			},
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			const text = await response.text();
			try {
				const errorData = JSON.parse(text);
				throw new Error(errorData.error || "Error al crear evento");
			} catch {
				throw new Error(
					`Error al crear evento: ${response.status} ${response.statusText}`,
				);
			}
		}

		// Verificar que hay contenido antes de parsear
		const text = await response.text();
		if (!text || text.trim() === "") {
			console.warn("Backend devolvió respuesta vacía al crear evento");
			// Refrescar la lista de eventos manualmente
			await fetchEventos();
			return null;
		}

		try {
			return JSON.parse(text);
		} catch (error) {
			console.error("Error parseando respuesta:", error);
			console.error("Respuesta recibida:", text);
			// Refrescar la lista de eventos aunque haya error de parseo
			await fetchEventos();
			throw new Error("Error al procesar respuesta del servidor");
		}
	};

	const cerrarEvento = async (eventoId: number) => {
		const response = await fetch(`${API_URL}/api/eventos/${eventoId}/cerrar`, {
			method: "PUT",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				...(getStoredToken() ? { Authorization: `Bearer ${getStoredToken()}` } : {}),
			},
		});

		if (!response.ok) {
			const text = await response.text();
			try {
				const errorData = JSON.parse(text);
				throw new Error(errorData.error || "Error al cerrar evento");
			} catch {
				throw new Error(`Error al cerrar evento: ${response.status}`);
			}
		}

		const text = await response.text();
		if (!text || text.trim() === "") {
			await fetchEventos();
			return null;
		}

		try {
			return JSON.parse(text);
		} catch (error) {
			console.error("Error parseando respuesta:", error);
			await fetchEventos();
			throw new Error("Error al procesar respuesta del servidor");
		}
	};

	const eliminarEvento = async (eventoId: number) => {
		const response = await fetch(`${API_URL}/api/eventos/${eventoId}`, {
			method: "DELETE",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				...(getStoredToken() ? { Authorization: `Bearer ${getStoredToken()}` } : {}),
			},
		});

		if (!response.ok) {
			const text = await response.text();
			try {
				const errorData = JSON.parse(text);
				throw new Error(errorData.error || "Error al eliminar evento");
			} catch {
				throw new Error(`Error al eliminar evento: ${response.status}`);
			}
		}

		const text = await response.text();

		// Si es el evento activo, limpiarlo inmediatamente
		if (eventoActivo?.id === eventoId) {
			setEventoActivo(null);
		}

		if (!text || text.trim() === "") {
			await fetchEventos();
			return null;
		}

		try {
			await fetchEventos(); // Asegurar que la lista se actualice
			return JSON.parse(text);
		} catch (error) {
			console.error("Error parseando respuesta:", error);
			await fetchEventos();
			return null;
		}
	};

	return {
		eventos,
		eventoActivo,
		setEventoActivo,
		isLoading,
		error,
		crearEvento,
		cerrarEvento,
		eliminarEvento,
		refreshEventos: fetchEventos,
	};
}

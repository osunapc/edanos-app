import { useState, useEffect } from "react";
import { Evaluation } from "../type/type";
import { API_URL } from "../conf/constnts";
import { socket } from "../../services/socketService";
import { getStoredToken } from "../api/auth";

export function useEdanData(eventoId?: number) {
	const [data, setData] = useState<Evaluation[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);

				if (eventoId === undefined) {
					setData([]);
					setIsLoading(false);
					return;
				}

				const url = `${API_URL}/api/edan?eventoId=${eventoId}`;

				const response = await fetch(url, {
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
						...(getStoredToken() ? { Authorization: `Bearer ${getStoredToken()}` } : {}),
					},
				});

				if (!response.ok) {
					throw new Error(`Error fetching data: ${response.status}`);
				}

				const result = await response.json();
				setData(result);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "An unknown error occurred"
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();

		// Unirse a sala del evento para recibir actualizaciones en tiempo real
		if (eventoId) {
			socket.emit('join-evento', { eventoId });
		}

		const handleCreated = (newData: Evaluation) => {
			if (!eventoId || newData.eventoId === eventoId) {
				setData((prevData) => [newData, ...prevData]);
			}
		};
		const handleDeleted = (data: { id: number }) => {
			setData((prevData) => prevData.filter((item) => item.id !== data.id));
		};
		const handleUpdate = (updatedData: Evaluation) =>
			setData((prevData) =>
				prevData.map((item) =>
					item.id === updatedData.id ? updatedData : item
				)
			);

		socket.on("server:new-evaluation", handleCreated);
		socket.on("server:evaluation-updated", handleUpdate);
		socket.on("server:evaluation-deleted", handleDeleted);

		return () => {
			socket.off("server:evaluation-updated", handleUpdate);
			socket.off("server:new-evaluation", handleCreated);
			socket.off("server:evaluation-deleted", handleDeleted);

			// Salir de la sala del evento al cambiar o desmontar
			if (eventoId) {
				socket.emit('leave-evento', { eventoId });
			}
		};
	}, [eventoId]);

	return { data, isLoading, error, setData };
}

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SatosReport, SatosService } from "../services/satos.service";
import { useSatosWebSocket } from "../hooks/useSatosWebSocket";
import { SatosReportCard } from "../components/satos/SatosReportCard";
import { SatosMap } from "../components/satos/SatosMap";

export const SatosPage = () => {
	// 1. Hook de WebSockets:
	// Mantiene la conexión viva y nos da la lista de reportes en tiempo real
	const { reports, setReports } = useSatosWebSocket();

	// Estado local para controlar el mapa y la carga inicial
	const [mapCenter, setMapCenter] = useState<[number, number]>([
		8.59524, -71.1434,
	]); // Coordenadas por defecto de Mérida
	const [mapZoom, setMapZoom] = useState(13);
	const [loading, setLoading] = useState(true);

	// Carga inicial: Pedimos los últimos 50 reportes a la base de datos al entrar a la página
	useEffect(() => {
		const loadInitialData = async () => {
			try {
				const data = await SatosService.getReports({
					limit: 50,
					isClosed: false,
				});
				setReports(data.data); // data.data contiene el array de reportes
			} catch (error) {
				toast.error("Error cargando reportes iniciales");
			} finally {
				setLoading(false);
			}
		};
		loadInitialData();
	}, [setReports]);

	// Función para centrar el mapa cuando le damos click a "Ver Mapa" en una tarjeta
	const handleLocate = (lat: number, lng: number) => {
		setMapCenter([lat, lng]);
		setMapZoom(16); // Acercamos el zoom
	};

	// Función para cerrar una alerta (ya atendida)
	const handleClose = async (id: number) => {
		if (!confirm("¿Cerrar esta alerta? Desparecerá del mapa.")) return;
		try {
			const updated = await SatosService.closeReport(id);
			// Actualizamos la lista localmente reemplazando el reporte viejo por el nuevo (cerrado)
			setReports((prev: SatosReport[]) =>
				prev.map((r) => (r.id === id ? updated : r))
			);
			toast.success("Alerta cerrada");
		} catch (error) {
			toast.error("Error al cerrar alerta");
		}
	};

	// Función para validar una alerta (confirmar que es real)
	const handleValidate = async (id: number) => {
		try {
			const updated = await SatosService.validateReport(id);
			setReports((prev: SatosReport[]) =>
				prev.map((r) => (r.id === id ? updated : r))
			);
			toast.success("Alerta validada");
		} catch (error) {
			toast.error("Error al validar");
		}
	};

	return (
		<div className="flex h-screen bg-slate-950 text-white overflow-hidden">
			{/* Panel Lateral: Lista de Alertas */}
			<div className="w-1/3 min-w-[350px] max-w-[450px] flex flex-col border-r border-gray-800 bg-slate-900/50 backdrop-blur-sm z-10">
				<div className="p-4 border-b border-gray-800 bg-slate-900/80">
					<h1 className="text-xl font-bold flex items-center gap-2 text-orange-500">
						📡 Satos Monitor
						<span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.5)]">
							EN VIVO
						</span>
					</h1>
					<p className="text-xs text-gray-400 mt-1">
						Sistema de Alerta Temprana Comunitaria
					</p>
				</div>

				<div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
					{loading ? (
						<div className="flex flex-col items-center justify-center mt-10 text-orange-500">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current mb-2"></div>
							<p>Cargando alertas...</p>
						</div>
					) : reports.filter((r: SatosReport) => !r.isClosed).length === 0 ? (
						<div className="text-center text-gray-500 mt-20">
							<p className="text-5xl mb-4 grayscale opacity-50">🛡️</p>
							<p>Sin alertas activas</p>
						</div>
					) : (
						reports
							.filter((r: SatosReport) => !r.isClosed)
							.map((report: SatosReport) => (
								<SatosReportCard
									key={report.id}
									report={report}
									onLocate={handleLocate}
									onClose={handleClose}
									onValidate={handleValidate}
								/>
							))
					)}
				</div>
			</div>

			{/* Contenido Principal: Mapa */}
			<div className="flex-1 relative bg-slate-900">
				<SatosMap reports={reports} center={mapCenter} zoom={mapZoom} />

				{/* Cuadro flotante con contador de alertas */}
				<div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-orange-500/30 z-[1000]">
					<div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
						Alertas Activas
					</div>
					<div className="text-3xl font-black text-white text-right">
						{reports.filter((r: SatosReport) => !r.isClosed).length}
					</div>
				</div>
			</div>
		</div>
	);
};

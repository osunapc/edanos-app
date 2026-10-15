import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { SatosReport } from "../../services/satos.service";
import L from "leaflet";

// Corrección para que los iconos de Leaflet se vean bien en Vite/Webpack
// Leaflet tiene un bug conocido donde a veces pierde la referencia a las imágenes de los marcadores
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: string })
	._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl,
	iconUrl,
	shadowUrl,
});

interface Props {
	reports: SatosReport[];
	center: [number, number];
	zoom: number;
}

// Subcomponente invisible que se encarga de mover el mapa cuando cambiamos las coordenadas
const MapUpdater = ({
	center,
	zoom,
}: {
	center: [number, number];
	zoom: number;
}) => {
	const map = useMap();
	useEffect(() => {
		map.setView(center, zoom);
	}, [center, zoom, map]);
	return null;
};

export const SatosMap = ({ reports, center, zoom }: Props) => {
	return (
		<div className="h-full w-full rounded-xl overflow-hidden border border-slate-700/50 shadow-2xl relative z-0 bg-slate-900">
			<MapContainer
				center={center}
				zoom={zoom}
				style={{ height: "100%", width: "100%" }}
				scrollWheelZoom={true}
			>
				{/* Capa base del mapa (OpenStreetMap) */}
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>

				{/* Componente auxiliar para actualizar la vista */}
				<MapUpdater center={center} zoom={zoom} />

				{/* Dibujamos un marcador por cada reporte activo */}
				{reports.map(
					(report) =>
						!report.isClosed && (
							<Marker key={report.id} position={[report.lat, report.lng]}>
								<Popup>
									<div className="min-w-[200px]">
										<h3 className="font-bold text-sm mb-1">
											Alerta Nivel {report.level} {report.emergency && "🚨"}
										</h3>
										<p className="text-xs text-gray-600 mb-2">
											{new Date(report.createdAt).toLocaleString()}
										</p>
										{report.photoUrl && (
											<img
												src={report.photoUrl}
												className="w-full h-24 object-cover rounded mb-2"
												alt="Evidencia"
											/>
										)}
										<p className="text-sm italic">"{report.comment}"</p>
									</div>
								</Popup>
							</Marker>
						),
				)}
			</MapContainer>
		</div>
	);
};

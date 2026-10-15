import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Evaluation } from "../type/type";
import { Button } from "./uiredix/button";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Icono personalizado para un marcador más visible y dramático
const redIcon = new L.Icon({
	iconUrl:
		"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
	shadowUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41],
});

interface MapaEdanProps {
	isOpen: boolean;
	onClose: () => void;
	evaluations: Evaluation[];
}

export const MapaEdan = ({ isOpen, onClose, evaluations }: MapaEdanProps) => {
	if (!isOpen) return null;

	// Default coordinates to center the map (Mérida, Venezuela)
	const defaultPosition: [number, number] = [8.59, -71.14];

	// Filtrar evaluaciones que tengan coordenadas válidas
	const validEvaluations = evaluations.filter(
		(e) =>
			e.latitud &&
			e.longitud &&
			!isNaN(parseFloat(e.latitud)) &&
			!isNaN(parseFloat(e.longitud))
	);

	return (
		<div
			className="fixed inset-0 bg-black/80 z-50 flex flex-col justify-center items-center p-4"
			onClick={onClose}
		>
			<Button
				variant="destructive"
				onClick={onClose}
				className="absolute top-4 right-4 z-[1000] bg-orange-600 hover:bg-orange-700 text-white font-bold"
			>
				Cerrar Mapa
			</Button>
			<div
				className="w-full h-full"
				onClick={(e) => e.stopPropagation()}
			>
				<MapContainer
					center={defaultPosition}
					zoom={13}
					style={{ height: "100%", width: "100%", borderRadius: "8px" }}
				>
					<TileLayer
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					/>
					{validEvaluations.map((evaluation) => (
						<Marker
							key={evaluation.id}
							position={[
								parseFloat(evaluation.latitud!),
								parseFloat(evaluation.longitud!),
							]}
							icon={redIcon}
						>
							<Popup>
								<b>Jefe de Familia:</b> {evaluation.jefeFamilia} <br />
								<b>Cédula:</b> {evaluation.cedulaJefe} <br />
								<b>Afectación:</b> {evaluation.informacionPreliminar}
							</Popup>
						</Marker>
					))}
				</MapContainer>
			</div>
		</div>
	);
};
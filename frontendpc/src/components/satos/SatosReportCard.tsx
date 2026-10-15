import { SatosReport } from "../../services/satos.service";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Props {
	report: SatosReport;
	onClose: (id: number) => void;
	onValidate: (id: number) => void;
	onLocate: (lat: number, lng: number) => void;
}

export const SatosReportCard = ({
	report,
	onClose,
	onValidate,
	onLocate,
}: Props) => {
	const getLevelColor = (level: number) => {
		if (level === 5) return "bg-red-600";
		if (level === 4) return "bg-orange-500";
		if (level === 3) return "bg-yellow-500";
		return "bg-blue-500";
	};

	return (
		<div
			className={`border rounded-xl p-4 mb-4 transition-all hover:scale-[1.02] ${
				report.emergency
					? "bg-red-950/30 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
					: "bg-gradient-to-br from-orange-500/5 to-slate-900/50 border-orange-500/20 hover:border-orange-500/40"
			}`}
		>
			<div className="flex justify-between items-start mb-3">
				<span
					className={`px-3 py-1 rounded-full text-white text-xs font-bold shadow-sm ${getLevelColor(
						report.level
					)}`}
				>
					NIVEL {report.level}
				</span>
				<span className="text-gray-400 text-xs font-mono">
					{format(new Date(report.createdAt), "dd MMM HH:mm", { locale: es })}
				</span>
			</div>

			{report.photoUrl && (
				<div className="aspect-video w-full overflow-hidden rounded-lg mb-3 bg-slate-800 border border-slate-700 relative group">
					<img
						src={report.photoUrl}
						alt="Evidencia"
						className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer"
						onClick={() => window.open(report.photoUrl, "_blank")}
					/>
					<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors pointer-events-none" />
				</div>
			)}

			{report.comment && (
				<div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 mb-4">
					<p className="text-gray-300 text-sm italic">"{report.comment}"</p>
				</div>
			)}

			<div className="flex gap-2 mt-2">
				<button
					onClick={() => onLocate(report.lat, report.lng)}
					className="flex-1 bg-slate-800 hover:bg-slate-700 text-gray-200 py-2 rounded-lg text-sm font-medium transition-all border border-slate-700"
				>
					📍 Mapa
				</button>

				{!report.validated && (
					<button
						onClick={() => onValidate(report.id)}
						className="flex-1 bg-green-900/30 hover:bg-green-900/50 text-green-400 border border-green-800/50 py-2 rounded-lg text-sm font-medium transition-all"
					>
						✅ Validar
					</button>
				)}

				{!report.isClosed && (
					<button
						onClick={() => onClose(report.id)}
						className="flex-1 bg-blue-900/30 hover:bg-blue-900/50 text-blue-400 border border-blue-800/50 py-2 rounded-lg text-sm font-medium transition-all"
					>
						📪 Cerrar
					</button>
				)}
			</div>
		</div>
	);
};

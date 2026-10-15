import { Evento } from "../type/type";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./uiredix/select";
import { BadgeAlert, Calendar, MapPin, Hash } from "lucide-react";
import { CodigoEvento } from "./CodigoEvento";

interface SelectorEventoProps {
	eventos: Evento[];
	eventoActivo: Evento | null;
	onEventoChange: (evento: Evento) => void;
}

export function SelectorEvento({
	eventos,
	eventoActivo,
	onEventoChange,
}: SelectorEventoProps) {
	if (eventos.length === 0) {
		return (
			<div className="w-full md:w-[500px] p-4 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-400 text-sm flex items-center gap-2">
				<BadgeAlert className="w-4 h-4" />
				No hay eventos activos en este momento
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-2 w-full md:w-[500px]">
			<label className="text-sm font-medium text-slate-300">
				Evento Activo
			</label>
			<Select
				value={eventoActivo?.id.toString() || ""}
				onValueChange={(value) => {
					const evento = eventos.find((e) => e.id === parseInt(value));
					if (evento) onEventoChange(evento);
				}}
			>
				<SelectTrigger className="w-full bg-slate-800 border-orange-500/30 text-white focus:ring-orange-500/50 h-auto py-3">
					<SelectValue placeholder="Seleccione un evento activo" />
				</SelectTrigger>
				<SelectContent className="bg-slate-800 border-orange-500/30 max-h-[400px]">
					{eventos.map((evento) => (
						<SelectItem
							key={evento.id}
							value={evento.id.toString()}
							className="text-white hover:bg-slate-700 focus:bg-slate-700 cursor-pointer py-3 border-b border-slate-700/50 last:border-0"
						>
							<div className="flex flex-col gap-1">
								<div className="flex items-center gap-2">
									<span className="font-bold text-orange-400">
										{evento.nombre}
									</span>
									<span className="inline-flex items-center gap-1 bg-slate-700 px-1.5 py-0.5 rounded text-[10px] font-mono text-orange-300">
										<Hash className="w-3 h-3" />
										{evento.codigo}
									</span>
									{evento.estadoEvento === "activo" ? (
										<span className="bg-green-600 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider text-white">
											Activo
										</span>
									) : (
										<span className="bg-red-600 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider text-white">
											Cerrado
										</span>
									)}
								</div>
								<div className="flex items-center gap-3 text-xs text-slate-400">
									<span className="flex items-center gap-1">
										<MapPin className="w-3 h-3" />
										{evento.estado}
									</span>
									<span className="flex items-center gap-1">
										<Calendar className="w-3 h-3" />
										{new Date(evento.fechaInicio).toLocaleDateString()}
									</span>
									<span className="bg-slate-700 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider">
										{evento.tipoEvento}
									</span>
								</div>
							</div>
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			{eventoActivo && (
				<div className="flex items-center gap-3 text-xs text-slate-500 px-1">
					<span>{eventoActivo.descripcion}</span>
					<CodigoEvento codigo={eventoActivo.codigo} size="sm" />
				</div>
			)}
		</div>
	);
}

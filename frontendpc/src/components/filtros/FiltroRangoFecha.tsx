import { Label } from "../uiredix/label";
import { Input } from "../uiredix/input";

interface FiltroRangoFechaProps {
	label: string;
	filterKeyInicio: string;
	valueInicio: string;
	filterKeyFin: string;
	valueFin: string;
	onFilterChange: (name: string, value: string) => void;
	className?: string;
}

export function FiltroRangoFecha({
	label,
	filterKeyInicio,
	valueInicio,
	filterKeyFin,
	valueFin,
	onFilterChange,
	className = "w-full",
}: FiltroRangoFechaProps) {
	return (
		<div className={className}>
			<Label className="text-sm font-medium text-white mb-2 block">{label}</Label>
			<div className="flex items-center gap-2">
				<Input
					id={filterKeyInicio}
					type="date"
					value={valueInicio}
					onChange={(e) => onFilterChange(filterKeyInicio, e.target.value)}
					className="bg-zinc-800 border-zinc-600 text-xs p-1.5"
				/>
				<span className="text-zinc-400">-</span>
				<Input
					id={filterKeyFin}
					type="date"
					value={valueFin}
					onChange={(e) => onFilterChange(filterKeyFin, e.target.value)}
					className="bg-zinc-800 border-zinc-600 text-xs p-1.5"
				/>
			</div>
		</div>
	);
}

import { Label } from "../uiredix/label";
import { Input } from "../uiredix/input";

interface FiltroRangoNumericoProps {
	label: string;
	filterKeyMin: string;
	valueMin: string;
	filterKeyMax: string;
	valueMax: string;
	onFilterChange: (name: string, value: string) => void;
	placeholderMin?: string;
	placeholderMax?: string;
	className?: string;
}

export function FiltroRangoNumerico({
	label,
	filterKeyMin,
	valueMin,
	filterKeyMax,
	valueMax,
	onFilterChange,
	placeholderMin = "Mín",
	placeholderMax = "Máx",
	className = "w-full",
}: FiltroRangoNumericoProps) {
	return (
		<div className={className}>
			<Label className="text-sm font-medium text-white mb-2 block">{label}</Label>
			<div className="flex items-center gap-2">
				<Input
					id={filterKeyMin}
					type="number"
					value={valueMin}
					onChange={(e) => onFilterChange(filterKeyMin, e.target.value)}
					placeholder={placeholderMin}
					className="bg-zinc-800 border-zinc-600 text-xs p-1.5"
				/>
				<span className="text-zinc-400">-</span>
				<Input
					id={filterKeyMax}
					type="number"
					value={valueMax}
					onChange={(e) => onFilterChange(filterKeyMax, e.target.value)}
					placeholder={placeholderMax}
					className="bg-zinc-800 border-zinc-600 text-xs p-1.5"
				/>
			</div>
		</div>
	);
}

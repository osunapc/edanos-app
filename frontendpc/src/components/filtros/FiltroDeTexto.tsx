import { Label } from "../uiredix/label";
import { Input } from "../uiredix/input";

interface FiltroDeTextoProps {
	label: string;
	filterKey: string;
	value: string;
	onFilterChange: (name: string, value: string) => void;
	placeholder: string;
	className?: string;
    type?: string;
}

export function FiltroDeTexto({
	label,
	filterKey,
	value,
	onFilterChange,
	placeholder,
	className = "w-full sm:w-1/2 md:w-1/4 lg:w-1/6",
    type = "text",
}: FiltroDeTextoProps) {
	return (
		<div className={className}>
			<Label htmlFor={filterKey} className="text-sm font-medium text-white">
				{label}
			</Label>
			<Input
				id={filterKey}
				type={type}
				value={value}
				onChange={(e) => onFilterChange(filterKey, e.target.value)}
				placeholder={placeholder}
				className="bg-zinc-800 border-zinc-600 text-xs p-1.5"
			/>
		</div>
	);
}

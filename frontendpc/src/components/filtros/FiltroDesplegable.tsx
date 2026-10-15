import { Label } from "../uiredix/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../uiredix/select";

interface FiltroDesplegableProps {
	label: string;
	filterKey: string;
	value: string;
	options: Set<string>;
	onFilterChange: (name: string, value: string) => void;
	placeholder: string;
	className?: string;
}

export function FiltroDesplegable({
	label,
	filterKey,
	value,
	options,
	onFilterChange,
	placeholder,
	className = "w-full sm:w-1/2 md:w-1/4 lg:w-1/6",
}: FiltroDesplegableProps) {
	return (
		<div className={className}>
			<Label htmlFor={filterKey} className="text-sm font-medium text-white">
				{label}
			</Label>
			<Select
				value={value || "Todos"}
				onValueChange={(selectedValue) =>
					onFilterChange(filterKey, selectedValue === "Todos" ? "" : selectedValue)
				}
			>
				<SelectTrigger id={filterKey} className="bg-zinc-800 border-zinc-600 text-xs p-1.5">
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent className="bg-zinc-700 text-blue-800 font-bold">
					<SelectItem value="Todos">Todos</SelectItem>
					{Array.from(options).map((option) => (
						<SelectItem key={option} value={option} className="focus:bg-orange-500 focus:text-white">
							{option}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}

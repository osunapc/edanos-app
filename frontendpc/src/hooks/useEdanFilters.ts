import { useState, useMemo } from "react";
import { Evaluation } from "../type/type";
import { personMatchesFilters } from "../utils/edanFilterUtils";

export function useEdanFilters(data: Evaluation[]) {
	const [filters, setFilters] = useState({
		// Location
		municipio: "",
		parroquia: "",
		barrioSector: "",
		// Event
		tipoEvento: "",
		// Household Head
		jefeFamilia: "",
		cedulaJefe: "",
		// Evaluation
		condicionVivienda: "",
		nombreEvaluador: "",
		// Demographics
		sexo: "",
		edadMin: "",
		edadMax: "",
		tallaC: "",
		tallaP: "",
		tallaZ: "",
		patologia: "",
		// Date Range
		fechaInicio: "",
		fechaFin: "",
	});

	const handleFilterChange = (name: string, value: string) => {
		setFilters((prev) => ({ ...prev, [name]: value }));
	};

	const resetFilters = () => {
		setFilters({
			municipio: "",
			parroquia: "",
			barrioSector: "",
			tipoEvento: "",
			jefeFamilia: "",
			cedulaJefe: "",
			condicionVivienda: "",
			nombreEvaluador: "",
			sexo: "",
			edadMin: "",
			edadMax: "",
			tallaC: "",
			tallaP: "",
			tallaZ: "",
			patologia: "",
			fechaInicio: "",
			fechaFin: "",
		});
	};

	const filteredData = useMemo(() => {
		const baseData = data;

		const hasActiveDemographicFilter =
			filters.sexo ||
			filters.tallaC ||
			filters.tallaP ||
			filters.tallaZ ||
			filters.patologia ||
			filters.edadMin ||
			filters.edadMax;

		return baseData.filter((item) => {
			// Date Range Filter
			const itemDate = new Date(item.createdAt);
			if (filters.fechaInicio && new Date(filters.fechaInicio) > itemDate)
				return false;
			if (filters.fechaFin && new Date(filters.fechaFin) < itemDate)
				return false;

			// Text & Select Filters
			const textFilters: (keyof Evaluation)[] = ["cedulaJefe"];
			const selectFilters: (keyof Evaluation)[] = [
				"municipio",
				"parroquia",
				"barrioSector",
				"tipoEvento",
				"jefeFamilia",
				"condicionVivienda",
				"nombreEvaluador",
			];

			for (const key of textFilters) {
				const filterValue = filters[key as keyof typeof filters];
				if (!filterValue) continue;
				const itemValue = item[key];
				if (
					typeof itemValue === "string" &&
					!itemValue.toLowerCase().includes(filterValue.toLowerCase())
				) {
					return false;
				}
			}

			for (const key of selectFilters) {
				const filterValue = filters[key as keyof typeof filters];
				if (!filterValue) continue;
				const itemValue = item[key as keyof Evaluation];
				if (itemValue !== filterValue) {
					return false;
				}
			}

			// If demographic filters are active, check if anyone in the household matches
			if (hasActiveDemographicFilter) {
				const jefeAsPerson = {
					sexo: item.sexoJefe,
					edad: item.edadJefe,
					tallaC: item.tallaC,
					tallaP: item.tallaP,
					tallaZ: item.tallaZ,
					patologias: item.patologiasJefe,
				};
				if (personMatchesFilters(jefeAsPerson, filters)) {
					return true;
				}

				const familyMatches = item.grupoFamiliar.some((member) =>
					personMatchesFilters(member, filters),
				);
				if (familyMatches) {
					return true;
				}

				return false; // If demo filters are active and no one matched, filter out the evaluation
			}

			return true; // If no demographic filters are active, evaluation passes
		});
	}, [data, filters]);

	return { filters, handleFilterChange, resetFilters, filteredData };
}

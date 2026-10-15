import { useMemo } from "react";
import { Evaluation } from "../type/type";
import { personMatchesFilters } from "../utils/edanFilterUtils";

export interface EdanFilters {
	municipio: string;
	parroquia: string;
	barrioSector: string;
	tipoEvento: string;
	jefeFamilia: string;
	cedulaJefe: string;
	condicionVivienda: string;
	nombreEvaluador: string;
	sexo: string;
	edadMin: string;
	edadMax: string;
	tallaC: string;
	tallaP: string;
	tallaZ: string;
	patologia: string;
	fechaInicio: string;
	fechaFin: string;
}

interface PersonData {
	sexo?: string;
	edad?: string;
	tallaC?: string;
	tallaP?: string;
	tallaZ?: string;
	patologias?: string;
}

export function useEdanChartData(
	filteredData: Evaluation[],
	filters: EdanFilters,
) {
	const { kpiData, genderData, ageData, patologiasData } = useMemo(() => {
		const matchingPeople: PersonData[] = [];
		filteredData.forEach((item) => {
			const jefeAsPerson = {
				sexo: item.sexoJefe,
				edad: item.edadJefe,
				tallaC: item.tallaC,
				tallaP: item.tallaP,
				tallaZ: item.tallaZ,
				patologias: item.patologiasJefe,
			};
			if (personMatchesFilters(jefeAsPerson, filters)) {
				matchingPeople.push(jefeAsPerson);
			}

			item.grupoFamiliar.forEach((member) => {
				if (personMatchesFilters(member, filters)) {
					matchingPeople.push(member);
				}
			});
		});

		const genderCounts: Record<string, number> = {};
		matchingPeople.forEach((p) => {
			if (p.sexo) {
				genderCounts[p.sexo] = (genderCounts[p.sexo] || 0) + 1;
			}
		});

		const ageGroups: Record<string, number> = {
			"0-12": 0,
			"13-18": 0,
			"19-30": 0,
			"31-50": 0,
			"51-65": 0,
			"65+": 0,
		};
		matchingPeople.forEach((p) => {
			if (p.edad) {
				const age = parseInt(p.edad);
				if (age <= 12) ageGroups["0-12"]++;
				else if (age <= 18) ageGroups["13-18"]++;
				else if (age <= 30) ageGroups["19-30"]++;
				else if (age <= 50) ageGroups["31-50"]++;
				else if (age <= 65) ageGroups["51-65"]++;
				else ageGroups["65+"]++;
			}
		});

		const patologiasCounts: Record<string, number> = {};
		matchingPeople.forEach((p) => {
			if (p.patologias) {
				p.patologias.split(",").forEach((path: string) => {
					const trimmed = path.trim();
					if (trimmed)
						patologiasCounts[trimmed] = (patologiasCounts[trimmed] || 0) + 1;
				});
			}
		});

		return {
			kpiData: {
				totalEvaluaciones: filteredData.length,
				totalPersonas: matchingPeople.length,
				totalMunicipios: new Set(
					filteredData.map((item) => item.municipio).filter(Boolean),
				).size,
			},
			genderData: Object.entries(genderCounts).map(([name, value]) => ({
				name,
				value,
			})),
			ageData: Object.entries(ageGroups).map(([name, value]) => ({
				name,
				value,
			})),
			patologiasData: Object.entries(patologiasCounts)
				.map(([name, value]) => ({ name, value }))
				.sort((a, b) => b.value - a.value)
				.slice(0, 10),
		};
	}, [filteredData, filters]);

	const municipioData = useMemo(() => {
		const counts: Record<string, number> = {};
		filteredData.forEach((item) => {
			if (item.municipio)
				counts[item.municipio] = (counts[item.municipio] || 0) + 1;
		});
		return Object.entries(counts).map(([name, value]) => ({ name, value }));
	}, [filteredData]);

	const eventoData = useMemo(() => {
		const counts: Record<string, number> = {};
		filteredData.forEach((item) => {
			if (item.tipoEvento)
				counts[item.tipoEvento] = (counts[item.tipoEvento] || 0) + 1;
		});
		return Object.entries(counts).map(([name, value]) => ({ name, value }));
	}, [filteredData]);

	const afectacionesData = useMemo(() => {
		const counts: Record<string, number> = {};
		filteredData.forEach((item) => {
			[
				...item.afectacionesNoEstructurales,
				...item.afectacionesEstructuralesColapso,
				...item.afectacionesParciales,
			].forEach((afectacion) => {
				if (afectacion) counts[afectacion] = (counts[afectacion] || 0) + 1;
			});
		});
		return Object.entries(counts)
			.map(([name, value]) => ({ name, value }))
			.sort((a, b) => b.value - a.value)
			.slice(0, 10);
	}, [filteredData]);

	return {
		kpiData,
		genderData,
		ageData,
		patologiasData,
		municipioData,
		eventoData,
		afectacionesData,
	};
}

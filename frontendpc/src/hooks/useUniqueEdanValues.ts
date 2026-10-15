import { useMemo } from "react";
import { Evaluation } from "../type/type";

export function useUniqueEdanValues(data: Evaluation[]) {
	const uniqueValues = useMemo(() => {
		const municipios = new Set<string>();
		const parroquias = new Set<string>();
		const tiposEvento = new Set<string>();
		const condicionesVivienda = new Set<string>();
		const jefesFamilia = new Set<string>();
		const sectores = new Set<string>();
		const evaluadores = new Set<string>();
		const sexos = new Set<string>();
		const tallasC = new Set<string>();
		const tallasP = new Set<string>();
		const tallasZ = new Set<string>();
		const patologias = new Set<string>();

		const addPatologias = (pStr: string | undefined) => {
			if (!pStr) return;
			pStr.split(",").forEach((p) => {
				const trimmed = p.trim();
				if (trimmed) patologias.add(trimmed);
			});
		};

		data.forEach((evaluation) => {
			if (evaluation.municipio) municipios.add(evaluation.municipio);
			if (evaluation.parroquia) parroquias.add(evaluation.parroquia);
			if (evaluation.tipoEvento) tiposEvento.add(evaluation.tipoEvento);
			if (evaluation.condicionVivienda)
				condicionesVivienda.add(evaluation.condicionVivienda);
			if (evaluation.jefeFamilia) jefesFamilia.add(evaluation.jefeFamilia);
			if (evaluation.barrioSector) sectores.add(evaluation.barrioSector);
			if (evaluation.nombreEvaluador)
				evaluadores.add(evaluation.nombreEvaluador);

			// Add jefe de familia data
			if (evaluation.sexoJefe) sexos.add(evaluation.sexoJefe);
			if (evaluation.tallaC) tallasC.add(evaluation.tallaC);
			if (evaluation.tallaP) tallasP.add(evaluation.tallaP);
			if (evaluation.tallaZ) tallasZ.add(evaluation.tallaZ);
			addPatologias(evaluation.patologiasJefe);

			// Add grupo familiar data
			evaluation.grupoFamiliar.forEach((member) => {
				if (member.sexo) sexos.add(member.sexo);
				if (member.tallaC) tallasC.add(member.tallaC);
				if (member.tallaP) tallasP.add(member.tallaP);
				if (member.tallaZ) tallasZ.add(member.tallaZ);
				addPatologias(member.patologias);
			});
		});

		return {
			municipios,
			parroquias,
			tiposEvento,
			condicionesVivienda,
			jefesFamilia,
			sectores,
			evaluadores,
			sexos,
			tallasC,
			tallasP,
			tallasZ,
			patologias,
		};
	}, [data]);

	return { uniqueValues };
}

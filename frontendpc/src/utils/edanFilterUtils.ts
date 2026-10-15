
import { Evaluation } from '../type/type';

export const personMatchesFilters = (person: {
	sexo?: string;
	edad?: string;
	tallaC?: string;
	tallaP?: string;
	tallaZ?: string;
	patologias?: string;
}, filters: any) => {
	if (filters.sexo && person.sexo !== filters.sexo) return false;
	if (filters.tallaC && person.tallaC !== filters.tallaC) return false;
	if (filters.tallaP && person.tallaP !== filters.tallaP) return false;
	if (filters.tallaZ && person.tallaZ !== filters.tallaZ) return false;
	if (
		filters.patologia &&
		(!person.patologias || !person.patologias.includes(filters.patologia))
	)
		return false;

	if (filters.edadMin || filters.edadMax) {
		const min = filters.edadMin ? parseInt(filters.edadMin) : 0;
		const max = filters.edadMax ? parseInt(filters.edadMax) : Infinity;
		const age = person.edad ? parseInt(person.edad) : -1;
		if (age < min || age > max) return false;
	}
	return true;
};

export const aplicarFiltros = (data: Evaluation[], filters: any): Evaluation[] => {
  return data.filter(evaluation => {
    // Filter logic for evaluation properties (if any) can go here
    // For now, let's focus on filtering the grupoFamiliar
    if (filters.grupoFamiliar) {
      const filteredGrupoFamiliar = evaluation.grupoFamiliar.filter(person =>
        personMatchesFilters(person, filters.grupoFamiliar)
      );
      return filteredGrupoFamiliar.length > 0;
    }
    return true; // If no grupoFamiliar filters, include the evaluation
  });
};

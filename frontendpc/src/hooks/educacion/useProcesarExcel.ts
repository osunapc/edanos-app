import { useState, useCallback } from "react";
import * as XLSX from "xlsx";
import { Evaluation, GrupoFamiliar } from "../../type/type"; // Importamos los tipos de datos existentes para Evaluation y GrupoFamiliar

// Mapeo inverso de las cabeceras del Excel a las claves del objeto Evaluation
const headerMapping: { [key: string]: keyof Evaluation } = {
	"ID Evaluación": "id",
	"Fecha de Creación": "createdAt",
	"Última Actualización": "updatedAt",
	"Información Preliminar": "informacionPreliminar",
	Estado: "estado",
	Municipio: "municipio",
	Parroquia: "parroquia",
	"Cuadrante de Paz": "cuadranteDePaz",
	Urbanización: "urbanizacion",
	Calle: "calle",
	Casa: "casa",
	"Sector/Barrio": "barrioSector",
	Vereda: "vereda",
	Apto: "apto",
	Avenida: "avenida",
	"Uso de la Estructura": "usoEstructura",
	"Otros Usos": "otrosUsoEstructura",
	Latitud: "latitud",
	Longitud: "longitud",
	Cota: "cota",
	Este: "este",
	Norte: "norte",
	Huso: "huso",
	"Tipo de Evento": "tipoEvento",
	"Fecha del Evento": "fechaEvento",
	"Hora del Evento": "horaEvento",
	"Apellidos Jefe de Calle": "apellidosJefe",
	"Nombres Jefe de Calle": "nombresJefe",
	"Teléfono Jefe de Calle": "telefonoJefe",
	"Nombre Jefe de Familia": "jefeFamilia",
	"Edad Jefe de Familia": "edadJefe",
	"Sexo Jefe de Familia": "sexoJefe",
	"Cédula Jefe de Familia": "cedulaJefe",
	"Talla Camisa Jefe de Familia": "tallaC",
	"Talla Pantalón Jefe de Familia": "tallaP",
	"Talla Zapatos Jefe de Familia": "tallaZ",
	"Teléfono Jefe de Familia": "telefonoJefeFamilia",
	"Patologías Jefe de Familia": "patologiasJefe",
	"Condición Vivienda": "condicionVivienda",
	"Otra Condición Vivienda": "otrosCondicionVivienda",
	"Vías de Acceso": "viasAcceso",
	"Otras Vías de Acceso": "otrosViasAcceso",
	"Condición de Acceso": "condicionAcceso",
	"Otra Condición de Acceso": "otrosCondicionAcceso",
	"Vivienda Solidaria": "viviendaSolidaria",
	Albergue: "albergue",
	"Teléfono Contacto Albergue": "telefonoContactoAlbergue",
	"Dirección Albergue": "direccionAlbergue",
	"Nombre Responsable Albergue": "nombreResponsableAlbergue",
	"Cédula Responsable Albergue": "cedulaResponsableAlbergue",
	"Materiales de Construcción": "materialesConstruccion",
	"Otros Materiales": "otrosMaterialesConstruccion",
	"Afectaciones Estructurales (Colapso)": "afectacionesEstructuralesColapso",
	"Otras Afectaciones (Colapso)": "otrosEstructuralesColapso",
	"Afectaciones Parciales": "afectacionesParciales",
	"Otras Afectaciones Parciales": "otrosAfectacionesParciales",
	"Afectaciones No Estructurales": "afectacionesNoEstructurales",
	"Otras Afectaciones No Estructurales": "otrosNoEstructurales",
	"Pérdidas de Enseres": "perdidasEnseres",
	"Otras Pérdidas de Enseres": "otrosPerdidasEnseres",
	"Líneas Vitales Afectadas": "lineasVitalesAfectadas",
	"Otras Líneas Vitales Afectadas": "otrosLineasVitalesAfectadas",
	"Necesidades Inmediatas": "necesidadesInmediatas",
	Observaciones: "observaciones",
	"Nombre Evaluado": "nombreEvaluado",
	"Cédula Evaluado": "cedulaEvaluado",
	"Teléfono Evaluado": "telefonoEvaluado",
	"Nombre Evaluador": "nombreEvaluador",
	"Cédula Evaluador": "cedulaEvaluador",
	"Teléfono Evaluador": "telefonoEvaluador",
};

// Mapeo para la hoja del grupo familiar
const grupoFamiliarHeaderMapping: { [key: string]: keyof GrupoFamiliar } = {
	"ID Evaluación": "evaluacionId", // Clave para vincular
	"Apellidos y Nombres": "apellidosNombres",
	Cédula: "cedula",
	Sexo: "sexo", // Asumiendo que la propiedad es 'sexo'
	Parentesco: "parentesco",
	"Talla Camisa": "tallaC",
	"Talla Pantalón": "tallaP",
	"Talla Zapatos": "tallaZ",
	Edad: "edad",
	Patologías: "patologias", // Asumiendo que la propiedad es 'patologias'
};

// Campos que en el Excel son strings separados por comas pero en el objeto son arrays
const arrayFields: (keyof Evaluation)[] = [
	"viasAcceso",
	"materialesConstruccion",
	"afectacionesEstructuralesColapso",
	"afectacionesParciales",
	"afectacionesNoEstructurales",
	"perdidasEnseres",
	"lineasVitalesAfectadas",
	"necesidadesInmediatas",
];

const booleanFields: (keyof Evaluation)[] = ["viviendaSolidaria", "albergue"];

export const useProcesarExcel = () => {
	const [datos, setDatos] = useState<Evaluation[]>([]);
	const [cargando, setCargando] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const procesarArchivo = useCallback((file: File) => {
		setCargando(true);
		setError(null);
		setDatos([]);

		const reader = new FileReader();
		reader.onload = (e: ProgressEvent<FileReader>) => {
			try {
				const data = e.target?.result;
				const workbook = XLSX.read(data, { type: "binary" });

				// --- LEER AMBAS HOJAS ---
				const evaluacionesSheetName = workbook.SheetNames[0];
				const grupoFamiliarSheetName = workbook.SheetNames[1];

				const evaluacionesWorksheet = workbook.Sheets[evaluacionesSheetName];
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const evaluacionesJson: Record<string, any>[] =
					XLSX.utils.sheet_to_json(evaluacionesWorksheet);

				// Procesar Grupo Familiar
				const grupoFamiliarMap = new Map<number, GrupoFamiliar[]>();
				if (grupoFamiliarSheetName) {
					const grupoFamiliarWorksheet =
						workbook.Sheets[grupoFamiliarSheetName];
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const grupoFamiliarJson: Record<string, any>[] =
						XLSX.utils.sheet_to_json(grupoFamiliarWorksheet);

					grupoFamiliarJson.forEach((miembroRow) => {
						const miembro: Partial<GrupoFamiliar> = {};
						for (const key in miembroRow) {
							if (grupoFamiliarHeaderMapping[key]) {
								const newKey = grupoFamiliarHeaderMapping[key];
								const miembroAsRecord = miembro as Record<string, unknown>;
								miembroAsRecord[newKey as string] = miembroRow[key];
							}
						}
						if (miembro.evaluacionId) {
							if (!grupoFamiliarMap.has(miembro.evaluacionId)) {
								grupoFamiliarMap.set(miembro.evaluacionId, []);
							}
							grupoFamiliarMap
								.get(miembro.evaluacionId)!
								.push(miembro as GrupoFamiliar);
						}
					});
				}

				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const datosMapeados: Evaluation[] = (evaluacionesJson as any[]).map(
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					(row: any) => {
						const newRow: Partial<Evaluation> = {};
						for (const key in row) {
							if (headerMapping[key]) {
								const newKey = headerMapping[key];
								let value = row[key];

								// Convertir strings separados por coma a arrays
								if (arrayFields.includes(newKey) && typeof value === "string") {
									value = value.split(", ").filter(Boolean);
								}

								// Convertir "Sí"/"No" a booleanos
								if (booleanFields.includes(newKey)) {
									value = value === "Sí";
								}

								// Aquí se podrían añadir más transformaciones si son necesarias (fechas, números, etc.)

								// eslint-disable-next-line @typescript-eslint/no-explicit-any
								(newRow as any)[newKey] = value;
							}
						}
						// Aseguramos que el grupo familiar sea un array vacío si no existe
						// y lo poblamos desde el mapa.
						if (newRow.id && grupoFamiliarMap.has(newRow.id)) {
							newRow.grupoFamiliar = grupoFamiliarMap.get(newRow.id);
						}
						return newRow as Evaluation;
					},
				);

				setDatos(datosMapeados);
			} catch (err) {
				console.error(err);
				setError(
					"Error al procesar el archivo. Asegúrate de que sea un archivo Excel válido con el formato correcto.",
				);
			} finally {
				setCargando(false);
			}
		};

		reader.onerror = (err) => {
			console.error(err);
			setError("Error al leer el archivo.");
			setCargando(false);
		};

		reader.readAsBinaryString(file);
	}, []); // Dependencias vacías para useCallback

	return { datos, cargando, error, procesarArchivo };
};

import { pdf } from "@react-pdf/renderer";
import * as XLSX from "xlsx";
import { ReporteEdanPDF } from "../pages/ReporteEdanPDF";
import { FichaFamiliarPDF } from "../pages/FichaFamiliarPDF";
import { PlanillaEdanPDF } from "../pages/PlanillaEdanPDF";
import { imageUrlToBase64 } from "./imageUtils";
import { Evaluation } from "../type/type";

const joinArray = (arr: string[] | undefined) => arr?.join(", ") || "";

export const generatePdfReport = async (
	filteredData: Evaluation[],
	setIsGeneratingPdf: (loading: boolean) => void,
	tituloEvento?: string
) => {
	setIsGeneratingPdf(true);
	try {
		const blob = await pdf(<ReporteEdanPDF data={filteredData} />).toBlob();
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;

		const safeTitulo = tituloEvento
			? tituloEvento.replace(/[^a-z0-9]/gi, "_").toLowerCase()
			: "reporte_edanos";
		const fileName = `${safeTitulo}_${
			new Date().toISOString().split("T")[0]
		}.pdf`;

		link.setAttribute("download", fileName);
		document.body.appendChild(link);
		link.click();
		link.parentNode?.removeChild(link);
		URL.revokeObjectURL(url);
	} catch (error) {
		console.error("Error generating PDF:", error);
	} finally {
		setIsGeneratingPdf(false);
	}
};

export const generateExcelReport = async (
	filteredData: Evaluation[],
	setIsGeneratingExcel: (loading: boolean) => void,
	tituloEvento?: string
) => {
	setIsGeneratingExcel(true);
	try {
		// --- Hoja 1: Evaluaciones (con imágenes en Base64) ---
		const evaluacionesData = await Promise.all(
			filteredData.map(async (evaluation) => {
				// Convertir imágenes a Base64
				const firmaEvaluado = evaluation.firmaEvaluado || null;
				const firmaEvaluador = evaluation.firmaEvaluador || null;
				const fotoFamiliar = evaluation.fotoFamiliar || null;
				const fotosAdicionales = evaluation.fotosAdicionales || [];

				return {
					"ID Evaluación": evaluation.id,
					"Fecha de Creación": new Date(evaluation.createdAt).toLocaleString(),
					"Última Actualización": new Date(
						evaluation.updatedAt
					).toLocaleString(),
					"Información Preliminar": evaluation.informacionPreliminar,
					// Ubicación
					Estado: evaluation.estado,
					Municipio: evaluation.municipio,
					Parroquia: evaluation.parroquia,
					"Cuadrante de Paz": evaluation.cuadranteDePaz,
					Urbanización: evaluation.urbanizacion,
					Calle: evaluation.calle,
					Casa: evaluation.casa,
					"Sector/Barrio": evaluation.barrioSector,
					Vereda: evaluation.vereda,
					Apto: evaluation.apto,
					Avenida: evaluation.avenida,
					// Uso de la estructura
					"Uso de la Estructura": evaluation.usoEstructura,
					"Otros Usos": evaluation.otrosUsoEstructura,
					// Coordenadas
					Latitud: evaluation.latitud,
					Longitud: evaluation.longitud,
					Cota: evaluation.cota,
					Este: evaluation.este,
					Norte: evaluation.norte,
					Huso: evaluation.huso,
					// Evento
					"Tipo de Evento": evaluation.tipoEvento,
					"Fecha del Evento": evaluation.fechaEvento
						? new Date(evaluation.fechaEvento).toLocaleDateString()
						: "",
					"Hora del Evento": evaluation.horaEvento,
					// Jefe de Calle
					"Apellidos Jefe de Calle": evaluation.apellidosJefe,
					"Nombres Jefe de Calle": evaluation.nombresJefe,
					"Teléfono Jefe de Calle": evaluation.telefonoJefe,
					// Condición de vivienda
					"Nombre Jefe de Familia": evaluation.jefeFamilia,
					"Cédula Jefe de Familia": evaluation.cedulaJefe,
					"Teléfono Jefe de Familia": evaluation.telefonoJefeFamilia,

					"Condición Vivienda": evaluation.condicionVivienda,
					"Otra Condición Vivienda": evaluation.otrosCondicionVivienda,
					// Vías de acceso
					"Vías de Acceso": joinArray(evaluation.viasAcceso),
					"Otras Vías de Acceso": evaluation.otrosViasAcceso,
					"Condición de Acceso": evaluation.condicionAcceso,
					"Otra Condición de Acceso": evaluation.otrosCondicionAcceso,
					"Vivienda Solidaria": evaluation.viviendaSolidaria ? "Sí" : "No",
					Albergue: evaluation.albergue ? "Sí" : "No",
					"Teléfono Contacto Albergue": evaluation.telefonoContactoAlbergue,
					"Dirección Albergue": evaluation.direccionAlbergue,
					"Nombre Responsable Albergue": evaluation.nombreResponsableAlbergue,
					"Cédula Responsable Albergue": evaluation.cedulaResponsableAlbergue,
					// Evaluación estructural
					"Materiales de Construcción": joinArray(
						evaluation.materialesConstruccion
					),
					"Otros Materiales": evaluation.otrosMaterialesConstruccion,
					// Afectaciones, Pérdidas y Necesidades
					"Afectaciones Estructurales (Colapso)": joinArray(
						evaluation.afectacionesEstructuralesColapso
					),
					"Otras Afectaciones (Colapso)": evaluation.otrosEstructuralesColapso,
					"Afectaciones Parciales": joinArray(evaluation.afectacionesParciales),
					"Otras Afectaciones Parciales": evaluation.otrosAfectacionesParciales,
					"Afectaciones No Estructurales": joinArray(
						evaluation.afectacionesNoEstructurales
					),
					"Otras Afectaciones No Estructurales":
						evaluation.otrosNoEstructurales,
					"Pérdidas de Enseres": joinArray(evaluation.perdidasEnseres),
					"Otras Pérdidas de Enseres": evaluation.otrosPerdidasEnseres,
					"Líneas Vitales Afectadas": joinArray(
						evaluation.lineasVitalesAfectadas
					),
					"Otras Líneas Vitales Afectadas":
						evaluation.otrosLineasVitalesAfectadas,
					"Necesidades Inmediatas": joinArray(evaluation.necesidadesInmediatas),
					Observaciones: evaluation.observaciones,
					// Evaluador y Evaluado
					"Nombre Evaluador": evaluation.nombreEvaluador,
					"Cédula Evaluador": evaluation.cedulaEvaluador,
					"Teléfono Evaluador": evaluation.telefonoEvaluador,
					"Nombre Evaluado": evaluation.nombreEvaluado,
					"Cédula Evaluado": evaluation.cedulaEvaluado,
					"Teléfono Evaluado": evaluation.telefonoEvaluado,
					// --- CAMPOS DE IMÁGENES ---
					"Firma del Evaluado": firmaEvaluado,
					"Firma del Evaluador": firmaEvaluador,
					"Foto Familiar": fotoFamiliar,
					"Fotos Adicionales": joinArray(fotosAdicionales as string[]),
				};
			})
		);

		// --- Hoja 2: Grupo Familiar ---
		const grupoFamiliarData = filteredData.flatMap((evaluation) => {
			const commonFieldsForFamily = {
				"ID Evaluación": evaluation.id,
				"Fecha de Creación Evaluación": new Date(
					evaluation.createdAt
				).toLocaleString(),
				Municipio: evaluation.municipio,
				Parroquia: evaluation.parroquia,
				"Sector/Barrio": evaluation.barrioSector,
				"Jefe de Familia Evaluación": evaluation.jefeFamilia,
				"Cédula Jefe de Familia Evaluación": evaluation.cedulaJefe,
			};

			const jefeRow = {
				...commonFieldsForFamily,
				"Es Jefe de Familia": "Sí",
				"Nombre Completo": evaluation.jefeFamilia || "N/A",
				Cédula: evaluation.cedulaJefe,
				Teléfono: evaluation.telefonoJefeFamilia,
				Edad: evaluation.edadJefe ? parseInt(evaluation.edadJefe, 10) : "",
				Sexo: evaluation.sexoJefe,
				Parentesco: "Jefe",
				"Talla Camisa": evaluation.tallaC,
				"Talla Pantalón": evaluation.tallaP,
				"Talla Zapatos": evaluation.tallaZ,
				Patologías: evaluation.patologiasJefe,
			};

			const miembrosRows = evaluation.grupoFamiliar
				.filter((miembro) => miembro.cedula !== evaluation.cedulaJefe) // Evitar duplicar al jefe si está en grupoFamiliar
				.map((miembro) => ({
					...commonFieldsForFamily,
					"Es Jefe de Familia": "No",
					"Nombre Completo": miembro.apellidosNombres || "N/A",
					Cédula: miembro.cedula,
					Teléfono: "", // Los miembros no tienen teléfono individual en el modelo
					Edad: miembro.edad ? parseInt(miembro.edad, 10) : "",
					Sexo: miembro.sexo,
					Parentesco: miembro.parentesco,
					"Talla Camisa": miembro.tallaC,
					"Talla Pantalón": miembro.tallaP,
					"Talla Zapatos": miembro.tallaZ,
					Patologías: miembro.patologias,
				}));

			return [jefeRow, ...miembrosRows];
		});

		// --- Crear y exportar el archivo Excel ---
		const wb = XLSX.utils.book_new();

		// Hoja de Evaluaciones
		if (evaluacionesData.length > 0) {
			const wsEvaluaciones = XLSX.utils.json_to_sheet(evaluacionesData);
			XLSX.utils.book_append_sheet(wb, wsEvaluaciones, "Evaluaciones");
		}

		// Hoja de Grupo Familiar
		if (grupoFamiliarData.length > 0) {
			const wsGrupoFamiliar = XLSX.utils.json_to_sheet(grupoFamiliarData);
			XLSX.utils.book_append_sheet(wb, wsGrupoFamiliar, "Grupo Familiar");
		}

		// Generar y descargar el archivo
		const safeTitulo = tituloEvento
			? tituloEvento.replace(/[^a-z0-9]/gi, "_").toLowerCase()
			: "reporte_edanos";
		const fileName = `${safeTitulo}_${
			new Date().toISOString().split("T")[0]
		}.xlsx`;

		XLSX.writeFile(wb, fileName);
	} catch (error) {
		console.error("Error generating Excel:", error);
	} finally {
		setIsGeneratingExcel(false);
	}
};

export const generateFichaPdf = async (
	filteredData: Evaluation[],
	setIsGeneratingFicha: (loading: boolean) => void
) => {
	setIsGeneratingFicha(true);
	try {
		// Create a deep copy to avoid modifying the original filteredData state
		const dataForPdf = JSON.parse(JSON.stringify(filteredData)) as Evaluation[];

		// Convert image URLs to Base64
		for (const evaluation of dataForPdf) {
			if (evaluation.fotoFamiliar) {
				const base64Image = (await imageUrlToBase64(
					evaluation.fotoFamiliar
				)) as string | null;
				if (base64Image) {
					evaluation.fotoFamiliar = base64Image;
				} else {
					evaluation.fotoFamiliar = null;
				}
			}
		}

		const blob = await pdf(<FichaFamiliarPDF data={dataForPdf} />).toBlob();
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		const fileName = `ficha_Edanos_${
			new Date().toISOString().split("T")[0]
		}.pdf`;
		link.setAttribute("download", fileName);
		document.body.appendChild(link);
		link.click();
		link.parentNode?.removeChild(link);
		URL.revokeObjectURL(url);
	} catch (error) {
		console.error("Error generating Ficha:", error);
	} finally {
		setIsGeneratingFicha(false);
	}
};

export const generatePlanillaPdf = async (
	filteredData: Evaluation[],
	setIsGeneratingPlanilla: (loading: boolean) => void
) => {
	setIsGeneratingPlanilla(true);
	try {
		// Convert image URLs to Base64
		for (const evaluation of filteredData) {
			// Convert fotosAdicionales (array of URLs) to base64 strings
			if (
				evaluation.fotosAdicionales &&
				evaluation.fotosAdicionales.length > 0
			) {
				const base64Images = (await imageUrlToBase64(
					evaluation.fotosAdicionales
				)) as string[] | null;
				evaluation.fotosAdicionales = base64Images || [];
			} else {
				evaluation.fotosAdicionales = []; // Ensure it's an empty array if no additional photos
			}

			// Convert firmaEvaluado to base64
			if (evaluation.firmaEvaluado) {
				const base64FirmaEvaluado = (await imageUrlToBase64(
					evaluation.firmaEvaluado
				)) as string | null;
				evaluation.firmaEvaluado = base64FirmaEvaluado;
			}

			// Convert firmaEvaluador to base64
			if (evaluation.firmaEvaluador) {
				const base64FirmaEvaluador = (await imageUrlToBase64(
					evaluation.firmaEvaluador
				)) as string | null;
				evaluation.firmaEvaluador = base64FirmaEvaluador;
			}
		}

		for (const evaluation of filteredData) {
			const blob = await pdf(
				<PlanillaEdanPDF evaluation={evaluation} />
			).toBlob();
			const url = URL.createObjectURL(blob);
			const fileName = `planilla_edan_${evaluation.id}_${
				new Date().toISOString().split("T")[0]
			}.pdf`;
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", fileName);
			document.body.appendChild(link);
			link.click();
			link.parentNode?.removeChild(link);
			URL.revokeObjectURL(url);
		}
	} catch (error) {
		console.error("Error generating Planilla:", error);
	} finally {
		setIsGeneratingPlanilla(false);
	}
};

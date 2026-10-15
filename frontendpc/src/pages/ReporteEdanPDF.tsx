import {
	Document,
	Page,
	Text,
	View,
	StyleSheet,
	Image,
} from "@react-pdf/renderer";
import { Evaluation } from "../type/type";
import header from "/src/assets/header.png";
import footer from "/src/assets/footer.png";
import { useMemo } from "react";

// Estilos refinados para un reporte compacto y estructurado tipo planilla
const styles = StyleSheet.create({
	page: {
		paddingTop: 70, // Espacio para el header
		paddingBottom: 65, // Espacio para el footer
		paddingHorizontal: 30,
		fontFamily: "Helvetica",
		backgroundColor: "#f9f9f9",
	},
	headerImage: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		width: "100%",
		height: 100, // Altura del header
	},
	footer: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		width: "100%",
		height: 60, // Altura del footer
	},
	pageNumber: {
		position: "absolute",
		fontSize: 8,
		bottom: 25,
		left: 0,
		right: 0,
		textAlign: "center",
		color: "grey",
	},
	title: {
		fontSize: 16,
		textAlign: "center",
		marginBottom: 4,
    marginTop: 20,
		fontFamily: "Helvetica-Bold",
		color: "#d65a00",
	},
	subtitle: {
		fontSize: 9,
		textAlign: "center",
		marginBottom: 12,
		fontFamily: "Helvetica",
		color: "grey",
	},
	seccionTitulo: {
		backgroundColor: "#FFA500",
		color: "white",
		textAlign: "center",
		padding: 4,
		fontSize: 10,
		fontFamily: "Helvetica-Bold",
	},
	table: {
		display: "flex",
		width: "auto",
		borderStyle: "solid",
		borderWidth: 1,
		borderColor: "#FFDDC1",
		marginBottom: 8,
		borderRadius: 4,
		overflow: "hidden",
	},
	tableRow: {
		flexDirection: "row",
		backgroundColor: "white",
	},
	tableRowAlternate: {
		flexDirection: "row",
		backgroundColor: "#FFF3E0",
	},
	tableColHeader: {
		backgroundColor: "#FFDDC1",
		paddingVertical: 4,
		paddingHorizontal: 5,
		textAlign: "center",
		fontFamily: "Helvetica-Bold",
		fontSize: 8,
		borderRightWidth: 1,
		borderRightColor: "#FFA500",
	},
	tableCol: {
		paddingVertical: 3,
		paddingHorizontal: 5,
		textAlign: "left",
		fontSize: 8,
		borderRightWidth: 1,
		borderRightColor: "#FFDDC1",
	},
	kpiContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		marginBottom: 15,
	},
	kpiBox: {
		textAlign: "center",
		padding: 8,
		backgroundColor: "white",
		borderRadius: 5,
		border: "1px solid #FFDDC1",
		flex: 1,
		marginHorizontal: 4,
	},
	kpiValue: {
		fontSize: 16,
		fontFamily: "Helvetica-Bold",
		color: "#d65a00",
	},
	kpiLabel: {
		fontSize: 9,
		color: "#555",
	},
	noDataText: {
		textAlign: "center",
		marginTop: 50,
		fontStyle: "italic",
		color: "#888",
		fontSize: 12,
	},
});

const getCurrentDate = () => {
	return new Date().toLocaleDateString("es-VE", {
		day: "numeric",
		month: "long",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});
};

export const ReporteEdanPDF = ({ data }: { data: Evaluation[] }) => {
	const summary = useMemo(() => {
		if (!data || data.length === 0) return null;

		const allPeople = data.flatMap((e) => [
			{
				sexo: e.sexoJefe,
				edad: e.edadJefe,
				tallaC: e.tallaC,
				tallaP: e.tallaP,
				tallaZ: e.tallaZ,
				patologias: e.patologiasJefe,
			},
			...e.grupoFamiliar.map((m) => ({
				sexo: m.sexo,
				edad: m.edad,
				tallaC: m.tallaC,
				tallaP: m.tallaP,
				tallaZ: m.tallaZ,
				patologias: m.patologias,
			})),
		]);

		const totalEvaluaciones = data.length;
		const totalPersonas = allPeople.length;

    const gender = allPeople.reduce(
      (acc, p) => {
        if (p.sexo?.toUpperCase() === "M") acc.masculino++;
        if (p.sexo?.toUpperCase() === "F") acc.femenino++;
        return acc;
      },
      { masculino: 0, femenino: 0 }
    );

		const ageGroups = allPeople.reduce(
			(acc, p) => {
				const age = p.edad ? parseInt(p.edad, 10) : -1;
				if (age >= 0 && age <= 12) acc["0-12"]++;
				else if (age >= 13 && age <= 18) acc["13-18"]++;
				else if (age >= 19 && age <= 30) acc["19-30"]++;
				else if (age >= 31 && age <= 50) acc["31-50"]++;
				else if (age >= 51 && age <= 65) acc["51-65"]++;
				else if (age > 65) acc["65+"]++;
				return acc;
			},
			{ "0-12": 0, "13-18": 0, "19-30": 0, "31-50": 0, "51-65": 0, "65+": 0 }
		);

		const countBy = (key: keyof Evaluation) =>
			data.reduce((acc: Record<string, number>, e) => {
				const value = e[key] as string;
				if (value) {
					acc[value] = (acc[value] || 0) + 1;
				}
				return acc;
			}, {});

		const countArray = (key: keyof Evaluation) =>
			data.reduce((acc: Record<string, number>, e) => {
				const values = e[key] as string[];
				if (values && Array.isArray(values)) {
					values.forEach((value) => {
						acc[value] = (acc[value] || 0) + 1;
					});
				}
				return acc;
			}, {});

		const countSizes = (key: "tallaC" | "tallaP" | "tallaZ") =>
			allPeople.reduce((acc: Record<string, number>, p) => {
				const value = p[key];
				if (value) {
					acc[value] = (acc[value] || 0) + 1;
				}
				return acc;
			}, {});

		const patologias = allPeople
			.flatMap((p) => p.patologias?.split(",") || [])
			.map((p) => p.trim())
			.filter(Boolean)
			.reduce((acc: Record<string, number>, p) => {
				acc[p] = (acc[p] || 0) + 1;
				return acc;
			}, {});

		return {
			totalEvaluaciones,
			totalPersonas,
			gender,
			ageGroups,
			municipios: countBy("municipio"),
			parroquias: countBy("parroquia"),
			sectores: countBy("barrioSector"),
			tiposEvento: countBy("tipoEvento"),
			condicionesVivienda: countBy("condicionVivienda"),
			perdidasEnseres: countArray("perdidasEnseres"),
			lineasVitalesAfectadas: countArray("lineasVitalesAfectadas"),
			necesidadesInmediatas: countArray("necesidadesInmediatas"),
			tallasC: countSizes("tallaC"),
			tallasP: countSizes("tallaP"),
			tallasZ: countSizes("tallaZ"),
			patologias,
		};
	}, [data]);

	if (!summary) {
		return (
			<Document>
				<Page style={styles.page}>
					<Image src={header} style={styles.headerImage} fixed />
					<View style={{ paddingTop: 80 }}>
						<Text style={styles.title}>REPORTE CONSOLIDADO EDAN</Text>
						<Text style={styles.noDataText}>
							No hay datos para generar el reporte.
						</Text>
					</View>
					<Image src={footer} style={styles.footer} fixed />
				</Page>
			</Document>
		);
	}

	const toTableData = (obj: Record<string, number>) =>
		Object.entries(obj).sort((a, b) => b[1] - a[1]);

	return (
		<Document>
			<Page size="A4" style={styles.page}>
				<Image src={header} style={styles.headerImage} fixed />
				<Image src={footer} style={styles.footer} fixed />

				<Text style={styles.title}>Reporte Consolidado EDANOS</Text>
				<Text style={styles.subtitle}>Generado el: {getCurrentDate()}</Text>

				<View style={styles.kpiContainer}>
					<View style={styles.kpiBox}>
						<Text style={styles.kpiValue}>{summary.totalEvaluaciones}</Text>
						<Text style={styles.kpiLabel}>Evaluaciones</Text>
					</View>
					<View style={styles.kpiBox}>
						<Text style={styles.kpiValue}>{data.length}</Text>
						<Text style={styles.kpiLabel}>Familias</Text>
					</View>
					<View style={styles.kpiBox}>
						<Text style={styles.kpiValue}>{summary.totalPersonas}</Text>
						<Text style={styles.kpiLabel}>Personas</Text>
					</View>
				</View>

				{/* --- Fila 1: Demografía y Geografía --- */}
				<View style={{ flexDirection: "row", gap: 10 }}>
					<View style={{ flex: 1 }}>
						<View style={styles.table}>
							<View style={styles.seccionTitulo}>
								<Text>Resumen Demográfico</Text>
							</View>
							<View style={styles.tableRow}>
								<Text style={[styles.tableColHeader, { flex: 2 }]}>Género</Text>
								<Text
									style={[
										styles.tableColHeader,
										{ flex: 1, borderRightWidth: 0 },
									]}
								>
									Total
								</Text>
							</View>
							<View style={styles.tableRowAlternate}>
								<Text style={[styles.tableCol, { flex: 2 }]}>Masculino</Text>
								<Text
									style={[
										styles.tableCol,
										{ flex: 1, textAlign: "center", borderRightWidth: 0 },
									]}
								>
									{summary.gender.masculino}
								</Text>
							</View>
							<View style={styles.tableRow}>
								<Text style={[styles.tableCol, { flex: 2 }]}>Femenino</Text>
								<Text
									style={[
										styles.tableCol,
										{ flex: 1, textAlign: "center", borderRightWidth: 0 },
									]}
								>
									{summary.gender.femenino}
								</Text>
							</View>
						</View>
						<View style={styles.table}>
							<View style={styles.tableRow}>
								<Text style={[styles.tableColHeader, { flex: 2 }]}>
									Rango de Edad
								</Text>
								<Text
									style={[
										styles.tableColHeader,
										{ flex: 1, borderRightWidth: 0 },
									]}
								>
									Total
								</Text>
							</View>
							{toTableData(summary.ageGroups).map(([range, count], i) => (
								<View
									style={
										i % 2 === 0 ? styles.tableRow : styles.tableRowAlternate
									}
									key={i}
								>
									<Text style={[styles.tableCol, { flex: 2 }]}>{range}</Text>
									<Text
										style={[
											styles.tableCol,
											{ flex: 1, textAlign: "center", borderRightWidth: 0 },
										]}
									>
										{count}
									</Text>
								</View>
							))}
						</View>
					</View>
					<View style={{ flex: 1 }}>
						<View style={styles.table}>
							<View style={styles.seccionTitulo}>
								<Text>Distribución Geográfica</Text>
							</View>
							<View style={styles.tableRow}>
								<Text style={[styles.tableColHeader, { flex: 2 }]}>
									Municipio
								</Text>
								<Text
									style={[
										styles.tableColHeader,
										{ flex: 1, borderRightWidth: 0 },
									]}
								>
									Nº Eval.
								</Text>
							</View>
							{toTableData(summary.municipios).map(([name, count], i) => (
								<View
									style={
										i % 2 === 0 ? styles.tableRow : styles.tableRowAlternate
									}
									key={i}
								>
									<Text style={[styles.tableCol, { flex: 2 }]}>{name}</Text>
									<Text
										style={[
											styles.tableCol,
											{ flex: 1, textAlign: "center", borderRightWidth: 0 },
										]}
									>
										{count}
									</Text>
								</View>
							))}
						</View>
						<View style={styles.table}>
							<View style={styles.tableRow}>
								<Text style={[styles.tableColHeader, { flex: 2 }]}>
									Parroquia
								</Text>
								<Text
									style={[
										styles.tableColHeader,
										{ flex: 1, borderRightWidth: 0 },
									]}
								>
									Nº Eval.
								</Text>
							</View>
							{toTableData(summary.parroquias).map(([name, count], i) => (
								<View
									style={
										i % 2 === 0 ? styles.tableRow : styles.tableRowAlternate
									}
									key={i}
								>
									<Text style={[styles.tableCol, { flex: 2 }]}>{name}</Text>
									<Text
										style={[
											styles.tableCol,
											{ flex: 1, textAlign: "center", borderRightWidth: 0 },
										]}
									>
										{count}
									</Text>
								</View>
							))}
						</View>
					</View>
				</View>

				{/* --- Fila 2: Eventos y Necesidades --- */}
				<View style={{ flexDirection: "row", gap: 10 }}>
					<View style={{ flex: 1 }}>
						<View style={styles.table}>
							<View style={styles.seccionTitulo}>
								<Text>Eventos y Afectaciones</Text>
							</View>
							<View style={styles.tableRow}>
								<Text style={[styles.tableColHeader, { flex: 2 }]}>
									Tipo de Evento
								</Text>
								<Text
									style={[
										styles.tableColHeader,
										{ flex: 1, borderRightWidth: 0 },
									]}
								>
									Nº Casos
								</Text>
							</View>
							{toTableData(summary.tiposEvento).map(([name, count], i) => (
								<View
									style={
										i % 2 === 0 ? styles.tableRow : styles.tableRowAlternate
									}
									key={i}
								>
									<Text style={[styles.tableCol, { flex: 2 }]}>{name}</Text>
									<Text
										style={[
											styles.tableCol,
											{ flex: 1, textAlign: "center", borderRightWidth: 0 },
										]}
									>
										{count}
									</Text>
								</View>
							))}
						</View>
						<View style={styles.table}>
							<View style={styles.tableRow}>
								<Text style={[styles.tableColHeader, { flex: 2 }]}>
									Condición de Vivienda
								</Text>
								<Text
									style={[
										styles.tableColHeader,
										{ flex: 1, borderRightWidth: 0 },
									]}
								>
									Nº Casos
								</Text>
							</View>
							{toTableData(summary.condicionesVivienda).map(
								([name, count], i) => (
									<View
										style={
											i % 2 === 0 ? styles.tableRow : styles.tableRowAlternate
										}
										key={i}
									>
										<Text style={[styles.tableCol, { flex: 2 }]}>{name}</Text>
										<Text
											style={[
												styles.tableCol,
												{ flex: 1, textAlign: "center", borderRightWidth: 0 },
											]}
										>
											{count}
										</Text>
									</View>
								)
							)}
						</View>
					</View>
					<View style={{ flex: 1 }}>
						<View style={styles.table}>
							<View style={styles.seccionTitulo}>
								<Text>Resumen de Necesidades</Text>
							</View>
							<View style={styles.tableRow}>
								<Text style={[styles.tableColHeader, { flex: 2 }]}>
									Necesidades Inmediatas
								</Text>
								<Text
									style={[
										styles.tableColHeader,
										{ flex: 1, borderRightWidth: 0 },
									]}
								>
									Solicitudes
								</Text>
							</View>
							{toTableData(summary.necesidadesInmediatas).map(
								([name, count], i) => (
									<View
										style={
											i % 2 === 0 ? styles.tableRow : styles.tableRowAlternate
										}
										key={i}
									>
										<Text style={[styles.tableCol, { flex: 2 }]}>{name}</Text>
										<Text
											style={[
												styles.tableCol,
												{ flex: 1, textAlign: "center", borderRightWidth: 0 },
											]}
										>
											{count}
										</Text>
									</View>
								)
							)}
						</View>
						<View style={styles.table}>
							<View style={styles.tableRow}>
								<Text style={[styles.tableColHeader, { flex: 2 }]}>
									Pérdidas de Enseres
								</Text>
								<Text
									style={[
										styles.tableColHeader,
										{ flex: 1, borderRightWidth: 0 },
									]}
								>
									Registros
								</Text>
							</View>
							{toTableData(summary.perdidasEnseres).map(([name, count], i) => (
								<View
									style={
										i % 2 === 0 ? styles.tableRow : styles.tableRowAlternate
									}
									key={i}
								>
									<Text style={[styles.tableCol, { flex: 2 }]}>{name}</Text>
									<Text
										style={[
											styles.tableCol,
											{ flex: 1, textAlign: "center", borderRightWidth: 0 },
										]}
									>
										{count}
									</Text>
								</View>
							))}
						</View>
					</View>
				</View>

				{/* --- Fila 3: Tallas y Salud --- */}
				<View style={{ flexDirection: "row", gap: 10 }}>
					<View style={{ flex: 1 }}>
						<View style={styles.table}>
							<View style={styles.seccionTitulo}>
								<Text>Análisis de Tallas</Text>
							</View>
							<View style={styles.tableRow}>
								<Text style={[styles.tableColHeader, { flex: 2 }]}>
									Talla Camisa
								</Text>
								<Text
									style={[
										styles.tableColHeader,
										{ flex: 1, borderRightWidth: 0 },
									]}
								>
									Cantidad
								</Text>
							</View>
							{toTableData(summary.tallasC).map(([name, count], i) => (
								<View
									style={
										i % 2 === 0 ? styles.tableRow : styles.tableRowAlternate
									}
									key={i}
								>
									<Text style={[styles.tableCol, { flex: 2 }]}>{name}</Text>
									<Text
										style={[
											styles.tableCol,
											{ flex: 1, textAlign: "center", borderRightWidth: 0 },
										]}
									>
										{count}
									</Text>
								</View>
							))}
						</View>
						<View style={styles.table}>
							<View style={styles.tableRow}>
								<Text style={[styles.tableColHeader, { flex: 2 }]}>
									Talla Pantalón
								</Text>
								<Text
									style={[
										styles.tableColHeader,
										{ flex: 1, borderRightWidth: 0 },
									]}
								>
									Cantidad
								</Text>
							</View>
							{toTableData(summary.tallasP).map(([name, count], i) => (
								<View
									style={
										i % 2 === 0 ? styles.tableRow : styles.tableRowAlternate
									}
									key={i}
								>
									<Text style={[styles.tableCol, { flex: 2 }]}>{name}</Text>
									<Text
										style={[
											styles.tableCol,
											{ flex: 1, textAlign: "center", borderRightWidth: 0 },
										]}
									>
										{count}
									</Text>
								</View>
							))}
						</View>
						<View style={styles.table}>
							<View style={styles.tableRow}>
								<Text style={[styles.tableColHeader, { flex: 2 }]}>
									Talla Zapatos
								</Text>
								<Text
									style={[
										styles.tableColHeader,
										{ flex: 1, borderRightWidth: 0 },
									]}
								>
									Cantidad
								</Text>
							</View>
							{toTableData(summary.tallasZ).map(([name, count], i) => (
								<View
									style={
										i % 2 === 0 ? styles.tableRow : styles.tableRowAlternate
									}
									key={i}
								>
									<Text style={[styles.tableCol, { flex: 2 }]}>{name}</Text>
									<Text
										style={[
											styles.tableCol,
											{ flex: 1, textAlign: "center", borderRightWidth: 0 },
										]}
									>
										{count}
									</Text>
								</View>
							))}
						</View>
					</View>
					<View style={{ flex: 1 }}>
						<View style={styles.table}>
							<View style={styles.seccionTitulo}>
								<Text>Análisis de Salud</Text>
							</View>
							<View style={styles.tableRow}>
								<Text style={[styles.tableColHeader, { flex: 2 }]}>
									Patología
								</Text>
								<Text
									style={[
										styles.tableColHeader,
										{ flex: 1, borderRightWidth: 0 },
									]}
								>
									Nº Casos
								</Text>
							</View>
							{toTableData(summary.patologias).map(([name, count], i) => (
								<View
									style={
										i % 2 === 0 ? styles.tableRow : styles.tableRowAlternate
									}
									key={i}
								>
									<Text style={[styles.tableCol, { flex: 2 }]}>{name}</Text>
									<Text
										style={[
											styles.tableCol,
											{ flex: 1, textAlign: "center", borderRightWidth: 0 },
										]}
									>
										{count}
									</Text>
								</View>
							))}
						</View>
					</View>
				</View>

				<Text
					style={styles.pageNumber}
					render={({ pageNumber, totalPages }) =>
						`Página ${pageNumber} de ${totalPages}`
					}
					fixed
				/>
			</Page>
		</Document>
	);
};

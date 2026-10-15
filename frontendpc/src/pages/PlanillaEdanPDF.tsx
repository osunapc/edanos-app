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

const styles = StyleSheet.create({
	page: {
		paddingTop: 110,
		paddingBottom: 70,
		paddingHorizontal: 30,
		fontFamily: "Helvetica",
		fontSize: 9,
		backgroundColor: "#FEFEFE",
	},
	headerImage: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		width: "100%",
		height: 100,
	},
	footer: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		width: "100%",
		height: 60,
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
		fontSize: 12,
		textAlign: "center",
		marginBottom: 8,
		marginTop: 30,
		fontFamily: "Helvetica-Bold",
		color: "#d65a00",
	},
	subtitle: {
		fontSize: 9,
		textAlign: "center",
		marginBottom: 10,
		color: "#333",
	},
	seccionTitulo: {
		backgroundColor: "#FFA500",
		color: "white",
		textAlign: "center",
		padding: 4,
		fontSize: 10,
		fontFamily: "Helvetica-Bold",
		marginBottom: 4,
	},
	table: {
		display: "flex",
		width: "auto",
		border: "1px solid #FFDDC1",
		marginBottom: 8,
		borderRadius: 4,
		overflow: "hidden",
	},
	tableRow: { flexDirection: "row", backgroundColor: "white" },
	tableRowAlternate: { flexDirection: "row", backgroundColor: "#FFF3E0" },
	tableColHeader: {
		backgroundColor: "#FFDDC1",
		padding: 4,
		fontFamily: "Helvetica-Bold",
		fontSize: 8,
		borderRight: "1px solid #FFA500",
	},
	tableCol: { padding: 4, fontSize: 8, borderRight: "1px solid #FFDDC1" },
	subtleText: { fontSize: 7, color: "grey" },
	flexRow: { flexDirection: "row", gap: 10,  },
	imagenes: { flexDirection: "row", gap: 10, marginTop: 10 },
	flexCol: { flex: 1 },
	signatureBox: {
		height: 50,
		border: "1px solid #FFDDC1",
		marginTop: 4,
		borderRadius: 4,
	},
	signatureName: {
		borderTop: "1px solid #333",
		paddingTop: 4,
		marginTop: 4,
		textAlign: "center",
		fontFamily: "Helvetica-Bold",
		fontSize: 8,
	},
	listItem: { marginLeft: 10, marginBottom: 2 },
	fullWidthText: {
		padding: 5,
		fontSize: 8,
		backgroundColor: "#FFF3E0",
		borderRadius: 4,
		marginBottom: 8,
	},
		foto: {
			width: 200,
			height: 150,
			objectFit: "contain",
			alignSelf: "center",
		},
	});
	
	const join = (arr: string[] | undefined, separator = ", ") =>
		arr?.length ? arr.join(separator) : "N/A";
	const formatDate = (dateStr?: string) =>
		dateStr ? new Date(dateStr).toLocaleString("es-VE") : "N/A";
	
	const PlanillaPage = ({ evaluation }: { evaluation: Evaluation }) => (
		<Page size="A4" style={styles.page}>
			<Image src={header} style={styles.headerImage} fixed />
			<Image src={footer} style={styles.footer} fixed />
	
			<Text style={styles.title}>
				PLANILLA DE EVALUACIÓN DE DAÑOS Y ANÁLISIS DE NECESIDADES (EDAN) EDANOS
			</Text>
			<Text style={styles.subtitle}>
				Fecha de Evaluación: {formatDate(evaluation.createdAt)}
			</Text>
	
			{/* --- SECCIÓN 1: INFORMACIÓN PRELIMINAR --- */}
			<View style={styles.table}>
				<View style={styles.seccionTitulo}>
					<Text>1. INFORMACIÓN PRELIMINAR</Text>
				</View>
				<Text style={styles.fullWidthText}>
					{evaluation.informacionPreliminar || "Sin información preliminar."}
				</Text>
			</View>
	
			{/* --- SECCIÓN 2: UBICACIÓN Y EVENTO --- */}
			<View style={styles.table}>
				<View style={styles.seccionTitulo}>
					<Text>2. UBICACIÓN Y DATOS DEL EVENTO</Text>
				</View>
				<View style={styles.tableRow}>
					<Text style={[styles.tableColHeader, { flex: 1 }]}>Estado</Text>
					<Text style={[styles.tableCol, { flex: 2 }]}>{evaluation.estado}</Text>
					<Text style={[styles.tableColHeader, { flex: 1 }]}>Municipio</Text>
					<Text style={[styles.tableCol, { flex: 2 }]}>
						{evaluation.municipio}
					</Text>
				</View>
				<View style={styles.tableRowAlternate}>
					<Text style={[styles.tableColHeader, { flex: 1 }]}>Parroquia</Text>
					<Text style={[styles.tableCol, { flex: 2 }]}>
						{evaluation.parroquia}
					</Text>
					<Text style={[styles.tableColHeader, { flex: 1 }]}>
						Cuadrante de Paz
					</Text>
					<Text style={[styles.tableCol, { flex: 2 }]}>
						{evaluation.cuadranteDePaz}
					</Text>
				</View>
				<View style={styles.tableRow}>
					<Text style={[styles.tableColHeader, { flex: 1 }]}>Sector/Barrio</Text>
					<Text style={[styles.tableCol, { flex: 5 }]}>
						{evaluation.barrioSector}
					</Text>
				</View>
				<View style={styles.tableRowAlternate}>
					<Text style={[styles.tableColHeader, { flex: 1 }]}>Dirección</Text>
					<Text style={[styles.tableCol, { flex: 5 }]}>
						{[
							evaluation.urbanizacion,
							evaluation.avenida,
							evaluation.calle,
							evaluation.vereda,
							evaluation.casa,
							evaluation.apto,
						]
							.filter(Boolean)
							.join(", ")}
					</Text>
				</View>
							<View style={styles.tableRow}>
								<Text style={[styles.tableColHeader, { flex: 1 }]}>Coordenadas</Text>
								<Text style={[styles.tableCol, { flex: 2, textAlign: "center" }]}>
									Lat: {evaluation.latitud}, Lon: {evaluation.longitud}
								</Text>
								<Text style={[styles.tableColHeader, { flex: 1 }]}>Tipo de Evento</Text>
								<Text style={[styles.tableCol, { flex: 2 }]}>
									{evaluation.tipoEvento}
								</Text>
							</View>				<View style={styles.tableRowAlternate}>
					<Text style={[styles.tableColHeader, { flex: 1 }]}>
						Fecha del Evento
					</Text>
					<Text style={[styles.tableCol, { flex: 2 }]}>
						{formatDate(evaluation.fechaEvento)}
					</Text>
					<Text style={[styles.tableColHeader, { flex: 1 }]}>
						Hora del Evento
					</Text>
					<Text style={[styles.tableCol, { flex: 2 }]}>
						{evaluation.horaEvento}
					</Text>
				</View>
			</View>
	
			{/* --- SECCIÓN 3: COMPOSICIÓN FAMILIAR --- */}
			<View style={styles.table} wrap={false}>
				<View style={styles.seccionTitulo}>
					<Text>3. COMPOSICIÓN DEL GRUPO FAMILIAR</Text>
				</View>
				<View style={styles.tableRow}>
					<Text style={[styles.tableColHeader, { flex: 3 }]}>
						Apellidos y Nombres
					</Text>
					<Text
						style={[styles.tableColHeader, { flex: 1.2, textAlign: "center" }]}>
						Cédula
					</Text>
					<Text
						style={[styles.tableColHeader, { flex: 0.5, textAlign: "center" }]}>
						Edad
					</Text>
					<Text
						style={[styles.tableColHeader, { flex: 0.6, textAlign: "center" }]}>
						Sexo
					</Text>
					<Text style={[styles.tableColHeader, { flex: 1 }]}>Parentesco</Text>
					<Text
						style={[styles.tableColHeader, { flex: 0.8, textAlign: "center" }]}>
						T. Camisa
					</Text>
					<Text
						style={[styles.tableColHeader, { flex: 0.8, textAlign: "center" }]}>
						T. Pantalón
					</Text>
					<Text
						style={[styles.tableColHeader, { flex: 0.8, textAlign: "center" }]}>
						T. Zapatos
					</Text>
					<Text style={[styles.tableColHeader, { flex: 1.5 }]}>Patologías</Text>
				</View>
				{[
					{
						apellidosNombres: evaluation.jefeFamilia,
						cedula: evaluation.cedulaJefe,
						edad: evaluation.edadJefe,
						sexo: evaluation.sexoJefe,
						parentesco: "Jefe de Familia",
						tallaC: evaluation.tallaC,
						tallaP: evaluation.tallaP,
						tallaZ: evaluation.tallaZ,
						patologias: evaluation.patologiasJefe,
					},
					...evaluation.grupoFamiliar,
				].map((p, i) => (
					<View
						style={i % 2 === 0 ? styles.tableRowAlternate : styles.tableRow}
						key={i}
					>
						<Text style={[styles.tableCol, { flex: 3 }]}>
							{p.apellidosNombres}
						</Text>
						<Text style={[styles.tableCol, { flex: 1.2, textAlign: "center" }]}>
							{p.cedula}
						</Text>
						<Text style={[styles.tableCol, { flex: 0.5, textAlign: "center" }]}>
							{p.edad}
						</Text>
						<Text style={[styles.tableCol, { flex: 0.6, textAlign: "center" }]}>
							{p.sexo}
						</Text>
						<Text style={[styles.tableCol, { flex: 1 }]}>{p.parentesco}</Text>
						<Text style={[styles.tableCol, { flex: 0.8, textAlign: "center" }]}>
							{p.tallaC}
						</Text>
						<Text style={[styles.tableCol, { flex: 0.8, textAlign: "center" }]}>
							{p.tallaP}
						</Text>
						<Text style={[styles.tableCol, { flex: 0.8, textAlign: "center" }]}>
							{p.tallaZ}
						</Text>
						<Text style={[styles.tableCol, { flex: 1.5 }]}>{p.patologias}</Text>
					</View>
				))}
			</View>
	
			{/* --- SECCIÓN 4: INFRAESTRUCTURA Y ACCESO --- */}
			<View style={styles.table} wrap={false}>
				<View style={styles.seccionTitulo}>
					<Text>4. INFRAESTRUCTURA Y ACCESO</Text>
				</View>
				<View style={styles.tableRow}>
					<Text style={[styles.tableColHeader, { flex: 1 }]}>Uso Estructura</Text>
					<Text style={[styles.tableCol, { flex: 2 }]}>
						{evaluation.usoEstructura}{" "}
						{evaluation.otrosUsoEstructura
							? `(${evaluation.otrosUsoEstructura})`
							: ""}
					</Text>
					<Text style={[styles.tableColHeader, { flex: 1 }]}>
						Condición Acceso
					</Text>
					<Text style={[styles.tableCol, { flex: 2 }]}>
						{evaluation.condicionAcceso}{" "}
						{evaluation.otrosCondicionAcceso
							? `(${evaluation.otrosCondicionAcceso})`
							: ""}
					</Text>
				</View>
				<View style={styles.tableRowAlternate}>
					<Text style={[styles.tableColHeader, { flex: 1 }]}>Materiales</Text>
					<Text style={[styles.tableCol, { flex: 5 }]}>
						{join(evaluation.materialesConstruccion)}{" "}
						{evaluation.otrosMaterialesConstruccion
							? `(Otros: ${evaluation.otrosMaterialesConstruccion})`
							: ""}
					</Text>
				</View>
				<View style={styles.tableRow}>
					<Text style={[styles.tableColHeader, { flex: 1 }]}>Vías de Acceso</Text>
					<Text style={[styles.tableCol, { flex: 5 }]}>
						{join(evaluation.viasAcceso)}{" "}
						{evaluation.otrosViasAcceso
							? `(Otras: ${evaluation.otrosViasAcceso})`
							: ""}
					</Text>
				</View>
			</View>
	
			{/* --- SECCIÓN 5: AFECTACIONES Y PÉRDIDAS --- */}
			<View style={styles.table} wrap={false}>
				<View style={styles.seccionTitulo}>
					<Text>5. AFECTACIONES Y PÉRDIDAS</Text>
				</View>
				<View style={styles.tableRow}>
					<Text style={[styles.tableColHeader, { flex: 1 }]}>
						Condición Vivienda
					</Text>
					<Text style={[styles.tableCol, { flex: 3 }]}>
						{evaluation.condicionVivienda}{" "}
						{evaluation.otrosCondicionVivienda
							? `(${evaluation.otrosCondicionVivienda})`
							: ""}
					</Text>
				</View>
				<View style={styles.tableRowAlternate}>
					<Text style={[styles.tableColHeader, { flex: 1 }]}>
						Afect. Estructurales
					</Text>
					<Text style={[styles.tableCol, { flex: 3 }]}>
						{join(evaluation.afectacionesEstructuralesColapso)}{" "}
						{evaluation.otrosEstructuralesColapso
							? `(Otros: ${evaluation.otrosEstructuralesColapso})`
							: ""}
					</Text>
				</View>
				<View style={styles.tableRow}>
					<Text style={[styles.tableColHeader, { flex: 1 }]}>
						Afect. Parciales
					</Text>
					<Text style={[styles.tableCol, { flex: 3 }]}>
						{join(evaluation.afectacionesParciales)}{" "}
						{evaluation.otrosAfectacionesParciales
							? `(Otros: ${evaluation.otrosAfectacionesParciales})`
							: ""}
					</Text>
				</View>
				<View style={styles.tableRowAlternate}>
					<Text style={[styles.tableColHeader, { flex: 1 }]}>
						Afect. No Estructurales
					</Text>
					<Text style={[styles.tableCol, { flex: 3 }]}>
						{join(evaluation.afectacionesNoEstructurales)}{" "}
						{evaluation.otrosNoEstructurales
							? `(Otros: ${evaluation.otrosNoEstructurales})`
							: ""}
					</Text>
				</View>
				<View style={styles.tableRow}>
					<Text style={[styles.tableColHeader, { flex: 1 }]}>
						Pérdida de Enseres
					</Text>
					<Text style={[styles.tableCol, { flex: 3 }]}>
						{join(evaluation.perdidasEnseres)}{" "}
						{evaluation.otrosPerdidasEnseres
							? `(Otros: ${evaluation.otrosPerdidasEnseres})`
							: ""}
					</Text>
				</View>
				<View style={styles.tableRowAlternate}>
					<Text style={[styles.tableColHeader, { flex: 1 }]}>Líneas Vitales</Text>
					<Text style={[styles.tableCol, { flex: 3 }]}>
						{join(evaluation.lineasVitalesAfectadas)}{" "}
						{evaluation.otrosLineasVitalesAfectadas
							? `(Otras: ${evaluation.otrosLineasVitalesAfectadas})`
							: ""}
					</Text>
				</View>
			</View>
	
			{/* --- SECCIÓN 6: NECESIDADES Y ALOJAMIENTO --- */}
			<View style={styles.table} wrap={false}>
				<View style={styles.seccionTitulo}>
					<Text>6. NECESIDADES Y ALOJAMIENTO</Text>
				</View>
				<View style={styles.tableRow}>
					<Text style={[styles.tableColHeader, { flex: 1 }]}>
						Necesidades Inmediatas
					</Text>
					<Text style={[styles.tableCol, { flex: 3 }]}>
						{join(evaluation.necesidadesInmediatas)}
					</Text>
				</View>
							<View style={styles.tableRowAlternate}>
								<Text style={[styles.tableColHeader, { flex: 1 }]}>
									Vivienda Solidaria
								</Text>
								<Text style={[styles.tableCol, { flex: 1, textAlign: "center" }]}>
									{evaluation.viviendaSolidaria ? "Sí" : "No"}
								</Text>
								<Text style={[styles.tableColHeader, { flex: 1 }]}>Albergue</Text>
								<Text style={[styles.tableCol, { flex: 1, textAlign: "center" }]}>
									{evaluation.albergue ? "Sí" : "No"}
								</Text>
							</View>				{evaluation.albergue && (
					<View>
						<View style={styles.tableRow}>
							<Text style={[styles.tableColHeader, { flex: 1 }]}>
								Responsable Albergue
							</Text>
							<Text style={[styles.tableCol, { flex: 3 }]}>
								{evaluation.nombreResponsableAlbergue} (C.I:{" "}
								{evaluation.cedulaResponsableAlbergue})
							</Text>
						</View>
						<View style={styles.tableRowAlternate}>
							<Text style={[styles.tableColHeader, { flex: 1 }]}>
								Contacto Albergue
							</Text>
							<Text style={[styles.tableCol, { flex: 3 }]}>
								{evaluation.direccionAlbergue} /{" "}
								{evaluation.telefonoContactoAlbergue}
							</Text>
						</View>
					</View>
				)}
			</View>
	
			{/* --- SECCIÓN 7: OBSERVACIONES --- */}
			<View style={styles.table} wrap={false}>
				<View style={styles.seccionTitulo}>
					<Text>7. OBSERVACIONES GENERALES</Text>
				</View>
				<Text style={styles.fullWidthText}>
					{evaluation.observaciones || "Sin observaciones."}
				</Text>
			</View>
			{/* --- SECCIÓN 8: IMÁGENES --- */}
			<View style={styles.table} wrap={false}>
				<View style={styles.seccionTitulo}>
					<Text>8. IMÁGENES </Text>
				</View>
				<View style={[styles.imagenes, { justifyContent: "center", alignItems: "center" }]}>
					{evaluation.fotosAdicionales?.map((url, index) => (
						<View key={index} style={{ marginBottom: 10 }}>
							<Image style={styles.foto} src={url} />
						</View>
					))}
				</View>
			</View>
	
			{/* --- SECCIÓN 9: FIRMAS --- */}
			<View style={[styles.flexRow, { paddingTop: 10, gap: 40 }]} wrap={false}>
				<View style={styles.flexCol}>
					<Text
						style={{
							textAlign: "center",
							fontSize: 8,
							fontFamily: "Helvetica-Bold",
						}}
					>
						JEFE DE FAMILIA / EVALUADO
					</Text>
					<View style={styles.signatureBox}>
						{evaluation.firmaEvaluado && (
							<Image
								src={evaluation.firmaEvaluado}
								style={{ width: "100%", height: "100%" }}
							/>
						)}
					</View>
					<View style={styles.signatureName}>
						<Text>{evaluation.nombreEvaluado || evaluation.jefeFamilia}</Text>
						<Text>C.I: {evaluation.cedulaEvaluado || evaluation.cedulaJefe}</Text>
						<Text>
							Telf:{" "}
							{evaluation.telefonoEvaluado || evaluation.telefonoJefeFamilia}
						</Text>
					</View>
				</View>
				<View style={styles.flexCol}>
					<Text
						style={{
							textAlign: "center",
							fontSize: 8,
							fontFamily: "Helvetica-Bold",
						}}
					>
						ANALISTA DE RIESGO / EVALUADOR
					</Text>
					<View style={styles.signatureBox}>
						{evaluation.firmaEvaluador && (
							<Image
								src={evaluation.firmaEvaluador}
								style={{ width: "100%", height: "100%" }}
							/>
						)}
					</View>
					<View style={styles.signatureName}>
						<Text>{evaluation.nombreEvaluador}</Text>
						<Text>C.I: {evaluation.cedulaEvaluador}</Text>
						<Text>Telf: {evaluation.telefonoEvaluador}</Text>
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
	);
	
	export const PlanillaEdanPDF = ({ evaluation }: { evaluation: Evaluation }) => (
		<Document>
			<PlanillaPage evaluation={evaluation} key={evaluation.id} />
		</Document>
	);

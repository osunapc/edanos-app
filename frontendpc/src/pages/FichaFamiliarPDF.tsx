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
		paddingTop: 35,
		paddingBottom: 65,
		paddingHorizontal: 35,
		fontFamily: "Helvetica",
		fontSize: 10,
		backgroundColor: "#f9f9f9",
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
		fontSize: 10,
		bottom: 25,
		left: 0,
		right: 0,
		textAlign: "center",
		color: "grey",
	},
	title: {
		fontSize: 18,
		textAlign: "center",
		marginBottom: 10,
		marginTop: 10,
		fontFamily: "Helvetica-Bold",
		color: "#d65a00",
	},
	seccionTitulo: {
		backgroundColor: "#FFA500",
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
		padding: 5,
		fontSize: 12,
	},
	observaciones: {
		backgroundColor: "#FFF3E0",
		padding: 10,
		border: "1px solid #FFDDC1",
		marginTop: 10,
		borderRadius: 5,
	},
	clearfix: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 10,
		gap: 10,
	},
	fotoContainer: {
		width: 140,
		height: 160,
		border: "1px solid #FFDDC1",
		borderRadius: 5,
		padding: 4,
		backgroundColor: "white",
	},
	foto: {
		width: "100%",
		height: 130,
		objectFit: "cover",
	},
	viviendaNro: {
		textAlign: "center",
		marginTop: 5,
		fontFamily: "Helvetica-Bold",
		fontSize: 9,
	},
	table: {
		display: "flex",
		width: "auto",
		borderStyle: "solid",
		borderWidth: 1,
		borderColor: "#FFDDC1",
		marginBottom: 10,
		borderRadius: 5,
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
		padding: 6,
		textAlign: "left",
		fontFamily: "Helvetica-Bold",
		fontSize: 9,
		borderRight: "1px solid #FFA500",
	},
	tableCol: {
		padding: 5,
		textAlign: "left",
		fontSize: 9,
		borderRight: "1px solid #FFDDC1",
	},
	subtitle: {
		fontSize: 9,
		textAlign: "center",
		marginBottom: 12,
		fontFamily: "Helvetica",
		color: "grey",
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

export const FichaFamiliarPDF = ({ data }: { data: Evaluation[] }) => (
  <Document>
    {data.map((evaluation, index) => (
      <Page size="A4" style={styles.page} key={index}>
        <Image src={header} style={styles.headerImage} fixed />
        <View style={{ paddingTop: 50 }}>
          <Text style={styles.title}>FICHA EDANOS</Text>
                  <Text style={styles.subtitle}>Generado el: {getCurrentDate()}</Text>
          
        </View>

        <View style={styles.clearfix}>
          <View style={{ flex: 1 }}>
            <View style={styles.table}>
              <View style={styles.seccionTitulo}>
                <Text>Datos de Ubicación</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.tableColHeader, { flex: 0.4 }]}>Estado</Text>
                <Text style={[styles.tableCol, { flex: 0.6 }]}>{evaluation.estado || ""}</Text>
              </View>
              <View style={styles.tableRowAlternate}>
                <Text style={[styles.tableColHeader, { flex: 0.4 }]}>Municipio</Text>
                <Text style={[styles.tableCol, { flex: 0.6 }]}>{evaluation.municipio || ""}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.tableColHeader, { flex: 0.4 }]}>Parroquia</Text>
                <Text style={[styles.tableCol, { flex: 0.6 }]}>{evaluation.parroquia || ""}</Text>
              </View>
              <View style={styles.tableRowAlternate}>
                <Text style={[styles.tableColHeader, { flex: 0.4 }]}>Sector</Text>
                <Text style={[styles.tableCol, { flex: 0.6 }]}>{evaluation.barrioSector || ""}</Text>
              </View>
            </View>
          </View>
          <View style={styles.fotoContainer}>
            {evaluation.fotoFamiliar && (
              <Image style={styles.foto} src={evaluation.fotoFamiliar} />
            )}
            <Text style={styles.viviendaNro}>Vivienda N° {evaluation.id}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.seccionTitulo}>
            <Text>Grupo Familiar</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableColHeader, { flex: 2 }]}>Nombre</Text>
            <Text style={[styles.tableColHeader, { flex: 1 }]}>C.I.</Text>
            <Text style={[styles.tableColHeader, { flex: 0.5, textAlign: 'center' }]}>Edad</Text>
            <Text style={[styles.tableColHeader, { flex: 1 }]}>Rol</Text>
            <Text style={[styles.tableColHeader, { flex: 0.4, textAlign: 'center' }]}>C</Text>
            <Text style={[styles.tableColHeader, { flex: 0.4, textAlign: 'center' }]}>P</Text>
            <Text style={[styles.tableColHeader, { flex: 0.4, textAlign: 'center' }]}>Z</Text>
            <Text style={[styles.tableColHeader, { flex: 2, borderRightWidth: 0 }]}>Patología - Medicamento</Text>
          </View>
          {[
            {
              apellidosNombres: evaluation.jefeFamilia,
              cedula: evaluation.cedulaJefe,
              edad: evaluation.edadJefe,
              parentesco: "Jefe de Familia",
              tallaC: evaluation.tallaC,
              tallaP: evaluation.tallaP,
              tallaZ: evaluation.tallaZ,
              patologias: evaluation.patologiasJefe,
            },
            ...evaluation.grupoFamiliar,
          ].map((miembro, i) => (
            <View style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlternate} key={i}>
              <Text style={[styles.tableCol, { flex: 2 }]}>{miembro.apellidosNombres || "N/A"}</Text>
              <Text style={[styles.tableCol, { flex: 1 }]}>{miembro.cedula || "N/P"}</Text>
              <Text style={[styles.tableCol, { flex: 0.5, textAlign: 'center' }]}>{miembro.edad || "N/A"}</Text>
              <Text style={[styles.tableCol, { flex: 1 }]}>{miembro.parentesco || "N/A"}</Text>
              <Text style={[styles.tableCol, { flex: 0.4, textAlign: 'center' }]}>{miembro.tallaC || ""}</Text>
              <Text style={[styles.tableCol, { flex: 0.4, textAlign: 'center' }]}>{miembro.tallaP || ""}</Text>
              <Text style={[styles.tableCol, { flex: 0.4, textAlign: 'center' }]}>{miembro.tallaZ || ""}</Text>
              <Text style={[styles.tableCol, { flex: 2, borderRightWidth: 0 }]}>{miembro.patologias || ""}</Text>
            </View>
          ))}
        </View>

        <View style={styles.table}>
          <View style={styles.seccionTitulo}>
            <Text>Información Preliminar</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>{evaluation.informacionPreliminar || "No disponible."}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.seccionTitulo}>
            <Text>Detalles de la Vivienda</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCol, { flex: 1, fontFamily: "Helvetica-Bold" }]}>Tipo de afectación:</Text>
            <Text style={[styles.tableCol, { flex: 2 }]}>{evaluation.condicionVivienda || ""}</Text>
          </View>
          <View style={styles.tableRowAlternate}>
            <Text style={[styles.tableCol, { flex: 1, fontFamily: "Helvetica-Bold" }]}>Pérdidas de Enseres:</Text>
            <Text style={[styles.tableCol, { flex: 2 }]}>- {evaluation.perdidasEnseres.join("\n- ")}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCol, { flex: 1, fontFamily: "Helvetica-Bold" }]}>Contacto Jefe de Familia:</Text>
            <Text style={[styles.tableCol, { flex: 2 }]}>{evaluation.telefonoJefeFamilia || ""}</Text>
          </View>
        </View>

        <View style={styles.observaciones}>
          <Text style={{ fontFamily: "Helvetica-Bold", marginBottom: 4 }}>Observaciones Generales:</Text>
          <Text>{evaluation.observaciones || "Sin observaciones"}</Text>
        </View>

        <Image src={footer} style={styles.footer} fixed />
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`}
          fixed
        />
      </Page>
    ))}
  </Document>
);


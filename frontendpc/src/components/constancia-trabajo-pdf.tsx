import {
	Document,
	Page,
	Text,
	View,
	StyleSheet,
	Image,
} from "@react-pdf/renderer";
import { User } from "../type/type";
import footer from "/src/assets/footer.png";
import header from "/src/assets/header.png";
import firma from "/src/assets/firma.png";

// Definir estilos para el PDF
const styles = StyleSheet.create({
	page: {
		padding: 30,
		fontSize: 12,
		fontFamily: "Helvetica",
	},
	header: {
		marginBottom: 50,
		textAlign: "center",
		position: "relative",
	},
	title: {
		fontSize: 16,
		fontWeight: "bold",
		marginBottom: 20,
		textAlign: "center",
	},
	membrete: {
		textAlign: "left",
		marginLeft: 150,
		marginTop: 20,
	},
	textmemb: {
		fontSize: 9,
	},
	paragraph: {
		marginBottom: 10,
		textAlign: "justify",
		lineHeight: 1,
	},
	signature: {
		marginTop: 0,
		textAlign: "center",
		//position: "relative"
	},
	footer: {
		marginTop: 40,
		fontSize: 10,
		textAlign: "center",
	},
	bold: {
		fontWeight: "bold",
	},
	imagefirma: {
		//position: "absolute",
		top: 0,
		width: "50%",
		margin: "0 auto",
		marginBottom: 0,
		zIndex: 100, // Para que quede detrás del texto
	},
	headerbg: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		width: "100%",
		height: "80",
		zIndex: -1,
	},
	footerbg: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		width: "100%",
		height: 70,
		zIndex: -1,
	},
});

// Función para obtener la fecha actual formateada
const getCurrentDate = () => {
	const date = new Date();
	const day = date.getDate();
	const monthNames = [
		"enero",
		"febrero",
		"marzo",
		"abril",
		"mayo",
		"junio",
		"julio",
		"agosto",
		"septiembre",
		"octubre",
		"noviembre",
		"diciembre",
	];
	const month = monthNames[date.getMonth()];
	const year = date.getFullYear();

	return `${day} días del mes de ${month} de ${year}`;
};

// Componente para generar el PDF
export const ConstanciaTrabajoPDF = ({ user }: { user: User }) => (
	<Document>
		<Page size="A4" style={styles.page}>
			<View style={styles.header}>
				<Image src={header} style={styles.headerbg} />
				<View style={styles.membrete}>
					<Text style={styles.textmemb}>
						República Bolivariana de Venezuela
					</Text>
					<Text style={styles.textmemb}>
						Gobernación del Estado Bolivariano de Mérida
					</Text>
					<Text style={styles.textmemb}>
						Instituto de Protección Civil, Administración de Desastres y Gestión
						de Riesgos
					</Text>
					<Text style={styles.textmemb}>del Estado Bolivariano de Mérida.</Text>
				</View>
			</View>

			<View style={styles.title}>
				<Text>CONSTANCIA DE TRABAJO</Text>
			</View>

			<View style={styles.paragraph}>
				<Text>
					Quien suscribe T.S.U. Mariana Carolina Cazorla Rangel, portadora de la
					cedula de identidad V-15.267.679, en mi condición de Directora de
					Gestión de Talento Humano del Instituto de Protección Civil
					Administración de Desastres y Gestión de Riesgos del Estado
					Bolivariano de Mérida (Protección Civil Mérida), Designada según
					Resolución Nº PCM-DG-RND-003-2024 01/01/2024, por medio la presente:
				</Text>
			</View>

			<View style={styles.title}>
				<Text style={styles.bold}>HAGO CONSTAR QUE</Text>
			</View>

			<View style={styles.paragraph}>
				<Text>
					{`El/la ciudadano/a:`}
					<Text style={styles.bold}>
						{" "}
						{user.nombre} {user.apellido}
					</Text>
					{`, portadora de la cédula de identidad N° V-`}
					<Text style={styles.bold}>{user.cedula}</Text>
					{`; labora en el Instituto de Protección Civil, Administración de Desastres y Gestión de Riesgos del Estado Bolivariano de Mérida, desde el `}
					<Text style={styles.bold}>{user.createdAt}</Text>
					{`, actualmente se desempeña en el cargo como `}
					<Text style={styles.bold}>{user.cargo}</Text>
					{`, adscrita al`} <Text style={styles.bold}>{user.ubicacion}.</Text>
				</Text>
			</View>

			<View style={styles.paragraph}>
				<Text>
					{`Constancia que se expide a solicitud de la parte interesada, en Mérida a los ${getCurrentDate()}.`}
				</Text>
			</View>

			<View style={styles.signature}>
				<Image src={firma} style={styles.imagefirma} />
				<Text>T.S.U Mariana Carolina Cazorla Rangel</Text>
				<Text>Directora de Gestión de Talento Humano</Text>
				<Text>
					Del Instituto de Protección Civil Administración de Desastres y
					Gestión
				</Text>
				<Text>
					de Riesgos del Estado Bolivariano de Mérida (Protección Civil Mérida)
				</Text>
				<Text>
					Designada según resolución Nº PCM-DG-RND-003-2024 01/01/2024
				</Text>
				<Text>Gaceta Oficial Nº5596 de fecha 20 de junio de 2024</Text>
			</View>

			<View style={styles.footer}>
				<Text>
					Documento válido por 90 días a partir de la fecha de emisión
				</Text>
				<Text>PCM-GTH-CT000/00/0000</Text>
			</View>
			<view>
				<Image src={footer} style={styles.footerbg} />
			</view>
		</Page>
	</Document>
);

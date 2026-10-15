import { Evaluation } from "../type/type";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "../components/uiredix/card";
import { Button } from "./uiredix/button";

interface DetalleEdanModalProps {
	isOpen: boolean;
	onClose: () => void;
	evaluation: Evaluation | null;
}

const DetailItem = ({
	label,
	value,
}: {
	label: string;
	value: React.ReactNode;
}) => {
	if (value === undefined || value === null || value === "") return null;
	return (
		<div>
			<p className="text-sm font-semibold text-orange-400">{label}</p>
			<div className="text-base text-white">{value}</div>
		</div>
	);
};

const Section = ({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) => (
	<div className="mb-6">
		<h3 className="text-lg font-bold text-blue-400 border-b border-zinc-600 pb-2 mb-3">
			{title}
		</h3>
		<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
			{children}
		</div>
	</div>
);

export const DetalleEdanModal = ({
	isOpen,
	onClose,
	evaluation,
}: DetalleEdanModalProps) => {
	if (!isOpen || !evaluation) return null;

	return (
		<div
			className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center p-4"
			onClick={onClose}
		>
			<div
				className="bg-zinc-900 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto"
				onClick={(e) => e.stopPropagation()}
			>
				<Card className="border-orange-500 bg-transparent">
					<CardHeader>
						<CardTitle className="text-orange-500">
							Detalle Completo de la Evaluación EDAN
						</CardTitle>
					</CardHeader>
					<CardContent>
						<Section title="I. Ubicación Geográfica">
							<DetailItem label="Estado" value={evaluation.estado} />
							<DetailItem label="Municipio" value={evaluation.municipio} />
							<DetailItem label="Parroquia" value={evaluation.parroquia} />
							<DetailItem
								label="Cuadrante de Paz"
								value={evaluation.cuadranteDePaz}
							/>
							<DetailItem
								label="Sector/Barrio"
								value={evaluation.barrioSector}
							/>
							<DetailItem
								label="Urbanización"
								value={evaluation.urbanizacion}
							/>
							<DetailItem label="Calle/Avenida" value={evaluation.calle} />
							<DetailItem label="Avenida" value={evaluation.avenida} />
							<DetailItem label="Vereda" value={evaluation.vereda} />
							<DetailItem label="Casa" value={evaluation.casa} />
							<DetailItem label="Apto" value={evaluation.apto} />
						</Section>

						<Section title="Coordenadas">
							<DetailItem label="Latitud" value={evaluation.latitud} />
							<DetailItem label="Longitud" value={evaluation.longitud} />
							<DetailItem label="Cota" value={evaluation.cota} />
							<DetailItem label="Este" value={evaluation.este} />
							<DetailItem label="Norte" value={evaluation.norte} />
							<DetailItem label="Huso" value={evaluation.huso} />
						</Section>

						<Section title="II. Información del Evento">
							<DetailItem
								label="Fecha del Evento"
								value={
									evaluation.fechaEvento
										? new Date(evaluation.fechaEvento).toLocaleDateString()
										: "N/A"
								}
							/>
							<DetailItem
								label="Hora del Evento"
								value={evaluation.horaEvento}
							/>
							<DetailItem
								label="Tipo de Evento"
								value={evaluation.tipoEvento}
							/>
						</Section>

						<Section title="Información Preliminar">
							<DetailItem
								label="Información Preliminar"
								value={evaluation.informacionPreliminar}
							/>
						</Section>

						<Section title="III. Datos del Jefe(a) de Familia">
							<DetailItem
								label="Apellidos Jefe de Calle"
								value={evaluation.apellidosJefe}
							/>
							<DetailItem
								label="Nombres Jefe de Calle"
								value={evaluation.nombresJefe}
							/>
							<DetailItem
								label="Nombre Completo"
								value={evaluation.jefeFamilia}
							/>
							<DetailItem label="Cédula" value={evaluation.cedulaJefe} />
							<DetailItem
								label="Teléfono"
								value={evaluation.telefonoJefeFamilia}
							/>
							<DetailItem label="Edad" value={evaluation.edadJefe} />
							<DetailItem label="Sexo" value={evaluation.sexoJefe} />
							<DetailItem label="Talla Camisa" value={evaluation.tallaC} />
							<DetailItem label="Talla Pantalón" value={evaluation.tallaP} />
							<DetailItem label="Talla Zapatos" value={evaluation.tallaZ} />
							<DetailItem
								label="Patologías"
								value={evaluation.patologiasJefe}
							/>
							<DetailItem
								label="Teléfono Jefe de Calle"
								value={evaluation.telefonoJefe}
							/>
						</Section>

						<Section title="IV. Características de la Estructura">
							<DetailItem
								label="Uso de la Estructura"
								value={evaluation.usoEstructura}
							/>
							<DetailItem
								label="Condición de la Vivienda"
								value={evaluation.condicionVivienda}
							/>
							<DetailItem
								label="Otra Condición Vivienda"
								value={evaluation.otrosCondicionVivienda}
							/>
							<DetailItem
								label="Otros Usos"
								value={evaluation.otrosUsoEstructura}
							/>
							<DetailItem
								label="Vías de Acceso"
								value={evaluation.viasAcceso?.join(", ")}
							/>
							<DetailItem
								label="Condición de Acceso"
								value={evaluation.condicionAcceso}
							/>
							<DetailItem
								label="Otra Condición de Acceso"
								value={evaluation.otrosCondicionAcceso}
							/>
							<DetailItem
								label="Otras Vías de Acceso"
								value={evaluation.otrosViasAcceso}
							/>
							<DetailItem
								label="Materiales (Paredes)"
								value={evaluation.materialesConstruccion?.join(", ")}
							/>
							<DetailItem
								label="Otros Materiales"
								value={evaluation.otrosMaterialesConstruccion}
							/>
						</Section>

						<Section title="V. Afectaciones y Pérdidas">
							<DetailItem
								label="Afectaciones No Estructurales"
								value={evaluation.afectacionesNoEstructurales?.join(", ")}
							/>
							<DetailItem
								label="Otras Afectaciones No Estructurales"
								value={evaluation.otrosNoEstructurales}
							/>
							<DetailItem
								label="Afectaciones Estructurales (Parciales)"
								value={evaluation.afectacionesParciales?.join(", ")}
							/>
							<DetailItem
								label="Otras Afectaciones Parciales"
								value={evaluation.otrosAfectacionesParciales}
							/>
							<DetailItem
								label="Afectaciones Estructurales (Colapso)"
								value={evaluation.afectacionesEstructuralesColapso?.join(", ")}
							/>
							<DetailItem
								label="Otras Afectaciones (Colapso)"
								value={evaluation.otrosEstructuralesColapso}
							/>
							<DetailItem
								label="Pérdidas de Enseres"
								value={evaluation.perdidasEnseres?.join(", ")}
							/>
							<DetailItem
								label="Otras Pérdidas de Enseres"
								value={evaluation.otrosPerdidasEnseres}
							/>
							<DetailItem
								label="Líneas Vitales Afectadas"
								value={evaluation.lineasVitalesAfectadas?.join(", ")}
							/>
							<DetailItem
								label="Otras Líneas Vitales Afectadas"
								value={evaluation.otrosLineasVitalesAfectadas}
							/>
						</Section>

						<Section title="VI. Necesidades y Observaciones">
							<DetailItem
								label="Necesidades Inmediatas"
								value={evaluation.necesidadesInmediatas?.join(", ")}
							/>
							<DetailItem
								label="Observaciones"
								value={evaluation.observaciones}
							/>
						</Section>

						<Section title="Apoyo y Refugio">
							<DetailItem
								label="Vivienda Solidaria"
								value={evaluation.viviendaSolidaria ? "Sí" : "No"}
							/>
							<DetailItem
								label="Albergue"
								value={evaluation.albergue ? "Sí" : "No"}
							/>
							<DetailItem
								label="Teléfono Contacto Albergue"
								value={evaluation.telefonoContactoAlbergue}
							/>
							<DetailItem
								label="Dirección Albergue"
								value={evaluation.direccionAlbergue}
							/>
							<DetailItem
								label="Nombre Responsable Albergue"
								value={evaluation.nombreResponsableAlbergue}
							/>
							<DetailItem
								label="Cédula Responsable Albergue"
								value={evaluation.cedulaResponsableAlbergue}
							/>
						</Section>

						<Section title="VII. Datos de la Evaluación">
							<DetailItem
								label="Nombre del Evaluador"
								value={evaluation.nombreEvaluador}
							/>
							<DetailItem
								label="Cédula del Evaluador"
								value={evaluation.cedulaEvaluador}
							/>
							<DetailItem
								label="Teléfono del Evaluador"
								value={evaluation.telefonoEvaluador}
							/>
							<DetailItem
								label="Nombre del Evaluado"
								value={evaluation.nombreEvaluado}
							/>
							<DetailItem
								label="Cédula del Evaluado"
								value={evaluation.cedulaEvaluado}
							/>
							<DetailItem
								label="Teléfono del Evaluado"
								value={evaluation.telefonoEvaluado}
							/>
							<DetailItem
								label="Fecha de Creación"
								value={new Date(evaluation.createdAt).toLocaleString()}
							/>
							<DetailItem
								label="Última Actualización"
								value={new Date(evaluation.updatedAt).toLocaleString()}
							/>
						</Section>

						<Section title="Imágenes">
							{evaluation.fotoFamiliar && (
								<DetailItem
									label="Foto Familiar"
									value={
										<img
											src={evaluation.fotoFamiliar}
											alt="Foto Familiar"
											className="w-32 h-32 object-cover rounded-md"
										/>
									}
								/>
							)}
							{evaluation.fotosAdicionales &&
								evaluation.fotosAdicionales.map((foto, index) => (
									<DetailItem
										key={index}
										label={`Foto Adicional ${index + 1}`}
										value={
											<img
												src={foto}
												alt={`Foto Adicional ${index + 1}`}
												className="w-32 h-32 object-cover rounded-md"
											/>
										}
									/>
								))}
						</Section>

						<Section title="Firmas">
							{evaluation.firmaEvaluador && (
								<DetailItem
									label="Firma del Evaluador"
									value={
										<img
											src={evaluation.firmaEvaluador}
											alt="Firma Evaluador"
											className="bg-white p-1 rounded"
										/>
									}
								/>
							)}
							{evaluation.firmaEvaluado && (
								<DetailItem
									label="Firma del Evaluado"
									value={
										<img
											src={evaluation.firmaEvaluado}
											alt="Firma Evaluado"
											className="bg-white p-1 rounded"
										/>
									}
								/>
							)}
						</Section>

						<div className="flex justify-end mt-6">
							<Button
								variant="destructive"
								onClick={onClose}
								className="bg-orange-500 hover:bg-orange-600"
							>
								Cerrar
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

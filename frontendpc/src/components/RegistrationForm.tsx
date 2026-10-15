import { useState } from "react";
import {
	Upload,
	Send,
	CheckCircle,
	AlertCircle,
	FileText,
	Building2,
	User,
} from "lucide-react";
import { API_URL } from "../conf/constnts";
import { Modal } from "./Modal";

const ESTADOS_VENEZUELA = [
	"Amazonas",
	"Anzoátegui",
	"Apure",
	"Aragua",
	"Barinas",
	"Bolívar",
	"Carabobo",
	"Cojedes",
	"Delta Amacuro",
	"Distrito Capital",
	"Falcón",
	"Guárico",
	"Lara",
	"Mérida",
	"Miranda",
	"Monagas",
	"Nueva Esparta",
	"Portuguesa",
	"Sucre",
	"Táchira",
	"Trujillo",
	"Vargas",
	"Yaracuy",
	"Zulia",
];

const TIPOS_INSTITUCION = [
	"Protección Civil",
	"Bomberos",
	"911",
	"Grupos Voluntarios",
];

export function RegistrationForm() {
	const [formData, setFormData] = useState({
		nombreInstitucion: "",
		tipoInstitucion: "",
		nivelCuenta: "municipal", // Default: municipal
		estado: "",
		municipio: "",
		nombreResponsable: "",
		cargo: "",
		cedula: "",
		email: "",
		telefono: "",
	});

	const [pdfFile, setPdfFile] = useState<File | null>(null);
	const [uploading, setUploading] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState("");

	// Modal state: null = cerrado, 'error' = error PDF, 'success' = registro exitoso
	const [modalState, setModalState] = useState<"error" | "success" | null>(
		null,
	);
	const [modalMessage, setModalMessage] = useState<React.ReactNode>(null);
	const [modalTitle, setModalTitle] = useState<string>("");

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];

		if (!file) return;

		if (file.type !== "application/pdf") {
			setError("Solo se permiten archivos PDF");
			return;
		}

		if (file.size > 5 * 1024 * 1024) {
			setError("El archivo no puede superar 5MB");
			return;
		}

		setError("");
		setPdfFile(file);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		//console.log("Iniciando proceso de envío...", formData);
		setError("");

		if (!pdfFile) {
			console.warn("Intento de envío sin archivo PDF seleccionado");
			setModalTitle("⚠️ PDF Requerido");
			setModalMessage(null); // Usa el mensaje por defecto del modal para PDF
			setModalState("error");
			return;
		}

		setSubmitting(true);
		setUploading(true);

		try {
			// 1. Subir el PDF primero
			//console.log("Subiendo PDF...");
			const formDataUpload = new FormData();
			formDataUpload.append("cartaFormal", pdfFile);

			const uploadResponse = await fetch(
				`${API_URL}/api/registration-request/upload-carta`,
				{
					method: "POST",
					body: formDataUpload,
				},
			);

			if (!uploadResponse.ok) {
				throw new Error("Error al subir el archivo PDF");
			}

			const uploadData = await uploadResponse.json();
			//console.log("PDF subido, respuesta:", uploadData);

			let uploadedUrl = "";
			if (uploadData.url) {
				uploadedUrl = uploadData.url;
			} else if (Array.isArray(uploadData) && uploadData.length > 0) {
				uploadedUrl = uploadData[0];
			}

			if (!uploadedUrl) {
				throw new Error("No se pudo obtener la URL del archivo subido");
			}

			// 2. Enviar el formulario con la URL del PDF
			const payload = {
				...formData,
				cartaFormalUrl: uploadedUrl,
			};
			//console.log("Enviando datos de registro:", payload);

			const response = await fetch(`${API_URL}/api/registration-request`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			//console.log("Respuesta registro status:", response.status);

			if (!response.ok) {
				const errorData = await response.json();
				console.error("Error registro backend:", errorData);
				// Lanzar error con el mensaje del backend
				throw new Error(errorData.error || "Error al enviar la solicitud");
			}

			//const responseData = await response.json();
			//console.log("Registro exitoso:", responseData);

			// Mostrar modal de éxito
			setModalTitle(""); // Usa título por defecto
			setModalMessage(null); // Usa mensaje por defecto
			setModalState("success");

			// Limpiar formulario
			setFormData({
				nombreInstitucion: "",
				tipoInstitucion: "",
				nivelCuenta: "municipal",
				estado: "",
				municipio: "",
				nombreResponsable: "",
				cargo: "",
				cedula: "",
				email: "",
				telefono: "",
			});
			setPdfFile(null);
		} catch (err: unknown) {
			console.error("Error en el proceso:", err);
			const errorMessage =
				err instanceof Error ?
					err.message
				:	"Ocurrió un error inesperado. Por favor intente nuevamente.";
			// Mostrar error en el modal en lugar del banner superior
			setModalTitle("❌ Error en el Registro");
			setModalMessage(errorMessage);
			setModalState("error");
		} finally {
			setSubmitting(false);
			setUploading(false);
		}
	};

	return (
		<>
			{/* Modal Reutilizable */}
			{modalState && (
				<Modal
					type={modalState}
					isOpen={true}
					onClose={() => setModalState(null)}
					title={modalTitle}
					message={modalMessage}
				/>
			)}

			<form onSubmit={handleSubmit} className="max-w-6xl mx-auto">
				{error && (
					<div className="p-3 bg-red-500/10 border-2 border-red-500/50 rounded-lg flex items-start gap-2 mb-4">
						<AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
						<p className="text-red-400 text-sm font-semibold">{error}</p>
					</div>
				)}

				<div className="grid lg:grid-cols-2 gap-4">
					{/* COLUMNA IZQUIERDA: Información */}
					<div className="space-y-4">
						{/* Información de la Institución */}
						<div className="p-4 bg-gradient-to-br from-orange-500/10 to-slate-900/50 border-2 border-orange-500/30 rounded-xl">
							<div className="flex items-center gap-2 mb-3">
								<div className="p-2 bg-orange-500/20 rounded-lg">
									<Building2 className="w-5 h-5 text-orange-400" />
								</div>
								<h3 className="text-lg font-black text-orange-400">
									Información de la Institución
								</h3>
							</div>

							<div className="space-y-3">
								<div>
									<label className="block text-gray-300 text-sm font-semibold mb-1">
										Nombre de la Institución *
									</label>
									<input
										type="text"
										name="nombreInstitucion"
										value={formData.nombreInstitucion}
										onChange={handleChange}
										required
										className="w-full px-3 py-2 bg-slate-800 border-2 border-slate-700 text-white text-sm rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
										placeholder="Ej: Protección Civil Libertador"
									/>
								</div>

								<div>
									<label
										htmlFor="tipoInstitucion"
										className="block text-gray-300 text-sm font-semibold mb-1"
									>
										Tipo de Institución *
									</label>
									<select
										id="tipoInstitucion"
										name="tipoInstitucion"
										value={formData.tipoInstitucion}
										onChange={handleChange}
										required
										className="w-full px-3 py-2 bg-slate-800 border-2 border-slate-700 text-white text-sm rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
									>
										<option value="">Seleccione...</option>
										{TIPOS_INSTITUCION.map((tipo) => (
											<option key={tipo} value={tipo}>
												{tipo}
											</option>
										))}
									</select>
								</div>

								<div>
									<label
										htmlFor="nivelCuenta"
										className="block text-gray-300 text-sm font-semibold mb-1"
									>
										Nivel de Cuenta *
									</label>
									<select
										id="nivelCuenta"
										name="nivelCuenta"
										value={formData.nivelCuenta}
										onChange={handleChange}
										required
										className="w-full px-3 py-2 bg-slate-800 border-2 border-slate-700 text-white text-sm rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
									>
										<option value="municipal">
											Municipal (Anclada a Estado)
										</option>
										<option value="estadal">Estadal (Una por Estado)</option>
									</select>
									<p className="text-xs text-gray-400 mt-1">
										{formData.nivelCuenta === "estadal" ?
											"⚠️ Solo puede haber una cuenta estadal por estado e institución"
										:	"Esta cuenta se vinculará a la cuenta estadal de su institución (si existe)"
										}
									</p>
								</div>

								<div className="grid grid-cols-2 gap-3">
									<div>
										<label
											htmlFor="estado"
											className="block text-gray-300 text-sm font-semibold mb-1"
										>
											Estado *
										</label>
										<select
											id="estado"
											name="estado"
											value={formData.estado}
											onChange={handleChange}
											required
											className="w-full px-3 py-2 bg-slate-800 border-2 border-slate-700 text-white text-sm rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
										>
											<option value="">Seleccione...</option>
											{ESTADOS_VENEZUELA.map((estado) => (
												<option key={estado} value={estado}>
													{estado}
												</option>
											))}
										</select>
									</div>

									{formData.nivelCuenta === "municipal" && (
										<div>
											<label className="block text-gray-300 text-sm font-semibold mb-1">
												Municipio *
											</label>
											<input
												type="text"
												name="municipio"
												value={formData.municipio}
												onChange={handleChange}
												required={formData.nivelCuenta === "municipal"}
												className="w-full px-3 py-2 bg-slate-800 border-2 border-slate-700 text-white text-sm rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
												placeholder="Ej: Libertador"
											/>
										</div>
									)}
								</div>

								{/* Previsualización de Código */}
								<div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
									<p className="text-xs text-blue-300 font-semibold mb-1">
										Código que se generará:
									</p>
									<p className="text-sm text-blue-100 font-mono">
										{formData.estado && formData.nivelCuenta === "estadal" ?
											formData.estado.toUpperCase().replace(/\s+/g, "-")
										: formData.estado && formData.municipio ?
											`${formData.estado
												.toUpperCase()
												.replace(/\s+/g, "-")}-${formData.municipio
												.toUpperCase()
												.replace(/\s+/g, "-")}`
										:	"(Seleccione estado y municipio)"}
									</p>
									{formData.nivelCuenta === "municipal" && formData.estado && (
										<p className="text-xs text-blue-300 mt-1">
											Anclado a:{" "}
											{formData.estado.toUpperCase().replace(/\s+/g, "-")}
										</p>
									)}
								</div>
							</div>
						</div>

						{/* Información del Responsable */}
						<div className="p-4 bg-gradient-to-br from-slate-900/50 to-orange-500/10 border-2 border-orange-500/30 rounded-xl">
							<div className="flex items-center gap-2 mb-3">
								<div className="p-2 bg-orange-500/20 rounded-lg">
									<User className="w-5 h-5 text-orange-400" />
								</div>
								<h3 className="text-lg font-black text-orange-400">
									Datos del Responsable
								</h3>
							</div>

							<div className="space-y-3">
								<div>
									<label className="block text-gray-300 text-sm font-semibold mb-1">
										Nombre Completo *
									</label>
									<input
										type="text"
										name="nombreResponsable"
										value={formData.nombreResponsable}
										onChange={handleChange}
										required
										className="w-full px-3 py-2 bg-slate-800 border-2 border-slate-700 text-white text-sm rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
										placeholder="Ej: Juan Pérez González"
									/>
								</div>

								<div className="grid grid-cols-2 gap-3">
									<div>
										<label className="block text-gray-300 text-sm font-semibold mb-1">
											Cargo *
										</label>
										<input
											type="text"
											name="cargo"
											value={formData.cargo}
											onChange={handleChange}
											required
											className="w-full px-3 py-2 bg-slate-800 border-2 border-slate-700 text-white text-sm rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
											placeholder="Ej: Director"
										/>
									</div>

									<div>
										<label className="block text-gray-300 text-sm font-semibold mb-1">
											Cédula *
										</label>
										<input
											type="text"
											name="cedula"
											value={formData.cedula}
											onChange={handleChange}
											required
											pattern="[0-9]+"
											className="w-full px-3 py-2 bg-slate-800 border-2 border-slate-700 text-white text-sm rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
											placeholder="12345678"
										/>
									</div>
								</div>

								<div>
									<label className="block text-gray-300 text-sm font-semibold mb-1">
										Email Institucional *
									</label>
									<input
										type="email"
										name="email"
										value={formData.email}
										onChange={handleChange}
										required
										className="w-full px-3 py-2 bg-slate-800 border-2 border-slate-700 text-white text-sm rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
										placeholder="correo@institucion.gob.ve"
									/>
								</div>

								<div>
									<label className="block text-gray-300 text-sm font-semibold mb-1">
										Teléfono *
									</label>
									<input
										type="tel"
										name="telefono"
										value={formData.telefono}
										onChange={handleChange}
										required
										className="w-full px-3 py-2 bg-slate-800 border-2 border-slate-700 text-white text-sm rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
										placeholder="04XX-XXXXXXX"
									/>
								</div>
							</div>
						</div>
					</div>

					{/* COLUMNA DERECHA: Upload y Botón */}
					<div className="space-y-4">
						{/* Upload de Carta Formal */}
						<div className="p-4 bg-gradient-to-br from-orange-500/10 to-slate-900/50 border-2 border-orange-500/30 rounded-xl h-full flex flex-col">
							<div className="flex items-center gap-2 mb-3">
								<div className="p-2 bg-orange-500/20 rounded-lg">
									<FileText className="w-5 h-5 text-orange-400" />
								</div>
								<h3 className="text-lg font-black text-orange-400">
									Carta Formal
								</h3>
							</div>

							<p className="text-gray-300 text-sm leading-relaxed mb-4">
								Adjunte la carta formal de solicitud firmada por el Director o
								Coordinador de la institución.
							</p>

							<label className="block w-full flex-1 flex items-center justify-center">
								<div
									className={`w-full h-full min-h-[280px] border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all flex items-center justify-center ${
										pdfFile ?
											"border-green-500 bg-green-500/10"
										:	"border-orange-500/50 bg-slate-800 hover:border-orange-500 hover:bg-slate-700"
									}`}
								>
									<input
										type="file"
										onChange={handlePdfUpload}
										accept=".pdf"
										className="hidden"
										disabled={uploading}
									/>

									{uploading ?
										<div className="flex flex-col items-center gap-3">
											<Upload className="w-12 h-12 text-orange-400 animate-bounce" />
											<p className="text-orange-400 text-sm font-semibold">
												Subiendo PDF...
											</p>
										</div>
									: pdfFile ?
										<div className="flex flex-col items-center gap-3">
											<CheckCircle className="w-12 h-12 text-green-500" />
											<p className="text-green-400 text-sm font-semibold">
												✓ {pdfFile.name}
											</p>
											<p className="text-xs text-gray-400">
												Listo para enviar. Click para cambiar.
											</p>
										</div>
									:	<div className="flex flex-col items-center gap-3">
											<Upload className="w-12 h-12 text-orange-400" />
											<p className="text-white text-sm font-semibold">
												Click para subir PDF
											</p>
											<p className="text-xs text-gray-400">Máximo 5MB</p>
										</div>
									}
								</div>
							</label>

							{/* Botón de Envío */}
							<div className="mt-4">
								<button
									type="submit"
									disabled={submitting || uploading}
									className={`w-full px-6 py-3 rounded-lg font-bold text-base flex items-center justify-center gap-2 transition-all transform hover:scale-105 ${
										submitting || uploading ?
											"bg-gray-600 cursor-not-allowed"
										:	"bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/50"
									}`}
								>
									{submitting ?
										<>
											<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
											Enviando...
										</>
									:	<>
											<Send className="w-5 h-5" />
											Enviar Solicitud
										</>
									}
								</button>
							</div>
						</div>
					</div>
				</div>
			</form>
		</>
	);
}

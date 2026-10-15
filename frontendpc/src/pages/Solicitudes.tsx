import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
	FileText,
	Check,
	X,
	Download,
	Clock,
	Building2,
	User,
	Mail,
	Phone,
	MapPin,
	Briefcase,
} from "lucide-react";
import { API_URL } from "../conf/constnts";
import { getStoredToken } from "../api/auth";

interface RegistrationRequest {
	id: string;
	nombreInstitucion: string;
	tipoInstitucion: string;
	estado: string;
	municipio: string;
	codigo: string;
	nivelCuenta: string; // NUEVO
	codigoEstadal?: string; // NUEVO
	nombreResponsable: string;
	cargo: string;
	cedula: string;
	email: string;
	telefono: string;
	cartaFormalUrl: string;
	estadoSolicitud: string;
	motivoRechazo?: string;
	createdAt: string;
	reviewedAt?: string;
	usuarioCreado?: {
		id: number;
		nombre: string;
		apellido: string;
		email: string;
	};
}

export default function Solicitudes() {
	const { user, isAuthenticated } = useAuth();
	const [solicitudes, setSolicitudes] = useState<RegistrationRequest[]>([]);
	const [loading, setLoading] = useState(true);
	const [rejecting, setRejecting] = useState<string | null>(null);
	const [motivoRechazo, setMotivoRechazo] = useState("");

	useEffect(() => {
		if (isAuthenticated && user?.rol === "superadmin") {
			loadSolicitudes();
		}
	}, [isAuthenticated, user]);

	/* Duplicate loadSolicitudes definition removed */

	const loadSolicitudes = async () => {
		try {
			const response = await fetch(`${API_URL}/api/registration-requests`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					...(getStoredToken() ? { Authorization: `Bearer ${getStoredToken()}` } : {}),
				},
				credentials: "include",
			});

			if (!response.ok) {
				throw new Error("Error al cargar solicitudes");
			}

			const data = await response.json();
			console.log("Solicitudes cargadas:", data);
			setSolicitudes(data);
		} catch (error) {
			console.error("Error cargando solicitudes (detalles):", error);
		} finally {
			setLoading(false);
		}
	};

	const handleAprobar = async (id: string) => {
		if (
			!confirm(
				"¿Está seguro de aprobar esta solicitud? Se creará un usuario admin y se enviará un email con las credenciales."
			)
		) {
			return;
		}

		try {
			const response = await fetch(
				`${API_URL}/api/registration-requests/${id}/approve`,
				{
					method: "PUT",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
						...(getStoredToken() ? { Authorization: `Bearer ${getStoredToken()}` } : {}),
					},
					body: JSON.stringify({}),
				}
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "No se pudo aprobar la solicitud");
			}

			alert("✅ Solicitud aprobada y usuario creado exitosamente");
			loadSolicitudes();
		} catch (error: any) {
			alert("Error: " + error.message);
		}
	};

	const handleRechazar = async (id: string) => {
		if (!motivoRechazo || motivoRechazo.length < 10) {
			alert("El motivo de rechazo debe tener al menos 10 caracteres");
			return;
		}

		try {
			const response = await fetch(
				`${API_URL}/api/registration-requests/${id}/reject`,
				{
					method: "PUT",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
						...(getStoredToken() ? { Authorization: `Bearer ${getStoredToken()}` } : {}),
					},
					body: JSON.stringify({ motivo: motivoRechazo }),
				}
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "No se pudo rechazar la solicitud");
			}

			alert("✅ Solicitud rechazada");
			setRejecting(null);
			setMotivoRechazo("");
			loadSolicitudes();
		} catch (error: any) {
			alert("Error: " + error.message);
		}
	};

	if (!isAuthenticated || user?.rol !== "superadmin") {
		return (
			<div className="min-h-screen flex items-center justify-center bg-slate-950">
				<h1 className="text-white font-bold text-4xl">
					No está autorizado para ver esta página
				</h1>
			</div>
		);
	}

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-slate-950">
				<h1 className="text-white font-bold text-3xl">
					Cargando solicitudes...
				</h1>
			</div>
		);
	}

	const pendientes = solicitudes.filter((s) => s.estadoSolicitud === "pending");
	const aprobadas = solicitudes.filter((s) => s.estadoSolicitud === "approved");
	const rechazadas = solicitudes.filter(
		(s) => s.estadoSolicitud === "rejected"
	);

	return (
		<div className="min-h-screen bg-slate-950 text-white py-12 px-4">
			<div className="max-w-7xl mx-auto">
				<div className="mb-12">
					<h1 className="text-5xl font-black text-orange-500 mb-4">
						Solicitudes de Registro
					</h1>
					<div className="flex gap-6 text-lg">
						<div className="px-4 py-2 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
							<span className="text-yellow-400 font-bold">
								{pendientes.length}
							</span>{" "}
							Pendientes
						</div>
						<div className="px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-lg">
							<span className="text-green-400 font-bold">
								{aprobadas.length}
							</span>{" "}
							Aprobadas
						</div>
						<div className="px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg">
							<span className="text-red-400 font-bold">
								{rechazadas.length}
							</span>{" "}
							Rechazadas
						</div>
					</div>
				</div>

				{/* Solicitudes Pendientes */}
				{pendientes.length > 0 && (
					<div className="mb-12">
						<h2 className="text-3xl font-black text-yellow-400 mb-6 flex items-center gap-3">
							<Clock className="w-8 h-8" />
							Pendientes de Revisión
						</h2>
						<div className="space-y-6">
							{pendientes.map((sol) => (
								<div
									key={sol.id}
									className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-yellow-500/50 rounded-2xl"
								>
									<div className="grid md:grid-cols-2 gap-6">
										{/* Información Institución */}
										<div>
											<h3 className="text-2xl font-black text-orange-400 mb-4 flex items-center gap-2">
												<Building2 className="w-6 h-6" />
												{sol.nombreInstitucion}
											</h3>
											<div className="space-y-2 text-gray-300">
												<p>
													<span className="font-semibold">Tipo:</span>{" "}
													<span className="text-orange-400">
														{sol.tipoInstitucion}
													</span>
												</p>
												<p>
													<span className="font-semibold">Nivel:</span>{" "}
													<span
														className={`font-bold ${
															sol.nivelCuenta === "estadal"
																? "text-purple-400"
																: "text-blue-400"
														}`}
													>
														{sol.nivelCuenta?.toUpperCase() || "MUNICIPAL"}
													</span>
												</p>
												<p className="flex items-center gap-2">
													<MapPin className="w-4 h-4" />
													{sol.estado}
													{sol.municipio && `, ${sol.municipio}`}
												</p>
												<p>
													<span className="font-semibold">Código:</span>{" "}
													<span className="font-mono text-green-400">
														{sol.codigo}
													</span>
												</p>
												<p className="text-xs text-gray-500">
													Solicitado:{" "}
													{new Date(sol.createdAt).toLocaleDateString()}
												</p>
											</div>
										</div>

										{/* Información Responsable */}
										<div>
											<h4 className="text-lg font-bold text-gray-300 mb-3 flex items-center gap-2">
												<User className="w-5 h-5" />
												Responsable
											</h4>
											<div className="space-y-2 text-gray-300 text-sm">
												<p>
													<span className="font-semibold">Nombre:</span>{" "}
													{sol.nombreResponsable}
												</p>
												<p className="flex items-center gap-2">
													<Briefcase className="w-4 h-4" />
													{sol.cargo}
												</p>
												<p>CI: {sol.cedula}</p>
												<p className="flex items-center gap-2">
													<Mail className="w-4 h-4 text-blue-400" />
													{sol.email}
												</p>
												<p className="flex items-center gap-2">
													<Phone className="w-4 h-4 text-green-400" />
													{sol.telefono}
												</p>
											</div>
										</div>
									</div>

									{/* Carta Formal y Acciones */}
									<div className="mt-6 pt-6 border-t border-slate-700">
										<div className="flex flex-wrap gap-4 items-center justify-between">
											<a
												href={sol.cartaFormalUrl}
												target="_blank"
												rel="noopener noreferrer"
												className="px-6 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-all flex items-center gap-2"
											>
												<Download className="w-5 h-5" />
												Descargar Carta Formal (PDF)
											</a>

											<div className="flex gap-3">
												<button
													onClick={() => handleAprobar(sol.id)}
													className="px-6 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-all flex items-center gap-2"
												>
													<Check className="w-5 h-5" />
													Aprobar
												</button>

												<button
													onClick={() => setRejecting(sol.id)}
													className="px-6 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all flex items-center gap-2"
												>
													<X className="w-5 h-5" />
													Rechazar
												</button>
											</div>
										</div>

										{/* Modal de Rechazo */}
										{rejecting === sol.id && (
											<div className="mt-4 p-4 bg-red-500/10 border-2 border-red-500/50 rounded-xl">
												<label className="block text-white font-semibold mb-2">
													Motivo del Rechazo (mínimo 10 caracteres):
												</label>
												<textarea
													value={motivoRechazo}
													onChange={(e) => setMotivoRechazo(e.target.value)}
													className="w-full px-4 py-3 bg-slate-800 border-2 border-slate-700 text-white rounded-xl focus:border-red-500 focus:outline-none mb-3"
													rows={3}
													placeholder="Explique por qué se rechaza esta solicitud..."
												/>
												<div className="flex gap-3">
													<button
														onClick={() => handleRechazar(sol.id)}
														disabled={motivoRechazo.length < 10}
														className="px-6 py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-all disabled:bg-gray-600 disabled:cursor-not-allowed"
													>
														Confirmar Rechazo
													</button>
													<button
														onClick={() => {
															setRejecting(null);
															setMotivoRechazo("");
														}}
														className="px-6 py-2 bg-slate-700 text-white rounded-lg font-bold hover:bg-slate-600 transition-all"
													>
														Cancelar
													</button>
												</div>
											</div>
										)}
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Solicitudes Aprobadas y Rechazadas (colapsadas) */}
				{aprobadas.length > 0 && (
					<details className="mb-8 p-6 bg-green-500/10 border-2 border-green-500/30 rounded-2xl">
						<summary className="text-2xl font-black text-green-400 cursor-pointer">
							Aprobadas ({aprobadas.length})
						</summary>
						<div className="mt-6 space-y-4">
							{aprobadas.map((sol) => (
								<div
									key={sol.id}
									className="p-4 bg-slate-800 rounded-lg text-sm"
								>
									<p className="font-bold text-white">
										{sol.nombreInstitucion}
									</p>
									<p className="text-gray-400">
										{sol.nombreResponsable} - {sol.email}
									</p>
									<p className="text-green-400 text-xs mt-2">
										✓ Aprobado el{" "}
										{sol.reviewedAt &&
											new Date(sol.reviewedAt).toLocaleDateString()}
										{sol.usuarioCreado &&
											` - Usuario creado: ${sol.usuarioCreado.email}`}
									</p>
								</div>
							))}
						</div>
					</details>
				)}

				{rechazadas.length > 0 && (
					<details className="p-6 bg-red-500/10 border-2 border-red-500/30 rounded-2xl">
						<summary className="text-2xl font-black text-red-400 cursor-pointer">
							Rechazadas ({rechazadas.length})
						</summary>
						<div className="mt-6 space-y-4">
							{rechazadas.map((sol) => (
								<div
									key={sol.id}
									className="p-4 bg-slate-800 rounded-lg text-sm"
								>
									<p className="font-bold text-white">
										{sol.nombreInstitucion}
									</p>
									<p className="text-gray-400">
										{sol.nombreResponsable} - {sol.email}
									</p>
									<p className="text-red-400 text-xs mt-2">
										✗ Rechazado el{" "}
										{sol.reviewedAt &&
											new Date(sol.reviewedAt).toLocaleDateString()}
									</p>
									{sol.motivoRechazo && (
										<p className="text-gray-500 text-xs mt-1 italic">
											Motivo: {sol.motivoRechazo}
										</p>
									)}
								</div>
							))}
						</div>
					</details>
				)}

				{solicitudes.length === 0 && (
					<div className="text-center py-20">
						<FileText className="w-20 h-20 text-gray-600 mx-auto mb-4" />
						<p className="text-gray-400 text-xl">
							No hay solicitudes registradas aún.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

import { motion } from "framer-motion";
import { Trash2, ShieldCheck, Mail, Info } from "lucide-react";

const EliminarCuenta = () => {
	const dataItems = [
		{
			title: "¿Qué datos se eliminan?",
			icon: <Trash2 className="text-red-400" />,
			items: [
				"Información de perfil (nombre, correo electrónico, teléfono).",
				"Historial de actividad y progreso en la aplicación.",
				"Preferencias de usuario.",
			],
			bgColor: "bg-red-500/10",
			borderColor: "border-red-500/20",
		},
		{
			title: "¿Qué datos se conservan?",
			icon: <ShieldCheck className="text-blue-400" />,
			items: [
				"Registros de transacciones financieras (por requisitos legales contables, si aplica).",
				"Datos anonimizados para estadísticas de uso (no vinculados a tu identidad).",
			],
			bgColor: "bg-blue-500/10",
			borderColor: "border-blue-500/20",
		},
	];

	return (
		<div className="min-h-screen bg-[#0a0a0f] text-white py-20 px-4 sm:px-6 lg:px-8">
			<div className="max-w-4xl mx-auto">
				{/* Encabezado */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-center mb-16"
				>
					<h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-6">
						Solicitud de Eliminación de Cuenta y Datos Personales
					</h1>
					<p className="text-gray-400 text-lg max-w-2xl mx-auto">
						En <span className="text-orange-500 font-semibold">EDOS</span>,
						valoramos tu privacidad. Si deseas dejar de utilizar nuestros
						servicios y eliminar tu cuenta de forma permanente, puedes hacerlo
						siguiendo los pasos a continuación.
					</p>
				</motion.div>

				{/* Secciones de Datos */}
				<div className="grid md:grid-cols-2 gap-8 mb-16">
					{dataItems.map((section, idx) => (
						<motion.div
							key={idx}
							initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.2 }}
							className={`p-6 rounded-2xl border ${section.borderColor} ${section.bgColor} backdrop-blur-sm`}
						>
							<div className="flex items-center gap-3 mb-4">
								{section.icon}
								<h2 className="text-xl font-bold">{section.title}</h2>
							</div>
							<ul className="space-y-3">
								{section.items.map((item, i) => (
									<li key={i} className="flex gap-2 text-gray-300">
										<span className="text-orange-500 text-sm mt-1">●</span>
										{item}
									</li>
								))}
							</ul>
						</motion.div>
					))}
				</div>

				{/* Pasos a seguir */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
					className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md"
				>
					<div className="flex items-center gap-3 mb-8">
						<Info className="text-orange-400 w-6 h-6" />
						<h2 className="text-2xl font-bold">
							Pasos para solicitar la eliminación
						</h2>
					</div>

					<div className="space-y-6">
						<div className="flex items-start gap-4">
							<div className="bg-orange-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
								1
							</div>
							<div>
								<p className="font-semibold">Envía un correo electrónico</p>
								<p className="text-gray-400">
									Escríbenos a{" "}
									<a
										href="mailto:soporte@edanosapp.site"
										className="text-orange-400 hover:text-orange-300 transition-colors"
									>
										soporte@edanosapp.site
									</a>{" "}
									con el asunto "Solicitud de eliminación de cuenta".
								</p>
							</div>
						</div>

						<div className="flex items-start gap-4">
							<div className="bg-orange-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
								2
							</div>
							<div>
								<p className="font-semibold">Incluye tus datos</p>
								<p className="text-gray-400">
									Indica el número de teléfono o correo electrónico asociado a
									tu cuenta para que podamos identificarte.
								</p>
							</div>
						</div>

						<div className="flex items-start gap-4">
							<div className="bg-orange-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
								3
							</div>
							<div>
								<p className="font-semibold">Procesamiento</p>
								<p className="text-gray-400">
									Una vez recibida la solicitud, procesaremos la eliminación en
									un plazo máximo de 7 a 15 días hábiles.
								</p>
							</div>
						</div>
					</div>

					<div className="mt-10 p-4 bg-orange-500/20 border border-orange-500/30 rounded-xl flex items-center gap-3">
						<Mail className="text-orange-400" />
						<p className="text-sm text-gray-200">
							Recibirás una confirmación por correo electrónico una vez hayamos
							completado el proceso de eliminación.
						</p>
					</div>
				</motion.div>

				<div className="mt-12 text-center text-gray-500 text-sm">
					© {new Date().getFullYear()} EDOS Application. Todos los derechos
					reservados.
				</div>
			</div>
		</div>
	);
};

export default EliminarCuenta;

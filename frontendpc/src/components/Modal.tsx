import { CheckCircle, AlertCircle, Upload, X } from "lucide-react";

export interface ModalProps {
	type: "error" | "success";
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	message?: React.ReactNode;
}

export function Modal({ type, isOpen, onClose, title, message }: ModalProps) {
	if (!isOpen) return null;

	const isError = type === "error";

	const config = {
		error: {
			borderColor: "border-red-500",
			bgGradient: "from-red-900/90 to-slate-900/90",
			shadowColor: "shadow-red-500/50",
			iconBg: "bg-red-500",
			iconBorder: "border-red-500",
			iconColor: "bg-red-500/20",
			textColor: "text-red-400",
			glowColor: "bg-red-500",
			buttonGradient:
				"from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
			buttonShadow: "shadow-red-500/50",
			title: "⚠️ PDF Requerido",
			message: (
				<>
					No puedes enviar el formulario sin cargar la{" "}
					<span className="font-bold text-red-400">carta formal en PDF</span>.
					<br />
					<span className="text-gray-300 text-base">
						Por favor, adjunta el documento antes de continuar.
					</span>
				</>
			),
			buttonText: "Entendido",
			ButtonIcon: Upload,
		},
		success: {
			borderColor: "border-green-500",
			bgGradient: "from-green-900/90 to-slate-900/90",
			shadowColor: "shadow-green-500/50",
			iconBg: "bg-green-500",
			iconBorder: "border-green-500",
			iconColor: "bg-green-500/20",
			textColor: "text-green-400",
			glowColor: "bg-green-500",
			buttonGradient:
				"from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
			buttonShadow: "shadow-green-500/50",
			title: "✅ ¡Solicitud Enviada!",
			message: (
				<>
					Su solicitud ha sido enviada exitosamente.
					<br />
					<span className="text-gray-300 text-base">
						Recibirá una respuesta por email una vez que sea revisada por el
						equipo de EDANOS.
					</span>
				</>
			),
			buttonText: "Cerrar",
			ButtonIcon: CheckCircle,
		},
	};

	const currentConfig = config[type];
	const Icon = isError ? AlertCircle : CheckCircle;
	const ButtonIcon = currentConfig.ButtonIcon;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			{/* Overlay oscuro con backdrop blur */}
			<div
				className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
				onClick={onClose}
			></div>

			{/* Contenido del Modal */}
			<div
				className={`relative max-w-md w-full rounded-2xl p-8 shadow-2xl transform transition-all duration-300 scale-100 bg-gradient-to-br ${currentConfig.bgGradient} border-4 ${currentConfig.borderColor} ${currentConfig.shadowColor}`}
			>
				{/* Botón cerrar (X) */}
				<button
					onClick={onClose}
					className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
					aria-label="Cerrar modal"
				>
					<X className="w-6 h-6" />
				</button>

				{/* Icono Grande */}
				<div className="flex justify-center mb-6">
					<div className="relative">
						<div
							className={`absolute inset-0 ${currentConfig.glowColor} rounded-full blur-xl opacity-60 animate-pulse`}
						></div>
						<div
							className={`relative ${currentConfig.iconColor} p-6 rounded-full border-4 ${currentConfig.iconBorder}`}
						>
							<Icon
								className={`w-16 h-16 ${currentConfig.textColor.replace(
									"text-",
									"text-"
								)}`}
							/>
						</div>
					</div>
				</div>

				{/* Título */}
				<h3
					className={`text-3xl font-black text-center mb-4 ${currentConfig.textColor}`}
				>
					{title || currentConfig.title}
				</h3>

				{/* Mensaje */}
				<p className="text-white text-center text-lg leading-relaxed mb-8">
					{message || currentConfig.message}
				</p>

				{/* Botón de Acción */}
				<button
					onClick={onClose}
					className={`w-full px-6 py-4 text-white font-black text-lg rounded-xl transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 bg-gradient-to-r ${currentConfig.buttonGradient} ${currentConfig.buttonShadow}`}
				>
					<ButtonIcon className="w-6 h-6" />
					{currentConfig.buttonText}
				</button>
			</div>
		</div>
	);
}

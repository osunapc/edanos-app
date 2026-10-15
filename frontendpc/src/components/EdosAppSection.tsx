"use client";
import { Download, Smartphone, Shield, Zap, CheckCircle2 } from "lucide-react";
import edosmockup from "../assets/edosmockup.webp";

export function EdosAppSection() {
	return (
		<section className="relative min-h-screen flex items-center py-20 md:py-40 px-4 bg-slate-950 overflow-hidden">
			{/* Decoración de fondo */}
			<div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>
			<div className="absolute inset-0 bg-[linear-gradient(rgba(255,140,0,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,140,0,.04)_1px,transparent_1px)] bg-[size:40px_40px] z-0 opacity-30"></div>

			<div className="max-w-7xl mx-auto relative z-10 w-full">
				<div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
					{/* Columna de Texto */}
					<div className="space-y-6 md:space-y-8 animate-[float-in_0.8s_ease-out] text-center lg:text-left order-2 lg:order-1">
						<div className="inline-block px-4 py-2 bg-orange-500/10 border-2 border-orange-500/30 rounded-full">
							<span className="text-orange-400 font-bold text-xs md:text-sm uppercase tracking-wider flex items-center gap-2">
								<Smartphone className="w-4 h-4" />
								App Móvil Disponible
							</span>
						</div>

						<h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-white">
							Entrena con{" "}
							<span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent italic">
								EDOS
							</span>
							<br />
							<span className="text-2xl md:text-3xl lg:text-4xl text-gray-400">
								Mide tus conocimientos en toda Venezuela
							</span>
						</h2>

						<p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
							EDOS revoluciona la capacitación operativa. Una experiencia
							gamificada diseñada específicamente para Bomberos y Protección
							Civil. Domina la gestión de riesgo y atención prehospitalaria
							mientras compites sanamente.
						</p>

						<div className="space-y-4 max-w-lg mx-auto lg:mx-0">
							{[
								"Misiones interactivas de aprendizaje rápido",
								"Contenido técnico basado en normas internacionales",
								"Ranking nacional de especialistas",
							].map((feature, idx) => (
								<div
									key={idx}
									className="flex items-center gap-3 text-gray-300 text-left"
								>
									<div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/40 flex-shrink-0">
										<CheckCircle2 className="w-4 h-4 text-orange-500" />
									</div>
									<span className="font-medium text-sm md:text-base">
										{feature}
									</span>
								</div>
							))}
						</div>

						<div className="flex flex-col sm:flex-row gap-4 md:gap-6 pt-4 justify-center lg:justify-start">
							<a
								href="https://drive.google.com/uc?export=download&id=1PNR8PqDwFFuEyrve9fdSFzih2amUOvlh"
								className="group relative px-6 md:px-8 py-3 md:py-4 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 shadow-xl shadow-orange-500/20 active:scale-95 overflow-hidden w-full sm:w-auto"
							>
								<div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12"></div>
								<Download className="w-5 h-5 md:w-6 md:h-6 animate-bounce" />
								<span className="text-base md:text-lg">Descargar APK</span>
							</a>

							<div className="flex items-center gap-4 px-6 py-3 md:py-4 bg-slate-900/50 border-2 border-slate-800 rounded-2xl backdrop-blur-sm w-full sm:w-auto justify-center">
								<div className="text-left">
									<p className="text-[10px] md:text-xs text-gray-500 uppercase font-black">
										Versión Actual
									</p>
									<p className="text-orange-400 font-bold text-sm md:text-base">
										v1.1-Beta
									</p>
								</div>
								<div className="h-8 w-px bg-slate-800"></div>
								<div className="text-left">
									<p className="text-[10px] md:text-xs text-gray-500 uppercase font-black">
										Tamaño
									</p>
									<p className="text-orange-400 font-bold text-sm md:text-base">
										100 MB
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Columna de Imagen / Mockup */}
					<div className="relative group perspective-1000 order-1 lg:order-2">
						<div className="absolute inset-0 bg-orange-500/20 rounded-full blur-[80px] md:blur-[120px] opacity-50 group-hover:opacity-80 transition-opacity"></div>

						<div className="relative z-10 animate-[float_6s_ease-in-out_infinite]">
							<img
								src={edosmockup}
								alt="EDOS App Mockup"
								className="h-[400px] md:h-[600px] w-auto max-w-full mx-auto rounded-[2.5rem] md:rounded-[3rem] shadow-2xl transform transition-transform duration-700 group-hover:scale-105 group-hover:rotate-2"
							/>

							{/* Floating Badges */}
							<div className="absolute -top-5 -right-5 md:-top-10 md:-right-10 lg:right-0 bg-slate-900/90 border-2 border-orange-500/40 p-3 md:p-4 rounded-xl md:rounded-2xl backdrop-blur-md shadow-2xl animate-[bounce_4s_ease-in-out_infinite]">
								<div className="flex items-center gap-2 md:gap-3">
									<div className="w-8 h-8 md:w-10 md:h-10 bg-orange-500 rounded-lg md:rounded-xl flex items-center justify-center">
										<Zap className="w-5 h-5 md:w-6 md:h-6 text-white" />
									</div>
									<div>
										<p className="text-[10px] md:text-sm font-black text-white">
											Gamificación
										</p>
										<p className="text-[8px] md:text-xs text-orange-400 font-bold">
											100% Interactiva
										</p>
									</div>
								</div>
							</div>

							<div className="absolute -bottom-5 -left-5 md:-bottom-10 md:-left-10 lg:left-0 bg-slate-900/90 border-2 border-orange-500/40 p-3 md:p-4 rounded-xl md:rounded-2xl backdrop-blur-md shadow-2xl animate-[bounce_5s_ease-in-out_infinite_1s]">
								<div className="flex items-center gap-2 md:gap-3">
									<div className="w-8 h-8 md:w-10 md:h-10 bg-green-500 rounded-lg md:rounded-xl flex items-center justify-center">
										<Shield className="w-5 h-5 md:w-6 md:h-6 text-white" />
									</div>
									<div>
										<p className="text-[10px] md:text-sm font-black text-white">
											Seguro
										</p>
										<p className="text-[8px] md:text-xs text-green-400 font-bold">
											Certificado PC
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

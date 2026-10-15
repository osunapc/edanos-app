"use client";
import {
	MapPin,
	BarChart3,
	Zap,
	Clock,
	Shield,
	Users,
	ArrowRight,
	Activity,
	TrendingUp,
	Smartphone,
	Database,
	Lock,
	Radio,
	Lightbulb,
	CheckCircle2,
	Network,
} from "lucide-react";
import { ButtonLink } from "../components/ui/ButtonLink";
import { RegistrationForm } from "../components/RegistrationForm";
import { EdosAppSection } from "../components/EdosAppSection";

export default function HomePage() {
	return (
		<div className="dark min-h-screen w-full bg-slate-950 text-white overflow-hidden">
			{/* ==================== HERO SECTION ====================  */}
			<section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden px-4 py-20">
				<div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 z-0"></div>

				{/* Orbes de tecnología - capas múltiples */}
				<div className="absolute -top-40 -left-40 w-96 h-96 bg-orange-500/30 rounded-full blur-3xl opacity-60 animate-pulse"></div>
				<div
					className="absolute -bottom-40 -right-40 w-96 h-96 bg-orange-600/25 rounded-full blur-3xl opacity-50 animate-pulse"
					style={{ animationDelay: "1s" }}
				></div>
				<div
					className="absolute top-1/2 left-1/3 w-80 h-80 bg-orange-400/15 rounded-full blur-3xl opacity-40 animate-pulse"
					style={{ animationDelay: "2s" }}
				></div>

				{/* Grid de tecnología visible */}
				<div className="absolute inset-0 bg-[linear-gradient(rgba(255,140,0,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,140,0,.08)_1px,transparent_1px)] bg-[size:40px_40px] z-0"></div>

				{/* Líneas de conexión animadas */}
				<div className="absolute inset-0 overflow-hidden z-0">
					<div className="absolute top-1/4 left-1/4 w-96 h-px bg-gradient-to-r from-orange-500/0 via-orange-500/30 to-orange-500/0 transform -rotate-45 animate-pulse"></div>
					<div
						className="absolute bottom-1/4 right-1/4 w-96 h-px bg-gradient-to-r from-orange-500/0 via-orange-500/20 to-orange-500/0 transform rotate-45 animate-pulse"
						style={{ animationDelay: "1.5s" }}
					></div>
				</div>

				<div className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-6xl">
					{/* Logo mejorado con múltiples capas de glow */}
					<div className="animate-[float-in_0.8s_ease-out]">
						<div className="relative">
							<div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 rounded-full blur-3xl opacity-70 animate-pulse"></div>
							<div
								className="absolute inset-0 bg-gradient-to-b from-orange-600/50 to-transparent rounded-full blur-2xl opacity-50 animate-pulse"
								style={{ animationDelay: "0.5s" }}
							></div>
							<img
								src="/icon.webp"
								alt="EDANOS Logo"
								className="w-40 h-40 md:w-56 md:h-56 relative z-10 animate-[scale-pulse_2s_ease-in-out_infinite]"
							/>
						</div>
					</div>

					{/* Badge de sistema en tiempo real */}
					<div className="animate-[float-in_0.8s_ease-out_0.2s_backwards]">
						<div className="flex items-center justify-center gap-3 mb-4 px-4 py-2 bg-orange-500/10 border border-orange-500/50 rounded-full backdrop-blur">
							<div className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-pulse"></div>
							<span className="text-orange-400 font-semibold text-sm">
								SISTEMA EN TIEMPO REAL
							</span>
						</div>
					</div>

					{/* Título principal - megavista */}
					<div className="space-y-6 animate-[float-in_0.8s_ease-out_0.2s_backwards]">
						<h1 className="text-7xl md:text-8xl lg:text-9xl font-black bg-gradient-to-r from-white via-orange-200 to-orange-500 bg-clip-text text-transparent leading-tight">
							EDANOS
						</h1>
						<p className="text-2xl md:text-3xl text-gray-300 max-w-4xl leading-relaxed">
							Gestión Inteligente de Daños y Necesidades impulsada por{" "}
							<span className="text-orange-400 font-black">
								Tecnología de Vanguardia
							</span>
						</p>
						<p className="text-lg text-gray-400 max-w-2xl">
							Datos en tiempo real, análisis predictivo y coordinación nacional
							para Protección Civil
						</p>
					</div>

					{/* CTA principal */}
					<ButtonLink to="/login">
						Acceder al Sistema
						<ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
					</ButtonLink>

					{/* Indicador de scroll */}
					<div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
						<div className="w-8 h-12 border-2 border-orange-500/50 rounded-full flex justify-center">
							<div className="w-1.5 h-3 bg-orange-500 rounded-full mt-2 animate-pulse"></div>
						</div>
					</div>
				</div>
			</section>
			{/* ==================== SECCIÓN DE VISIÓN Y MISIÓN ====================  */}
			<section className="relative py-32 px-4 bg-gradient-to-b from-slate-900 to-slate-950 overflow-hidden">
				<div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>

				<div className="absolute inset-0 bg-[linear-gradient(rgba(255,140,0,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,140,0,.04)_1px,transparent_1px)] bg-[size:60px_60px] z-0 opacity-50"></div>

				<div className="max-w-6xl mx-auto relative z-10">
					<div className="text-center mb-20">
						<h2 className="text-5xl md:text-6xl font-black mb-8">
							La Tecnología en el Corazón de la{" "}
							<span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
								Protección
							</span>
						</h2>
						<p className="text-xl text-gray-400 max-w-3xl mx-auto">
							EDANOS revoluciona cómo Protección Civil responde a emergencias
							transformando datos manuales en inteligencia en tiempo real
						</p>
					</div>

					<div className="grid md:grid-cols-2 gap-12 items-center">
						{/* Visión */}
						<div className="group p-8 bg-gradient-to-br from-orange-500/10 to-slate-900/50 border-2 border-orange-500/30 rounded-2xl hover:border-orange-500/60 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20">
							<div className="flex items-start gap-4 mb-6">
								<div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
									<Lightbulb className="w-7 h-7 text-white" />
								</div>
								<h3 className="text-3xl font-bold text-orange-400">Visión</h3>
							</div>
							<p className="text-gray-300 leading-relaxed text-lg">
								Ser la herramienta tecnológica estándar nacional para gestión de
								información en desastres, unificando y fortaleciendo las
								capacidades de Protección Civil en toda Venezuela para proteger
								y asistir a la comunidad de manera más efectiva y eficiente.
							</p>
						</div>

						{/* Misión */}
						<div className="group p-8 bg-gradient-to-br from-slate-900/50 to-orange-500/10 border-2 border-orange-500/30 rounded-2xl hover:border-orange-500/60 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20">
							<div className="flex items-start gap-4 mb-6">
								<div className="w-14 h-14 bg-gradient-to-br from-orange-600 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
									<Radio className="w-7 h-7 text-white" />
								</div>
								<h3 className="text-3xl font-bold text-orange-400">Misión</h3>
							</div>
							<p className="text-gray-300 leading-relaxed text-lg">
								Empoderar a Protección Civil con plataforma digital robusta y
								fácil de usar que optimice evaluación de daños y análisis de
								necesidades, permitiendo respuesta más rápida y coordinada para
								mejorar el bienestar de la población afectada.
							</p>
						</div>
					</div>
				</div>
			</section>
			{/* ==================== MOCKUP DEL SISTEMA ====================  */}
			<section className="relative py-32 px-4 overflow-hidden">
				<div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>

				<div className="absolute inset-0">
					<div className="absolute top-1/2 right-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl opacity-30 -translate-y-1/2"></div>
				</div>

				<div className="max-w-7xl mx-auto relative z-10">
					<div className="text-center mb-20">
						<h2 className="text-5xl md:text-6xl font-black mb-8">
							Sistema de Control en
							<br />
							<span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
								Tiempo Real
							</span>
						</h2>
						<p className="text-xl text-gray-400 max-w-2xl mx-auto">
							Visualización integrada de datos de emergencias, mapas dinámicos y
							análisis estadísticos
						</p>
					</div>

					<div className="grid lg:grid-cols-3 gap-8 items-center">
						{/* Mockup Desktop - más impactante */}
						<div className="lg:col-span-2">
							<div className="relative">
								<div className="absolute inset-0 bg-gradient-to-r from-orange-500/30 to-transparent rounded-2xl blur-3xl"></div>
								<div className="relative bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl border-2 border-orange-500/40 overflow-hidden shadow-2xl hover:border-orange-500/60 transition-all duration-300">
									{/* Barra superior */}
									<div className="bg-gradient-to-r from-slate-800 to-slate-700 border-b-2 border-orange-500/30 px-6 py-4 flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50"></div>
											<span className="text-sm font-bold text-green-400">
												EN LÍNEA
											</span>
											<span className="text-xs text-gray-500">|</span>
											<span className="text-xs text-gray-400">
												Actualizado hace 1s
											</span>
										</div>
										<div className="text-xs font-mono text-orange-400">
											v4.2.1 | Prod
										</div>
									</div>

									{/* Contenido del dashboard */}
									<div className="p-8">
										{/* Métricas principales */}
										<div className="grid grid-cols-3 gap-4 mb-8">
											{[
												{
													label: "Evaluaciones",
													value: "2,847",
													change: "+124 hoy",
													icon: BarChart3,
												},
												{
													label: "Zonas Activas",
													value: "34",
													change: "+2 nuevas",
													icon: MapPin,
												},
												{
													label: "Sync 100%",
													value: "<3s",
													change: "En vivo",
													icon: Zap,
												},
											].map((metric, idx) => {
												const Icon = metric.icon;
												return (
													<div
														key={idx}
														className="bg-gradient-to-br from-slate-700/60 to-slate-800/60 rounded-lg p-4 border border-orange-500/30 hover:border-orange-500/60 transition-all"
													>
														<div className="flex items-center justify-between mb-2">
															<p className="text-xs text-gray-400 font-semibold uppercase">
																{metric.label}
															</p>
															<Icon className="w-4 h-4 text-orange-500" />
														</div>
														<p className="text-2xl font-black text-orange-400">
															{metric.value}
														</p>
														<p className="text-xs text-orange-500/70 mt-1 font-semibold">
															{metric.change}
														</p>
													</div>
												);
											})}
										</div>

										{/* Gráfico animado */}
										<div className="bg-gradient-to-br from-slate-700/40 to-slate-800/40 rounded-lg p-4 border border-orange-500/20 h-40 flex items-end justify-around gap-2">
											{[45, 65, 52, 78, 85, 72, 90, 68].map((h, i) => (
												<div
													key={i}
													className="flex-1 bg-gradient-to-t from-orange-500 to-orange-400 rounded-t opacity-80 hover:opacity-100 hover:from-orange-400 hover:to-orange-300 transition-all group"
													style={{
														height: `${h}%`,
														animationDelay: `${i * 0.1}s`,
													}}
												>
													<div className="text-xs font-bold text-center pt-1 opacity-0 group-hover:opacity-100">
														{h}%
													</div>
												</div>
											))}
										</div>

										{/* Estado */}
										<div className="mt-6 pt-6 border-t border-slate-700/50 flex items-center justify-between text-sm">
											<div className="flex items-center gap-2">
												<Activity className="w-4 h-4 text-green-500 animate-pulse" />
												<span className="text-gray-300 font-medium">
													Sincronización activa
												</span>
											</div>
											<div className="text-orange-400 font-bold">
												+5 evaluaciones en últimas 2 min
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Características del sistema */}
						<div className="space-y-5">
							{[
								{
									icon: MapPin,
									title: "Mapas GPS",
									desc: "Ubicación exacta de cada zona",
									badge: "Real-time",
								},
								{
									icon: Database,
									title: "Base de Datos",
									desc: "Almacenamiento seguro nacional",
									badge: "Cloud",
								},
								{
									icon: TrendingUp,
									title: "Análisis IA",
									desc: "Predicciones de necesidades",
									badge: "ML",
								},
								{
									icon: Shield,
									title: "Encriptación",
									desc: "AES-256 de datos sensibles",
									badge: "Seguro",
								},
							].map((item, idx) => {
								const Icon = item.icon;
								return (
									<div
										key={idx}
										className="group p-4 bg-gradient-to-r from-slate-800/50 to-slate-900/50 border-2 border-orange-500/20 rounded-xl hover:border-orange-500/50 hover:bg-orange-500/5 transition-all duration-300 cursor-pointer"
									>
										<div className="flex items-start gap-3">
											<div className="w-10 h-10 bg-gradient-to-br from-orange-500/40 to-orange-600/30 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:from-orange-500/60 group-hover:to-orange-600/50 transition-colors">
												<Icon className="w-5 h-5 text-orange-400" />
											</div>
											<div className="flex-1">
												<div className="flex items-center justify-between mb-1">
													<h4 className="font-bold text-white group-hover:text-orange-400 transition-colors text-sm">
														{item.title}
													</h4>
													<span className="text-xs bg-orange-500/20 border border-orange-500/40 text-orange-400 px-2 py-0.5 rounded font-mono">
														{item.badge}
													</span>
												</div>
												<p className="text-xs text-gray-500">{item.desc}</p>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</section>
			{/* ==================== ARQUITECTURA TECNOLÓGICA ====================  */}
			<section className="relative py-32 px-4 bg-gradient-to-b from-slate-900 to-slate-950 overflow-hidden">
				<div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>

				<div className="absolute inset-0 bg-[linear-gradient(rgba(255,140,0,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,140,0,.06)_1px,transparent_1px)] bg-[size:50px_50px] z-0"></div>

				<div className="max-w-7xl mx-auto relative z-10">
					<h2 className="text-5xl md:text-6xl font-black text-center mb-8">
						Arquitectura Tecnológica Avanzada
					</h2>
					<p className="text-center text-gray-400 text-xl mb-20 max-w-3xl mx-auto">
						Tres componentes integrados que revolucionan la gestión de
						emergencias
					</p>

					<div className="grid md:grid-cols-3 gap-8">
						{[
							{
								icon: Smartphone,
								title: "Aplicación Móvil",
								features: [
									"Formularios EDAN en campo",
									"Captura de fotos GPS",
									"Registro de familias afectadas",
									"Evaluación de daños",
									"Análisis de necesidades",
									"Sincronización automática",
								],
								platforms: "iOS & Android",
								highlight: "En el Lugar del Evento",
							},
							{
								icon: Network,
								title: "Backend Robusto",
								features: [
									"Base de datos centralizada",
									"API RESTful escalable",
									"Sincronización en tiempo real",
									"Algoritmos de análisis",
									"Gestión de usuarios",
									"Control de permisos",
								],
								platforms: "Cloud Native",
								highlight: "El Cerebro del Sistema",
							},
							{
								icon: BarChart3,
								title: "Plataforma Web",
								features: [
									"Centro de control visual",
									"Tablas interactivas",
									"Mapas dinámicos",
									"Gráficos estadísticos",
									"Generación de reportes PDF",
									"Gestión de permisos",
								],
								platforms: "Responsive",
								highlight: "Para la Oficina",
							},
						].map((component, idx) => {
							const Icon = component.icon;
							return (
								<div
									key={idx}
									className="group relative p-8 rounded-2xl border-2 border-orange-500/20 hover:border-orange-500/60 bg-gradient-to-br from-slate-800/40 to-slate-900/40 hover:from-slate-800/80 hover:to-slate-900/80 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20 overflow-hidden"
								>
									<div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

									<div className="relative z-10">
										<div className="mb-6 p-4 bg-gradient-to-br from-orange-500/30 to-orange-600/20 rounded-xl w-fit group-hover:from-orange-500/50 group-hover:to-orange-600/40 transition-colors">
											<Icon className="w-8 h-8 text-orange-400" />
										</div>

										<h3 className="text-2xl font-black mb-2 group-hover:text-orange-400 transition-colors">
											{component.title}
										</h3>
										<p className="text-sm text-orange-400/70 font-semibold mb-6 uppercase tracking-wider">
											{component.highlight}
										</p>

										<ul className="space-y-3 mb-8">
											{component.features.map((feature, fidx) => (
												<li
													key={fidx}
													className="flex items-start gap-2 text-gray-300 text-sm"
												>
													<CheckCircle2 className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
													<span>{feature}</span>
												</li>
											))}
										</ul>

										<div className="pt-6 border-t border-slate-700/50">
											<p className="text-xs font-mono text-orange-400 bg-orange-500/10 p-3 rounded font-semibold">
												{component.platforms}
											</p>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</section>
			{/* ==================== CARACTERÍSTICAS TECNOLÓGICAS ====================  */}
			<section className="relative py-32 px-4">
				<div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>

				<div className="max-w-7xl mx-auto">
					<h2 className="text-5xl md:text-6xl font-black text-center mb-8">
						Potencia Tecnológica
					</h2>
					<p className="text-center text-gray-400 text-xl mb-20 max-w-3xl mx-auto">
						Características que hacen de EDANOS la solución más avanzada para
						gestión de emergencias
					</p>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{[
							{
								icon: MapPin,
								title: "Geolocalización Exacta",
								description:
									"GPS en vivo de cada zona afectada, mapas interactivos con actualizaciones en tiempo real",
								color: "from-orange-600 to-orange-500",
							},
							{
								icon: BarChart3,
								title: "Análisis Predictivo",
								description:
									"Algoritmos IA para predecir necesidades, tendencias y áreas de mayor impacto",
								color: "from-orange-500 to-amber-500",
							},
							{
								icon: Zap,
								title: "Sincronización <3s",
								description:
									"Datos sincronizados en menos de 3 segundos desde campo a plataforma central",
								color: "from-amber-500 to-orange-500",
							},
							{
								icon: Clock,
								title: "Disponibilidad 24/7",
								description:
									"Acceso permanente sin interrupciones, respuesta inmediata a emergencias",
								color: "from-orange-500 to-red-500",
							},
							{
								icon: Lock,
								title: "Encriptación AES-256",
								description:
									"Máxima seguridad de datos sensibles de personas afectadas y familias",
								color: "from-red-500 to-orange-500",
							},
							{
								icon: Users,
								title: "Control de Permisos",
								description:
									"Gestión granular de acceso por usuario, rol y seccional",
								color: "from-orange-600 to-amber-600",
							},
						].map((feature, idx) => {
							const IconComponent = feature.icon;
							return (
								<div
									key={idx}
									className="group relative p-8 rounded-2xl border-2 border-orange-500/20 hover:border-orange-500/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50 hover:from-slate-800/80 hover:to-slate-900/80 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20 cursor-pointer overflow-hidden"
								>
									<div
										className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`}
									></div>

									<div className="relative z-10">
										<div
											className={`mb-6 inline-block p-4 bg-gradient-to-br ${feature.color} rounded-xl opacity-90 group-hover:opacity-100 transition-opacity`}
										>
											<IconComponent className="w-7 h-7 text-white" />
										</div>
										<h3 className="text-2xl font-black mb-3 group-hover:text-orange-400 transition-colors">
											{feature.title}
										</h3>
										<p className="text-gray-400 leading-relaxed">
											{feature.description}
										</p>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</section>
			{/* ==================== ESTADÍSTICAS Y IMPACTO ====================  */}
			<section className="relative py-32 px-4 bg-gradient-to-b from-slate-900 to-slate-950 overflow-hidden">
				<div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>

				<div className="absolute inset-0 overflow-hidden z-0">
					<div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
				</div>

				<div className="max-w-7xl mx-auto relative z-10">
					<h2 className="text-5xl md:text-6xl font-black text-center mb-8">
						Impacto Tecnológico
					</h2>
					<p className="text-center text-gray-400 text-xl mb-20">
						Métricas que demuestran la potencia de la transformación digital en
						Protección Civil
					</p>

					<div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
						{[
							{
								metric: "99.9%",
								label: "Uptime Garantizado",
								icon: Activity,
							},
							{ metric: "<3s", label: "Latencia Máxima", icon: Zap },
							{ metric: "∞", label: "Escalabilidad Nacional", icon: Network },
							{ metric: "24/7", label: "Monitoreo Permanente", icon: Clock },
						].map((stat, idx) => {
							const Icon = stat.icon;
							return (
								<div
									key={idx}
									className="relative p-8 rounded-2xl border-2 border-orange-500/30 bg-gradient-to-br from-slate-800/50 to-slate-900/50 text-center group hover:border-orange-500/60 hover:from-slate-800/80 hover:to-slate-900/80 transition-all duration-300 overflow-hidden"
								>
									<div className="absolute inset-0 bg-gradient-to-r from-orange-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
									<div className="relative z-10">
										<Icon className="w-8 h-8 text-orange-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
										<div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent mb-2">
											{stat.metric}
										</div>
										<p className="text-gray-400 font-semibold text-sm">
											{stat.label}
										</p>
									</div>
								</div>
							);
						})}
					</div>

					<div className="bg-gradient-to-r from-orange-500/10 to-slate-900/50 border-2 border-orange-500/30 rounded-2xl p-12 text-center">
						<h3 className="text-3xl font-black mb-4">
							Transformación Digital Completa
						</h3>
						<p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
							De procesos manuales en papel a un sistema integrado de
							inteligencia en tiempo real. EDANOS centraliza, automatiza y
							acelera la respuesta a emergencias en Venezuela.
						</p>
						<div className="flex flex-wrap justify-center gap-4">
							{[
								"Datos en Tiempo Real",
								"Análisis Automático",
								"Coordinación Nacional",
								"Respuesta Rápida",
							].map((tag, i) => (
								<span
									key={i}
									className="px-4 py-2 bg-orange-500/20 border border-orange-500/50 text-orange-400 rounded-full font-semibold text-sm"
								>
									{tag}
								</span>
							))}
						</div>
					</div>
				</div>
			</section>
			{/* ==================== CONOCE SATC ====================  */}
			<section className="relative py-32 px-4 bg-gradient-to-b from-slate-900 to-slate-950 overflow-hidden">
				<div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>

				<div className="absolute inset-0 bg-[linear-gradient(rgba(255,140,0,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,140,0,.04)_1px,transparent_1px)] bg-[size:60px_60px] z-0 opacity-30"></div>

				<div className="max-w-4xl mx-auto text-center relative z-10">
					<div className="inline-block mb-6 px-4 py-2 bg-orange-500/10 border-2 border-orange-500/30 rounded-full">
						<span className="text-orange-400 font-bold text-sm uppercase tracking-wider">
							Nueva Funcionalidad
						</span>
					</div>

					<h2 className="text-5xl md:text-6xl font-black mb-8">
						Conoce{" "}
						<span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
							SATC
						</span>
					</h2>
					<p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
						Sistema de Alerta Temprana Comunal de Gabriel Osuna . Descubre cómo
						esta PROPUESTA nueva revoluciona la coordinación y respuesta ante
						emergencias mediante notificaciones inteligentes.
					</p>

					<div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-2 border-orange-500/30 rounded-3xl p-8 backdrop-blur-md shadow-2xl shadow-orange-500/10 max-w-2xl mx-auto group hover:border-orange-500/50 transition-all duration-300">
						<div className="flex items-center justify-center gap-4 mb-6">
							<div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center animate-pulse">
								<Radio className="w-6 h-6 text-orange-500" />
							</div>
							<span className="text-white font-bold text-lg">
								Escuchar Presentación
							</span>
						</div>
						<audio
							controls
							className="w-full h-12 rounded-lg accent-orange-500"
						>
							<source src="/satc.mp3" type="audio/mpeg" />
							Tu navegador no soporta el elemento de audio.
						</audio>
					</div>
				</div>
			</section>
			{/* ==================== REGISTRO INSTITUCIONAL ====================  */}
			<section className="relative py-32 px-4 bg-gradient-to-b from-slate-950 to-slate-900 overflow-hidden">
				<div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>
				<div className="absolute inset-0 bg-[linear-gradient(rgba(255,140,0,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,140,0,.04)_1px,transparent_1px)] bg-[size:60px_60px] z-0 opacity-50"></div>
				<div className="absolute inset-0 overflow-hidden z-0">
					<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
				</div>
				<div className="max-w-6xl mx-auto relative z-10">
					<div className="text-center mb-16">
						<div className="inline-block mb-6 px-4 py-2 bg-orange-500/10 border-2 border-orange-500/30 rounded-full">
							<span className="text-orange-400 font-bold text-sm uppercase tracking-wider">
								Solicitud de Acceso
							</span>
						</div>
						<h2 className="text-5xl md:text-6xl font-black mb-8">
							Registro{" "}
							<span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
								Institucional
							</span>
						</h2>
						<p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-8">
							¿Tu institución desea formar parte de EDANOS? Completa el
							formulario de solicitud y adjunta la carta formal firmada por el
							Director o Coordinador.
						</p>
						<div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
							{[
								{
									step: "1",
									title: "Completa el Formulario",
									desc: "Ingresa los datos de tu institución y responsable",
								},
								{
									step: "2",
									title: "Adjunta Carta Formal",
									desc: "Sube la carta firmada en formato PDF",
								},
								{
									step: "3",
									title: "Espera Aprobación",
									desc: "Recibirás credenciales por email tras la revisión",
								},
							].map((item, idx) => (
								<div
									key={idx}
									className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-2 border-orange-500/20 rounded-xl hover:border-orange-500/50 transition-all"
								>
									<div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 font-black text-2xl">
										{item.step}
									</div>
									<h4 className="font-bold text-white mb-2">{item.title}</h4>
									<p className="text-sm text-gray-400">{item.desc}</p>
								</div>
							))}
						</div>
					</div>
					{/* Formulario de Registro */}
					<RegistrationForm />
				</div>
			</section>
			{/* ==================== SECCIÓN APP EDOS ==================== */}
			<EdosAppSection />;
			{/* ==================== CTA FINAL ====================  */}
			<section className="relative py-32 px-4 overflow-hidden">
				<div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>
				<div className="absolute inset-0 bg-[linear-gradient(rgba(255,140,0,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,140,0,.04)_1px,transparent_1px)] bg-[size:60px_60px] z-0"></div>

				<div className="max-w-5xl mx-auto text-center relative z-10">
					<div className="inline-block mb-6 px-4 py-2 bg-orange-500/10 border-2 border-orange-500/30 rounded-full">
						<span className="text-orange-400 font-bold text-sm uppercase tracking-wider">
							Transformación Digital
						</span>
					</div>

					<h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
						Transforma tu Gestión de Emergencias
					</h2>
					<p className="text-xl text-gray-400 mb-16 leading-relaxed max-w-3xl mx-auto">
						EDANOS es más que un software. Es una revolución tecnológica que
						empodera a Protección Civil con datos precisos, análisis en tiempo
						real y coordinación nacional para salvar vidas.
					</p>

					<div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
						<ButtonLink to="/login">Acceder Ahora</ButtonLink>

						<ButtonLink to="https://chat.whatsapp.com/E3QbEHoRdVRBTlVhnzwplr">
							Unete a nuestro grupo
						</ButtonLink>
					</div>

					{/* Footer con información del proyecto */}
					<div className="pt-20 border-t-2 border-slate-800/50 grid md:grid-cols-3 gap-8 text-sm">
						{[
							{
								label: "Ideado y Desarrollado por",
								value: "Gabriel Osuna",
								desc: "Desarrollador de Software & Ex-Funcionario de Protección Civil Mérida",
							},
							{
								label: "Ubicación",
								value: "Mérida, Venezuela",
								desc: "Herramienta tecnológica para toda Venezuela",
							},
							{
								label: "Objetivo",
								value: "Gestión Nacional de Desastres",
								desc: "Unificar y fortalecer capacidades de Protección Civil",
							},
						].map((item, idx) => (
							<div key={idx} className="text-center">
								<p className="text-gray-500 mb-2 text-xs uppercase tracking-wider">
									{item.label}
								</p>
								<p className="font-black text-orange-400 text-xl mb-2">
									{item.value}
								</p>
								<p className="text-gray-500 text-xs leading-relaxed">
									{item.desc}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}

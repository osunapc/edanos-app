import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useSeoJsonLd, proyectoSchema } from "../../hooks/useSeoJsonLd";

const ProyectoApiEdanos = () => {
	const jsonLd = proyectoSchema(
		"API EDANOS",
		"Primer backend nacional de Venezuela para gestión de riesgos y emergencias. Infraestructura tecnológica para Protección Civil.",
		"https://edanosapp.site/proyectos/api-edanos",
	);
	useSeoJsonLd({ script: jsonLd });

	useEffect(() => {
		document.title =
			"API EDANOS - Backend Nacional para Gestión de Riesgos y Emergencias | Venezuela";

		const updateMeta = (
			name: string,
			content: string,
			property: boolean = false,
		) => {
			const attr = property ? "property" : "name";
			let element = document.querySelector(`meta[${attr}="${name}"]`);
			if (!element) {
				element = document.createElement("meta");
				element.setAttribute(attr, name);
				document.head.appendChild(element);
			}
			element.setAttribute("content", content);
		};

		updateMeta(
			"description",
			"La API EDANOS es el primer backend nacional de Venezuela para gestión de riesgos y emergencias. Controla todas las operaciones del sistema. Somos pioneros en tecnología de emergencias.",
		);
		updateMeta(
			"keywords",
			"API gestión riesgos Venezuela, backend emergencias Venezuela, sistema nacional emergencias Venezuela, servidor datos protección civil Venezuela, infraestructura tecnológica emergencias Venezuela",
		);

		updateMeta("og:type", "website", true);
		updateMeta(
			"og:title",
			"API EDANOS - Backend Nacional Venezuela",
			true,
		);
		updateMeta(
			"og:description",
			"Primer backend nacional de Venezuela para gestión de riesgos y emergencias.",
			true,
		);
		updateMeta("og:url", window.location.href, true);
		updateMeta("og:image", "https://edanosapp.site/icon.png", true);

		updateMeta("twitter:card", "summary_large_image", false);
		updateMeta("twitter:title", "API EDANOS - Backend Venezuela", false);
		updateMeta(
			"twitter:description",
			"Primer backend nacional de gestión de riesgos. Primeros en Venezuela.",
			false,
		);

		return () => {
			document.title = "EDANOS";
		};
	}, []);

	return (
		<div className="min-h-screen bg-[#13161b] text-gray-300 py-12 px-4 sm:px-6 lg:px-8 font-sans">
			<div className="max-w-4xl mx-auto bg-[#1a1f26] rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
				<div className="bg-gradient-to-r from-slate-900/40 to-gray-900/40 p-8 border-b border-gray-800 flex flex-col items-center text-center">
					<Link
						to="/"
						className="self-start inline-flex items-center text-slate-400 hover:text-slate-300 transition-colors mb-6 group"
					>
						<span className="mr-2 group-hover:-translate-x-1 transition-transform">
							←
						</span>
						Volver al inicio
					</Link>

					<div className="mb-6">
						<div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-500 to-gray-600 p-1">
							<div className="w-full h-full rounded-full bg-[#1a1f26] flex items-center justify-center">
								<span className="text-3xl text-slate-400">⚙️</span>
							</div>
						</div>
					</div>

					<h1 className="text-3xl md:text-5xl font-bold text-white mb-2 tracking-tight">
						API EDANOS
					</h1>
					<p className="text-slate-400 font-semibold text-lg">
						Backend Nacional para Gestión de Riesgos
					</p>
					<p className="text-gray-400 mt-2">
						Venezuela • PRIMER BACKEND NACIONAL
					</p>
				</div>

				<div className="p-8 md:p-12 space-y-12">
					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-slate-500 pl-4">
							¿Qué es la API EDANOS?
						</h2>
						<p className="leading-relaxed text-gray-300 text-lg">
							La <strong>API EDANOS</strong> es el{" "}
							<strong>primer backend nacional de Venezuela</strong> diseñado
							específicamente para gestionar evaluaciones de daños y análisis de
							necesidades en emergencias. Es el cerebro que conecta la
							aplicación móvil, la plataforma web y el sistema de alertas,
							procesando y almacenando toda la información crítica del país.
						</p>
						<p className="leading-relaxed text-gray-300 mt-4">
							Esta infraestructura es el{" "}
							<strong>eje central del ecosistema EDANOS</strong>, garantizando que
							los datos de emergencia estén disponibles, seguros y actualizados
							cuando las autoridades los necesiten.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-slate-500 pl-4">
							Somos Pioneros en Venezuela
						</h2>
						<div className="bg-gradient-to-br from-slate-900/20 to-gray-900/20 p-6 rounded-xl border border-slate-900/30 mb-6">
							<p className="text-gray-200">
								<strong>La API EDANOS es el primer backend de gestión de riesgos
								desarrollado en Venezuela.</strong> Ninguna institución del país
								había creado anteriormente una infraestructura tecnológica
								dedicada exclusivamente a procesar datos de emergencias en
								tiempo real. Fuimos los pioneers en desarrollar esta capacidad.
							</p>
						</div>

						<div className="grid md:grid-cols-2 gap-4">
							<div className="bg-[#13161b] p-5 rounded-lg border border-gray-800">
								<h4 className="text-slate-400 font-bold mb-2">
									Infraestructura Nacional
								</h4>
								<p className="text-sm text-gray-400">
									<b>Primera en Venezuela</b> en crear un servidor dedicado
									para gestionar datos de emergencias a nivel nacional.
								</p>
							</div>
							<div className="bg-[#13161b] p-5 rounded-lg border border-gray-800">
								<h4 className="text-slate-400 font-bold mb-2">
									Datos Seguros
								</h4>
								<p className="text-sm text-gray-400">
									<b>Pioneros</b> en implementar medidas de seguridad
									específicas para proteger información sensible de emergencias
									nacionales.
								</p>
							</div>
						</div>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-blue-500 pl-4">
							El Problema que Resolvemos
						</h2>
						<p className="text-gray-400 mb-4">
							Antes de la API EDANOS, la infraestructura tecnológica para
							emergencias en Venezuela tenía:
						</p>
						<ul className="space-y-4 mb-8">
							<li className="flex items-start">
								<span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-900/50 flex items-center justify-center text-slate-400 font-bold mr-3">
									✕
								</span>
								<div>
									<strong className="text-white block">Sin Centralización</strong>
									<span className="text-gray-400">
										No existía un sistema que procesara y almacenara todos
										los datos de evaluaciones de daños del país.
									</span>
								</div>
							</li>
							<li className="flex items-start">
								<span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-900/50 flex items-center justify-center text-slate-400 font-bold mr-3">
									✕
								</span>
								<div>
									<strong className="text-white block">Datos no Disponibles</strong>
									<span className="text-gray-400">
										La información se perdía o no estaba accesible para los
										que tomaban decisiones.
									</span>
								</div>
							</li>
							<li className="flex items-start">
								<span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-900/50 flex items-center justify-center text-slate-400 font-bold mr-3">
									✕
								</span>
								<div>
									<strong className="text-white block">Sin Sincronización</strong>
									<span className="text-gray-400">
										No había forma de tener datos actualizados en tiempo
										real desde diferentes ubicaciones.
									</span>
								</div>
							</li>
						</ul>
						<p className="text-gray-300 font-semibold text-lg">
							La API EDANOS soluciona todo esto.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-purple-500 pl-4">
							¿Qué hace la API EDANOS?
						</h2>
						<div className="grid md:grid-cols-2 gap-4">
							<div className="bg-[#13161b] p-5 rounded-lg border border-gray-800">
								<h4 className="text-blue-400 font-bold mb-1">
									Procesamiento Centralizado
								</h4>
								<p className="text-sm text-gray-400">
									Recibe, valida y almacena todas las evaluaciones de daños
									enviadas desde la aplicación móvil.
								</p>
							</div>
							<div className="bg-[#13161b] p-5 rounded-lg border border-gray-800">
								<h4 className="text-blue-400 font-bold mb-1">
									Sincronización en Tiempo Real
								</h4>
								<p className="text-sm text-gray-400">
									Actualiza la plataforma web instantáneamente cuando llegan
									nuevos datos de emergencia.
								</p>
							</div>
							<div className="bg-[#13161b] p-5 rounded-lg border border-gray-800">
								<h4 className="text-blue-400 font-bold mb-1">
									Gestión de Usuarios
								</h4>
								<p className="text-sm text-gray-400">
									Controla el acceso de funcionarios de Protección Civil a
									través de autenticación segura.
								</p>
							</div>
							<div className="bg-[#13161b] p-5 rounded-lg border border-gray-800">
								<h4 className="text-blue-400 font-bold mb-1">
									Integración de Alerts
								</h4>
								<p className="text-sm text-gray-400">
									Conecta con el sistema SATOS para activar notificaciones a
									comunidades cuando se detectan emergencias.
								</p>
							</div>
						</div>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-slate-500 pl-4">
							Objetivo: Infraestructura Nacional
						</h2>
						<div className="border border-gray-700 bg-gray-800/50 p-6 rounded-lg">
							<p className="text-gray-300">
								La API EDANOS busca establecer una{" "}
								<strong>infraestructura tecnológica nacional</strong> para la
								gestión de riesgos. Creemos que Venezuela necesita su propia
								tecnología para manejar sus emergencias, sin depender de
								sistemas externos que pueden fallar o no adaptarse a nuestra
								realidad.
							</p>
							<p className="text-gray-300 mt-4">
								Este proyecto es el resultado de un{" "}
								<strong>grupo de investigación tecnológica</strong> que trabaja
								por <strong>Venezuela</strong>. A pesar de los obstáculos,
								seguimos construyendo la infraestructura que nuestro país
								necesita para estar preparado ante cualquier emergencia.
							</p>
						</div>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-purple-500 pl-4">
							El Creador
						</h2>
						<p className="leading-relaxed text-gray-300">
							La API EDANOS fue creada por{" "}
							<Link
								to="/gabriel-osuna"
								className="text-slate-400 hover:text-slate-300 underline"
							>
								Gabriel Leonardo Espitia Osuna
							</Link>
							, desarrollador de software y{" "}
							<strong>exfuncionario de Protección Civil</strong> del estado
							Mérida. Gabriel entiende que una buena tecnología de emergencia
							requiere una infraestructura sólida y confiable, y eso es lo que
							ha construido.
						</p>
						<p className="leading-relaxed text-gray-300 mt-4">
							Esta API representa la{" "}
							<strong>visión de un desarrollador Mérida</strong> que cree en la
							soberanía tecnológica de Venezuela.{" "}
							<strong>Somos pioneros en crear esta infraestructura</strong> y
							seguiremos mejorándola para ayudar a nuestro país.
						</p>
					</section>

					<div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
						<p className="mb-2">
							© {new Date().getFullYear()} API EDANOS. Todos los derechos
							reservados.
						</p>
						<p className="text-xs">
							Desarrollado en Mérida, Venezuela. PRIMER backend nacional para
							gestión de riesgos.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProyectoApiEdanos;
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useSeoJsonLd, proyectoSchema } from "../../hooks/useSeoJsonLd";

const ProyectoPlataformaWeb = () => {
	const jsonLd = proyectoSchema(
		"Plataforma Web EDANOS",
		"Primer dashboard nacional de gestión de riesgos en tiempo real de Venezuela. Visualización de datos, mapas interactivos para Protección Civil.",
		"https://edanosapp.site/proyectos/plataforma-web",
	);
	useSeoJsonLd({ script: jsonLd });

	useEffect(() => {
		document.title =
			"Plataforma Web EDANOS - Dashboard de Gestión de Riesgos en Tiempo Real | Venezuela";

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
			"La plataforma web EDANOS es el primer dashboard nacional de gestión de riesgos en tiempo real de Venezuela. Visualización de datos, mapas interactivos y estadísticas para Protección Civil.",
		);
		updateMeta(
			"keywords",
			"dashboard gestión riesgos Venezuela, plataforma web emergencias Venezuela, visualización datos protección civil, mapa georreferenciado Venezuela, estadísticas desastres Venezuela, monitoreo tiempo real Venezuela",
		);

		updateMeta("og:type", "website", true);
		updateMeta(
			"og:title",
			"Plataforma Web EDANOS - Dashboard Venezuela",
			true,
		);
		updateMeta(
			"og:description",
			"Primer dashboard nacional de gestión de riesgos de Venezuela. Visualización en tiempo real.",
			true,
		);
		updateMeta("og:url", window.location.href, true);
		updateMeta("og:image", "https://edanosapp.site/icon.png", true);

		updateMeta("twitter:card", "summary_large_image", false);
		updateMeta(
			"twitter:title",
			"Plataforma Web EDANOS Venezuela",
			false,
		);
		updateMeta(
			"twitter:description",
			"Dashboard de gestión de riesgos. Primeros en Venezuela.",
			false,
		);

		return () => {
			document.title = "EDANOS";
		};
	}, []);

	return (
		<div className="min-h-screen bg-[#13161b] text-gray-300 py-12 px-4 sm:px-6 lg:px-8 font-sans">
			<div className="max-w-4xl mx-auto bg-[#1a1f26] rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
				<div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 p-8 border-b border-gray-800 flex flex-col items-center text-center">
					<Link
						to="/"
						className="self-start inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors mb-6 group"
					>
						<span className="mr-2 group-hover:-translate-x-1 transition-transform">
							←
						</span>
						Volver al inicio
					</Link>

					<div className="mb-6">
						<div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-1">
							<div className="w-full h-full rounded-full bg-[#1a1f26] flex items-center justify-center">
								<span className="text-3xl text-indigo-400">🖥️</span>
							</div>
						</div>
					</div>

					<h1 className="text-3xl md:text-5xl font-bold text-white mb-2 tracking-tight">
						Plataforma Web EDANOS
					</h1>
					<p className="text-indigo-400 font-semibold text-lg">
						Dashboard de Gestión de Riesgos en Tiempo Real
					</p>
					<p className="text-gray-400 mt-2">
						Venezuela • PRIMER DASHBOARD NACIONAL
					</p>
				</div>

				<div className="p-8 md:p-12 space-y-12">
					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-indigo-500 pl-4">
							¿Qué es la Plataforma Web?
						</h2>
						<p className="leading-relaxed text-gray-300 text-lg">
							La <strong>Plataforma Web EDANOS</strong> es el{" "}
							<strong>primer dashboard nacional de gestión de riesgos en tiempo
							real de Venezuela</strong>. Es el centro de comando donde las
							autoridades de Protección Civil pueden visualizar, analizar y
							coordinar la respuesta ante emergencias desde cualquier lugar con
							conexión a internet.
						</p>
						<p className="leading-relaxed text-gray-300 mt-4">
							Esta plataforma representa el{" "}
							<strong>ojo tecnológico que Venezuela necesitaba</strong> para
							tomar decisiones informadas durante desastres. Con información
							actualizada en tiempo real, los coordinadores pueden ver
							exactamente qué está pasando en cada zona del país.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-indigo-500 pl-4">
							Somos Pioneros en Venezuela
						</h2>
						<div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 p-6 rounded-xl border border-indigo-900/30 mb-6">
							<p className="text-gray-200">
								<strong>La Plataforma Web EDANOS es el primer dashboard completo
								de gestión de riesgos desarrollado en Venezuela.</strong> Antes
								de nosotros, no existía una herramienta que permitiera a las
								autoridades visualizar en tiempo real todas las evaluaciones de
								daños del país en un solo lugar. Fuimos los pioneers.
							</p>
						</div>

						<div className="grid md:grid-cols-2 gap-4">
							<div className="bg-[#13161b] p-5 rounded-lg border border-gray-800">
								<h4 className="text-indigo-400 font-bold mb-2">
									Dashboard Nacional
								</h4>
								<p className="text-sm text-gray-400">
									<b>Primero en Venezuela</b> en centralizar todas las
									evaluaciones de daños del país en un solo dashboard
									interactivo.
								</p>
							</div>
							<div className="bg-[#13161b] p-5 rounded-lg border border-gray-800">
								<h4 className="text-indigo-400 font-bold mb-2">
									Tiempo Real
								</h4>
								<p className="text-sm text-gray-400">
									Primero sistema en Venezuela con actualización en tiempo
									real de datos de emergencia mediante WebSocket.
								</p>
							</div>
						</div>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-blue-500 pl-4">
							El Problema que Resolvemos
						</h2>
						<p className="text-gray-400 mb-4">
							Antes de la Plataforma Web, las autoridades en Venezuela tenían:
						</p>
						<ul className="space-y-4 mb-8">
							<li className="flex items-start">
								<span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-400 font-bold mr-3">
									✕
								</span>
								<div>
									<strong className="text-white block">Información Fragmentada</strong>
									<span className="text-gray-400">
										Los datos de diferentes regiones no estaban integrados,
										creando una imagen incompleta de la situación real.
									</span>
								</div>
							</li>
							<li className="flex items-start">
								<span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-400 font-bold mr-3">
									✕
								</span>
								<div>
									<strong className="text-white block">Sin Visualización Geográfica</strong>
									<span className="text-gray-400">
										No había forma de ver en un mapa dónde estaban los daños
										más críticos en todo el país.
									</span>
								</div>
							</li>
							<li className="flex items-start">
								<span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-400 font-bold mr-3">
									✕
								</span>
								<div>
									<strong className="text-white block">Decisiones a Ciegas</strong>
									<span className="text-gray-400">
										Sin estadísticas en tiempo real, era difícil determinar
										dónde concentrar los recursos primero.
									</span>
								</div>
							</li>
						</ul>
						<p className="text-gray-300 font-semibold text-lg">
							La Plataforma Web soluciona todo esto.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-purple-500 pl-4">
							¿Qué hace la Plataforma Web?
						</h2>
						<div className="grid md:grid-cols-2 gap-4">
							<div className="bg-[#13161b] p-5 rounded-lg border border-gray-800">
								<h4 className="text-blue-400 font-bold mb-1">
									Mapas Interactivos
								</h4>
								<p className="text-sm text-gray-400">
									Visualización geográfica de todos los daños reportados con
									ubicación exacta en mapas interactivos.
								</p>
							</div>
							<div className="bg-[#13161b] p-5 rounded-lg border border-gray-800">
								<h4 className="text-blue-400 font-bold mb-1">
									Estadísticas en Tiempo Real
								</h4>
								<p className="text-sm text-gray-400">
									Gráficos y métricas automáticas que muestran la situación
									actual del país ante cualquier emergencia.
								</p>
							</div>
							<div className="bg-[#13161b] p-5 rounded-lg border border-gray-800">
								<h4 className="text-blue-400 font-bold mb-1">
									Gestión de Eventos
								</h4>
								<p className="text-sm text-gray-400">
									Organización de evaluaciones por evento específico
									(terremoto, inundación, incendio) para análisis comparativo.
								</p>
							</div>
							<div className="bg-[#13161b] p-5 rounded-lg border border-gray-800">
								<h4 className="text-blue-400 font-bold mb-1">
									Reportes Automáticos
								</h4>
								<p className="text-sm text-gray-400">
									Generación de reportes PDF oficiales para presentar a
									autoridades superiores.
								</p>
							</div>
						</div>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-indigo-500 pl-4">
							Objetivo: Coordinación Nacional
						</h2>
						<div className="border border-gray-700 bg-gray-800/50 p-6 rounded-lg">
							<p className="text-gray-300">
								La Plataforma Web EDANOS tiene como objetivo facilitar la{" "}
								<strong>coordinación nacional</strong> ante emergencias. Con
								todos los datos centralizados y en tiempo real, los
								coordinadores de diferentes regiones pueden trabajar juntos
								como nunca antes. Ya no hay excusa para la descoordinación.
							</p>
							<p className="text-gray-300 mt-4">
								Este proyecto es el resultado de un{" "}
								<strong>grupo de investigación tecnológica</strong> que trabaja
								por <strong>Venezuela</strong>. Creemos que con las herramientas
								correctas, podemos transformar la forma en que respondemos a las
								emergencias en nuestro país.
							</p>
						</div>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-purple-500 pl-4">
							El Creador
						</h2>
						<p className="leading-relaxed text-gray-300">
							La Plataforma Web fue creada por{" "}
							<Link
								to="/gabriel-osuna"
								className="text-indigo-400 hover:text-indigo-300 underline"
							>
								Gabriel Leonardo Espitia Osuna
							</Link>
							, desarrollador de software y{" "}
							<strong>exfuncionario de Protección Civil</strong> del estado
							Mérida. Gabriel, que pasó años en el terreno de las emergencias,
							entendió exactamente qué necesitan los coordinadores para tomar
							decisiones efectivas.
						</p>
						<p className="leading-relaxed text-gray-300 mt-4">
							Esta plataforma representa la visión de un{" "}
							<strong>desarrollador Mérida</strong> que cree que la tecnología
							puede transformar la gestión de emergencias en Venezuela.
							<strong>Somos pioneros y seguimos innovando</strong> para ayudar a
							nuestro país.
						</p>
					</section>

					<div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
						<p className="mb-2">
							© {new Date().getFullYear()} Plataforma Web EDANOS. Todos los
							derechos reservados.
						</p>
						<p className="text-xs">
							Desarrollado en Mérida, Venezuela. PRIMER dashboard nacional de
							gestión de riesgos.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProyectoPlataformaWeb;
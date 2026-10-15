import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useSeoJsonLd, proyectoSchema } from "../../hooks/useSeoJsonLd";

const ProyectoEdanos = () => {
	const jsonLd = proyectoSchema(
		"EDANOS",
		"Primer sistema nacional de Venezuela para gestión de evaluación de daños y análisis de necesidades en emergencias. Tecnología pioneer para protección civil.",
		"https://edanosapp.site/proyectos/edanos",
	);
	useSeoJsonLd({ script: jsonLd });

	useEffect(() => {
		document.title =
			"EDANOS - Sistema de Gestión de Evaluación de Daños y Análisis de Necesidades | Venezuela";

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
			"EDANOS es el primer sistema nacional de gestión de evaluación de daños y análisis de necesidades en Venezuela. Desarrollado por pioneros en tecnología de gestión de riesgos y protección civil en el país.",
		);
		updateMeta(
			"keywords",
			"EDANOS, evaluación de daños Venezuela, análisis de necesidades, gestión de riesgos Venezuela, protección civil Venezuela, sistema de emergencias Venezuela, software nacional Venezuela, innovación tecnológica venezolana, alerta temprana, prevención de desastres Venezuela, pionera",
		);

		updateMeta("og:type", "website", true);
		updateMeta(
			"og:title",
			"EDANOS - Sistema Nacional de Gestión de Riesgos | Venezuela",
			true,
		);
		updateMeta(
			"og:description",
			"Primero sistema nacional de Venezuela para gestión de evaluación de daños y análisis de necesidades. Somos pioneros en tecnología de protección civil.",
			true,
		);
		updateMeta("og:url", window.location.href, true);
		updateMeta("og:image", "https://edanosapp.site/icon.png", true);

		updateMeta("twitter:card", "summary_large_image", false);
		updateMeta(
			"twitter:title",
			"EDANOS - Gestión de Riesgos Venezuela",
			false,
		);
		updateMeta(
			"twitter:description",
			"Sistema nacional de evaluación de daños y análisis de necesidades. Primeros en Venezuela.",
			false,
		);

		return () => {
			document.title = "EDANOS";
		};
	}, []);

	return (
		<div className="min-h-screen bg-[#13161b] text-gray-300 py-12 px-4 sm:px-6 lg:px-8 font-sans">
			<div className="max-w-4xl mx-auto bg-[#1a1f26] rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
				<div className="bg-gradient-to-r from-orange-900/40 to-red-900/40 p-8 border-b border-gray-800 flex flex-col items-center text-center">
					<Link
						to="/"
						className="self-start inline-flex items-center text-orange-400 hover:text-orange-300 transition-colors mb-6 group"
					>
						<span className="mr-2 group-hover:-translate-x-1 transition-transform">
							←
						</span>
						Volver al inicio
					</Link>

					<div className="mb-6">
						<div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-red-600 p-1">
							<div className="w-full h-full rounded-full bg-[#1a1f26] flex items-center justify-center">
								<span className="text-3xl text-orange-400">🏛️</span>
							</div>
						</div>
					</div>

					<h1 className="text-3xl md:text-5xl font-bold text-white mb-2 tracking-tight">
						EDANOS
					</h1>
					<p className="text-orange-400 font-semibold text-lg">
						Sistema de Evaluación de Daños y Análisis de Necesidades
					</p>
					<p className="text-gray-400 mt-2">
						Venezuela • PRIMER SISTEMA NACIONAL
					</p>
				</div>

				<div className="p-8 md:p-12 space-y-12">
					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-orange-500 pl-4">
							¿Qué es EDANOS?
						</h2>
						<p className="leading-relaxed text-gray-300 text-lg">
							<strong>EDANOS</strong> (Evaluación de Daños y Análisis de
							Necesidades) es el{" "}
							<strong>primer sistema tecnológico nacional de Venezuela</strong>{" "}
							diseñado para la <strong>gestión de riesgos</strong>, la{" "}
							<strong>protección civil</strong> y la{" "}
							<strong>administración de desastres</strong>. Representa la
							alternativa real a los métodos manuales y obsoletos que durante
							décadas han dificultado la respuesta efectiva ante emergencias
							en nuestro país.
						</p>
						<p className="leading-relaxed text-gray-300 mt-4">
							Este sistema permite que el personal de Protección Civil,
							coordinadores de emergencia y autoridades puedan capturar,
							analizar y compartir datos de evaluación en tiempo real,
							eliminando los formularios de papel que siempre han sido un
							obstáculo para la coordinación efectiva durante los desastres.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-orange-500 pl-4">
							Somos Pioneros en Venezuela
						</h2>
						<div className="bg-gradient-to-br from-orange-900/20 to-red-900/20 p-6 rounded-xl border border-orange-900/30 mb-6">
							<p className="text-gray-200">
								<strong>EDANOS es el primer sistema completo de su tipo en
								Venezuela.</strong> Nadie en el país había desarrollado
								anteriormente una plataforma integral para la gestión de
								evaluación de daños y análisis de necesidades. Fuimos los
								primeros en crear esta tecnología, estableciendo un
								precedente para la innovación nacional en gestión de riesgos.
							</p>
						</div>

						<div className="grid md:grid-cols-2 gap-4">
							<div className="bg-[#13161b] p-5 rounded-lg border border-gray-800">
								<h4 className="text-orange-400 font-bold mb-2">
									Derechos de Autor Registrados
								</h4>
								<p className="text-sm text-gray-400">
									EDANOS cuenta con <b>derechos de autor registrados</b> en
									SAPI (Servicio Autónomo de Propiedad Intelectual). Somos los
									<b>primeros y únicos</b> en Venezuela en desarrollar un
									sistema completo de esta naturaleza.
								</p>
							</div>
							<div className="bg-[#13161b] p-5 rounded-lg border border-gray-800">
								<h4 className="text-orange-400 font-bold mb-2">
									Tecnología 100% Nacional
								</h4>
								<p className="text-sm text-gray-400">
									Creado completamente en Venezuela, sin dependencias de
									tecnologías extranjeras. Nuestra infraestructura propia
									garantiza la continuidad del servicio cuando más se
									necesita.
								</p>
							</div>
						</div>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-blue-500 pl-4">
							El Problema que Resolvemos
						</h2>
						<p className="text-gray-400 mb-4">
							Antes de EDANOS, la evaluación de daños en Venezuela enfrentaba
							serios obstáculos:
						</p>
						<ul className="space-y-4 mb-8">
							<li className="flex items-start">
								<span className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-900/50 flex items-center justify-center text-orange-400 font-bold mr-3">
									✕
								</span>
								<div>
									<strong className="text-white block">Formularios de Papel</strong>
									<span className="text-gray-400">
										Los datos se recolectaban en papel, eran difíciles de
										organizar y frecuentemente se perdían o dañaban.
									</span>
								</div>
							</li>
							<li className="flex items-start">
								<span className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-900/50 flex items-center justify-center text-orange-400 font-bold mr-3">
									✕
								</span>
								<div>
									<strong className="text-white block">Sin Coordenación</strong>
									<span className="text-gray-400">
										Cada organismo trabajaba de forma aislada, sin compartir
										información ni tener una visión unificada de la situación.
									</span>
								</div>
							</li>
							<li className="flex items-start">
								<span className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-900/50 flex items-center justify-center text-orange-400 font-bold mr-3">
									✕
								</span>
								<div>
									<strong className="text-white block">Tomas de Decisión Lentas</strong>
									<span className="text-gray-400">
										Sin datos en tiempo real, las autoridades no podían
										responder de manera efectiva y oportuna.
									</span>
								</div>
							</li>
						</ul>
						<p className="text-gray-300 font-semibold text-lg">
							EDANOS soluciona todo esto.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-purple-500 pl-4">
							¿Qué hace EDANOS?
						</h2>
						<div className="grid md:grid-cols-2 gap-4">
							<div className="bg-[#13161b] p-5 rounded-lg border border-gray-800">
								<h4 className="text-blue-400 font-bold mb-1">
									Evaluación Digital
								</h4>
								<p className="text-sm text-gray-400">
									Sustituye los formularios de papel por evaluaciones digitales
									estructuradas que se almacenan de forma segura.
								</p>
							</div>
							<div className="bg-[#13161b] p-5 rounded-lg border border-gray-800">
								<h4 className="text-blue-400 font-bold mb-1">
									Ubicación Exacta
								</h4>
								<p className="text-sm text-gray-400">
									Cada evaluación incluye la ubicación exacta del daño,
									permitiendo visualizar en un mapa todas las zonas afectadas.
								</p>
							</div>
							<div className="bg-[#13161b] p-5 rounded-lg border border-gray-800">
								<h4 className="text-blue-400 font-bold mb-1">
									Dashboard en Tiempo Real
								</h4>
								<p className="text-sm text-gray-400">
									Estadísticas y gráficos automáticos para que las autoridades
									tomen decisiones informadas al instante.
								</p>
							</div>
							<div className="bg-[#13161b] p-5 rounded-lg border border-gray-800">
								<h4 className="text-blue-400 font-bold mb-1">
									Reportes Oficiales
								</h4>
								<p className="text-sm text-gray-400">
									Generación automática de reportes en PDF para presentar a
									autoridades y archivar como documentos oficiales.
								</p>
							</div>
						</div>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-orange-500 pl-4">
							Objetivo: Unificación Nacional
						</h2>
						<div className="border border-gray-700 bg-gray-800/50 p-6 rounded-lg">
							<p className="text-gray-300">
								El objetivo de EDANOS es la{" "}
								<strong>unificación nacional</strong>. El sistema está diseñado
								para que todos los niveles de Protección Civil a nivel regional
								y nacional compartan la misma información durante un desastre.
								Esto elimina la fragmentación que históricamente ha dificultado
								la coordinación de respuesta ante emergencias en Venezuela.
							</p>
							<p className="text-gray-300 mt-4">
								EDANOS representa la visión de un{" "}
								<strong>grupo de investigación tecnológica para la gestión de
								riesgos</strong> que trabaja por <strong>Venezuela</strong>. A
								pesar de los obstáculos burocráticos y los rechazos al cambio
								por parte de algunos directivos, seguimos trabajando porque
								creemos que la tecnología puede salvar vidas.
							</p>
						</div>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-purple-500 pl-4">
							El Creador
						</h2>
						<p className="leading-relaxed text-gray-300">
							EDANOS fue creado por{" "}
							<Link
								to="/gabriel-osuna"
								className="text-orange-400 hover:text-orange-300 underline"
							>
								Gabriel Leonardo Espitia Osuna
							</Link>
							, desarrollador de software y{" "}
							<strong>exfuncionario de Protección Civil</strong> del estado
							Mérida. Gabriel es un profesional Mérida que, tras años de luchar
							contra la burocracia venezolana y los rechazos institucionales, ha
							logrado crear un sistema que marca un{" "}
							<strong>hito en la historia de la tecnología venezolana</strong>.
						</p>
						<p className="leading-relaxed text-gray-300 mt-4">
							Este proyecto demuestra que desde Venezuela, condeterminación y
							compromiso, podemos desarrollar soluciones tecnológicas de clase
							mundial para la gestión de riesgos.{" "}
							<strong>Somos pioneros y seguiremos innovando</strong> sin importar
							los obstáculos.
						</p>
					</section>

					<div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
						<p className="mb-2">
							© {new Date().getFullYear()} EDANOS - Sistema Nacional de Gestión
							de Riesgos. Todos los derechos reservados.
						</p>
						<p className="text-xs">
							Desarrollado en Mérida, Venezuela. PRIMER sistema nacional para
							gestión de riesgos y protección civil.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProyectoEdanos;
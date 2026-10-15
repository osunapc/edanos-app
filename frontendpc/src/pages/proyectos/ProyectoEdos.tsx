import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useSeoJsonLd, proyectoSchema } from "../../hooks/useSeoJsonLd";

const ProyectoEdos = () => {
	const jsonLd = proyectoSchema(
		"EDOS",
		"Primer sistema de formación gamificada de Venezuela para Protección Civil, Bomberos, Rescatistas y Paramédicos. Capacitación con tecnología innovadora.",
		"https://edanosapp.site/proyectos/edos",
	);
	useSeoJsonLd({ script: jsonLd });

	useEffect(() => {
		document.title =
			"EDOS - Sistema de Formación Gamificada para Protección Civil y Emergencias | Venezuela";

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
			"EDOS es el primer sistema de formación gamificada de Venezuela para Protección Civil, Bomberos, Rescatistas y Paramédicos. Formación continua con tecnología innovadora. Somos pioneros.",
		);
		updateMeta(
			"keywords",
			"EDOS formación gamificada Venezuela, capacitación protección civil Venezuela, curso bomberos Venezuela, formación paramédicos Venezuela,quiz emergencias Venezuela, capacitación primera respuesta Venezuela, educación emergencias Venezuela, formación continua Protección Civil Venezuela",
		);

		updateMeta("og:type", "website", true);
		updateMeta(
			"og:title",
			"EDOS - Formación Gamificada Venezuela",
			true,
		);
		updateMeta(
			"og:description",
			"Primer sistema de formación gamificada para primera respuesta en Venezuela. Protección Civil, Bomberos, Paramédicos.",
			true,
		);
		updateMeta("og:url", window.location.href, true);
		updateMeta("og:image", "https://edanosapp.site/icon.png", true);

		updateMeta("twitter:card", "summary_large_image", false);
		updateMeta("twitter:title", "EDOS - Formación Venezuela", false);
		updateMeta(
			"twitter:description",
			"Sistema de formación gamificada. Primeros en Venezuela.",
			false,
		);

		return () => {
			document.title = "EDANOS";
		};
	}, []);

	return (
		<div className="min-h-screen bg-[#13161b] text-gray-300 py-12 px-4 sm:px-6 lg:px-8 font-sans">
			<div className="max-w-4xl mx-auto bg-[#1a1f26] rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
				<div className="bg-gradient-to-r from-emerald-900/40 to-cyan-900/40 p-8 border-b border-gray-800 flex flex-col items-center text-center">
					<Link
						to="/"
						className="self-start inline-flex items-center text-emerald-400 hover:text-emerald-300 transition-colors mb-6 group"
					>
						<span className="mr-2 group-hover:-translate-x-1 transition-transform">
							←
						</span>
						Volver al inicio
					</Link>

					<div className="mb-6">
						<div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-600 p-1">
							<div className="w-full h-full rounded-full bg-[#1a1f26] flex items-center justify-center">
								<span className="text-3xl text-emerald-400">🎮</span>
							</div>
						</div>
					</div>

					<h1 className="text-3xl md:text-5xl font-bold text-white mb-2 tracking-tight">
						EDOS
					</h1>
					<p className="text-emerald-400 font-semibold text-lg">
						Sistema de Formación Gamificada
					</p>
					<p className="text-gray-400 mt-2">
						Venezuela • PRIMER SISTEMA NACIONAL
					</p>
				</div>

				<div className="p-8 md:p-12 space-y-12">
					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-emerald-500 pl-4">
							¿Qué es EDOS?
						</h2>
						<p className="leading-relaxed text-gray-300 text-lg">
							<strong>EDOS</strong> es el{" "}
							<strong>primer sistema de formación gamificada de Venezuela</strong>{" "}
							diseñado específicamente para el{" "}
							<strong>fortalecimiento de capacidades</strong> en funcionarios de
							primera respuesta:{" "}
							<strong>Protección Civil, Bomberos, Rescatistas y Paramédicos</strong>.
						</p>
						<p className="leading-relaxed text-gray-300 mt-4">
							Este sistema combina la{" "}
							<strong>teoría técnica con una experiencia lúdica</strong> basada en
							misiones y progresión por niveles. Cada usuario puede seguir su
							propio aprendizaje y el progreso colectivo, creando una nueva forma
							de capacitación continua en Venezuela.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-emerald-500 pl-4">
							Somos Pioneros en Venezuela
						</h2>
						<div className="bg-gradient-to-br from-emerald-900/20 to-cyan-900/20 p-6 rounded-xl border border-emerald-900/30 mb-6">
							<p className="text-gray-200">
								<strong>EDOS es el primer sistema gamificado de capacitación
								para emergencias desarrollado en Venezuela.</strong> Fuimos los
								primeros en crear una plataforma que use mecánica de juegos
								para enseñar conocimientos críticos a Bomberos, Protección Civil
								y Paramédicos. Ninguna iniciativa en el país había hecho esto.
							</p>
						</div>

						<div className="grid md:grid-cols-2 gap-4">
							<div className="bg-[#13161b] p-5 rounded-lg border border-gray-800">
								<h4 className="text-emerald-400 font-bold mb-2">
									Derechos de Autor
								</h4>
								<p className="text-sm text-gray-400">
									EDOS cuenta con <b>derechos de autor registrados</b>. Somos
									los <b>primeros y únicos</b> en Venezuela en desarrollar un
									sistema completo de formación gamificada para emergencias.
								</p>
							</div>
							<div className="bg-[#13161b] p-5 rounded-lg border border-gray-800">
								<h4 className="text-emerald-400 font-bold mb-2">
									Estándares Internacionales
								</h4>
								<p className="text-sm text-gray-400">
									Contenido basado en guías internacionales como{" "}
									<b>AHA 2025</b>. Fuimos los primeros en adaptar estos
									estándares a una plataforma gamificada en Venezuela.
								</p>
							</div>
						</div>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-blue-500 pl-4">
							El Problema que Resolvemos
						</h2>
						<p className="text-gray-400 mb-4">
							Antes de EDOS, la capacitación de primera respuesta en Venezuela
							tenía:
						</p>
						<ul className="space-y-4 mb-8">
							<li className="flex items-start">
								<span className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-900/50 flex items-center justify-center text-emerald-400 font-bold mr-3">
									✕
								</span>
								<div>
									<strong className="text-white block">Formación Aburrida</strong>
									<span className="text-gray-400">
										Los cursos tradicionales eran monótonos, sin incentivos
										para continuar aprendiendo.
									</span>
								</div>
							</li>
							<li className="flex items-start">
								<span className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-900/50 flex items-center justify-center text-emerald-400 font-bold mr-3">
									✕
								</span>
								<div>
									<strong className="text-white block">Sin Seguimiento</strong>
									<span className="text-gray-400">
										No había forma de medir el progreso individual o
										colectivo de los capacitados.
									</span>
								</div>
							</li>
							<li className="flex items-start">
								<span className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-900/50 flex items-center justify-center text-emerald-400 font-bold mr-3">
									✕
								</span>
								<div>
									<strong className="text-white block">Contenido Desactualizado</strong>
									<span className="text-gray-400">
										Los materiales no seguían los estándares internacionales
										más recientes.
									</span>
								</div>
							</li>
						</ul>
						<p className="text-gray-300 font-semibold text-lg">
							EDOS soluciona todo esto.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-purple-500 pl-4">
							¿Qué hace EDOS?
						</h2>
						<div className="grid md:grid-cols-2 gap-4">
							<div className="bg-[#13161b] p-5 rounded-lg border border-gray-800">
								<h4 className="text-blue-400 font-bold mb-1">
									Misiones y Niveles
								</h4>
								<p className="text-sm text-gray-400">
									Aprendizaje basado en misiones que se desbloquean
									progresivamente. Cada nivel completado es un logro.
								</p>
							</div>
							<div className="bg-[#13161b] p-5 rounded-lg border border-gray-800">
								<h4 className="text-blue-400 font-bold mb-1">
									Motor de Quiz
								</h4>
								<p className="text-sm text-gray-400">
									Evaluaciones con retroalimentación inmediata. Cada respuesta
									explicada ayuda a aprender mejor.
								</p>
							</div>
							<div className="bg-[#13161b] p-5 rounded-lg border border-gray-800">
								<h4 className="text-blue-400 font-bold mb-1">
									Seguimiento de Progreso
								</h4>
								<p className="text-sm text-gray-400">
									API que registra niveles completados por cada funcionario,
									facilitando la auditoría de capacitación.
								</p>
							</div>
							<div className="bg-[#13161b] p-5 rounded-lg border border-gray-800">
								<h4 className="text-blue-400 font-bold mb-1">
									Contenido Especializado
								</h4>
								<p className="text-sm text-gray-400">
									RCP (AHA 2025), EDAN, Gestión de Riesgos, Materiales
									Peligrosos, Seguridad Laboral, Incendios Estructurales.
								</p>
							</div>
						</div>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-emerald-500 pl-4">
							Objetivo: Primera Respuesta Mejor Preparada
						</h2>
						<div className="border border-gray-700 bg-gray-800/50 p-6 rounded-lg">
							<p className="text-gray-300">
								El objetivo de EDOS es crear una{" "}
								<strong>generación de primera respuesta mejor preparada</strong> en
								Venezuela. Creemos que cuando un bombero, paramédico o rescate
								completa su capacitación de forma dinámica y divertida, retiene
								más información y responde mejor en situaciones reales.
							</p>
							<p className="text-gray-300 mt-4">
								Este sistema es el resultado de un{" "}
								<strong>grupo de investigación tecnológica</strong> que trabaja
								por <strong>Venezuela</strong>. Queremos que cada héroe de
								primera respuesta tenga las mejores herramientas para salvar
								vidas.
							</p>
						</div>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-purple-500 pl-4">
							El Creador
						</h2>
						<p className="leading-relaxed text-gray-300">
							EDOS fue creado por{" "}
							<Link
								to="/gabriel-osuna"
								className="text-emerald-400 hover:text-emerald-300 underline"
							>
								Gabriel Leonardo Espitia Osuna
							</Link>
							, desarrollador de software y{" "}
							<strong>exfuncionario de Protección Civil</strong> del estado
							Mérida. Gabriel, que ha worked firsthand con equipos de primera
							respuesta, entiende exactamente qué conocimientos son críticos y cómo
							transmitirlos efectivamente.
						</p>
						<p className="leading-relaxed text-gray-300 mt-4">
							EDOS representa la{" "}
							<strong>lucha de un desarrollador Mérida</strong> contra la falta de
							inversión en capacitación. Mientras las instituciones burocráticas
							se resisten a innovar, nosotros creamos soluciones que{" "}
							<strong>ayudan a los héroes de Venezuela</strong>.{" "}
							<strong>Somos pioneros y seguimos creando tecnología</strong> para
							proteger a quien protege.
						</p>
					</section>

					<div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
						<p className="mb-2">
							© {new Date().getFullYear()} EDOS - Sistema de Formación
							Gamificada. Todos los derechos reservados.
						</p>
						<p className="text-xs">
							Desarrollado en Mérida, Venezuela. PRIMER sistema de capacitación
							gamificada para emergencias.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProyectoEdos;
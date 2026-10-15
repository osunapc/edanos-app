import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useSeoJsonLd, proyectoSchema } from "../../hooks/useSeoJsonLd";

const ProyectoEdanosSchool = () => {
	const jsonLd = proyectoSchema(
		"EDANOS School",
		"Primera plataforma educativa online de Venezuela para gestión de riesgos, protección civil y evaluación de daños. Cursos certificados.",
		"https://edanosapp.site/proyectos/edanos-school",
	);
	useSeoJsonLd({ script: jsonLd });

	useEffect(() => {
		document.title =
			"EDANOS School - Primera Escuela Online de Gestión de Riesgos en Venezuela";

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
			"EDANOS School es la primera plataforma educativa online de Venezuela especializada en Gestión de Riesgos, Protección Civil y Evaluación de Daños. Certifícate desde cualquier lugar del país.",
		);
		updateMeta(
			"keywords",
			"EDANOS School, cursos gestión riesgos Venezuela, certificación protección civil, educación online Venezuela, curso EDAN, escuela desastres Venezuela, formación protección civil, aprender gestión riesgos online",
		);

		updateMeta("og:type", "website", true);
		updateMeta(
			"og:title",
			"EDANOS School - Primera Escuela de Gestión de Riesgos Venezuela",
			true,
		);
		updateMeta(
			"og:description",
			"Primera plataforma educativa online de Venezuela para gestión de riesgos y protección civil. Primeros en su tipo.",
			true,
		);
		updateMeta("og:url", window.location.href, true);
		updateMeta("og:image", "https://edanosapp.site/icon.png", true);

		updateMeta("twitter:card", "summary_large_image", false);
		updateMeta(
			"twitter:title",
			"EDANOS School - Cursos Gestión de Riesgos Venezuela",
			false,
		);
		updateMeta(
			"twitter:description",
			"Primera escuela online de gestión de riesgos en Venezuela. Educación pioneer.",
			false,
		);

		return () => {
			document.title = "EDANOS";
		};
	}, []);

	return (
		<div className="min-h-screen bg-[#13161b] text-gray-300 py-12 px-4 sm:px-6 lg:px-8 font-sans">
			<div className="max-w-4xl mx-auto bg-[#1a1f26] rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
				<div className="bg-gradient-to-r from-green-900/40 to-teal-900/40 p-8 border-b border-gray-800 flex flex-col items-center text-center">
					<Link
						to="/"
						className="self-start inline-flex items-center text-green-400 hover:text-green-300 transition-colors mb-6 group"
					>
						<span className="mr-2 group-hover:-translate-x-1 transition-transform">
							←
						</span>
						Volver al inicio
					</Link>

					<div className="mb-6">
						<div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-teal-600 p-1">
							<div className="w-full h-full rounded-full bg-[#1a1f26] flex items-center justify-center">
								<span className="text-3xl text-green-400">🎓</span>
							</div>
						</div>
					</div>

					<h1 className="text-3xl md:text-5xl font-bold text-white mb-2 tracking-tight">
						EDANOS School
					</h1>
					<p className="text-green-400 font-semibold text-lg">
						Primera Escuela Online de Gestión de Riesgos
					</p>
					<p className="text-gray-400 mt-2">
						Venezuela • PRIMERA PLATAFORMA EDUCATIVA
					</p>
				</div>

				<div className="p-8 md:p-12 space-y-12">
					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-green-500 pl-4">
							¿Qué es EDANOS School?
						</h2>
						<p className="leading-relaxed text-gray-300 text-lg">
							<strong>EDANOS School</strong> es la{" "}
							<strong>primera plataforma educativa online de Venezuela</strong>{" "}
							especializada en <strong>Gestión de Riesgos</strong>,{" "}
							<strong>Protección Civil</strong> y{" "}
							<strong>Evaluación de Daños y Análisis de Necesidades (EDAN)</strong>.
							Este proyecto representa un{" "}
							<strong>hito en la educación técnica venezolana</strong>,
							democratizando el acceso a conocimientos especializados que antes
							solo estaban disponibles para personal de instituciones específicas.
						</p>
						<p className="leading-relaxed text-gray-300 mt-4">
							Nuestra misión es{" "}
							<strong>
								democratizar la educación en gestión de riesgos en Venezuela
							</strong>. Cualquier persona interesada en aprender sobre
							emergencias, desastres y gestión de riesgos puede acceder a
							nuestros cursos desde cualquier lugar del país.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-green-500 pl-4">
							Somos Pioneros en Venezuela
						</h2>
						<div className="bg-gradient-to-br from-green-900/20 to-teal-900/20 p-6 rounded-xl border border-green-900/30 mb-6">
							<p className="text-gray-200">
								<strong>EDANOS School es la primera iniciativa de su tipo en
								Venezuela.</strong> Antes de nosotros, no existía una plataforma
								online que ofreciera formación estructurada en gestión de
								riesgos con certificación válida a nivel nacional. Fuimos los
								primeros en llenar este vacío educativo crucial para la
								preparación de nuestra población ante desastres.
							</p>
						</div>

						<div className="grid md:grid-cols-2 gap-4">
							<div className="bg-[#13161b] p-5 rounded-lg border border-gray-800">
								<h4 className="text-green-400 font-bold mb-2">
									Primera en el País
								</h4>
								<p className="text-sm text-gray-400">
									Somos la <b>primera escuela online</b> de gestión de riesgos
									de Venezuela. Derechos de autor registrados ante SAPI.
									<b>Primeros en nuestra categoría.</b>
								</p>
							</div>
							<div className="bg-[#13161b] p-5 rounded-lg border border-gray-800">
								<h4 className="text-green-400 font-bold mb-2">
									Certificación Válida
								</h4>
								<p className="text-sm text-gray-400">
									Certificados que pueden ser validados por instituciones de
									protección civil a nivel nacional. Formación reconocida.
								</p>
							</div>
						</div>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-blue-500 pl-4">
							El Problema que Resolvemos
						</h2>
						<p className="text-gray-400 mb-4">
							Antes de EDANOS School, los venezolanos interesados en gestión de
							riesgos enfrentaban:
						</p>
						<ul className="space-y-4 mb-8">
							<li className="flex items-start">
								<span className="flex-shrink-0 w-8 h-8 rounded-full bg-green-900/50 flex items-center justify-center text-green-400 font-bold mr-3">
									✕
								</span>
								<div>
									<strong className="text-white block">Sin Acceso Online</strong>
									<span className="text-gray-400">
										No existían cursos online de gestión de riesgos
										disponibles para el público general en Venezuela.
									</span>
								</div>
							</li>
							<li className="flex items-start">
								<span className="flex-shrink-0 w-8 h-8 rounded-full bg-green-900/50 flex items-center justify-center text-green-400 font-bold mr-3">
									✕
								</span>
								<div>
									<strong className="text-white block">Formación Exclusiva</strong>
									<span className="text-gray-400">
										Los conocimientos sobre protección civil y gestión de
										emergencias solo estaban disponibles para personal de
										instituciones específicas.
									</span>
								</div>
							</li>
							<li className="flex items-start">
								<span className="flex-shrink-0 w-8 h-8 rounded-full bg-green-900/50 flex items-center justify-center text-green-400 font-bold mr-3">
									✕
								</span>
								<div>
									<strong className="text-white block">Sin Certificación</strong>
									<span className="text-gray-400">
										No había forma de obtener una certificación válida en
										gestión de riesgos que fuera reconocida a nivel nacional.
									</span>
								</div>
							</li>
						</ul>
						<p className="text-gray-300 font-semibold text-lg">
							EDANOS School soluciona todo esto.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-purple-500 pl-4">
							¿Qué ofrece EDANOS School?
						</h2>
						<div className="grid md:grid-cols-2 gap-4">
							<div className="bg-[#13161b] p-5 rounded-lg border border-gray-800">
								<h4 className="text-blue-400 font-bold mb-1">
									Cursos 100% Online
								</h4>
								<p className="text-sm text-gray-400">
									Accede desde cualquier lugar de Venezuela. Clases disponibles
									24/7, sin horarios rígidos.
								</p>
							</div>
							<div className="bg-[#13161b] p-5 rounded-lg border border-gray-800">
								<h4 className="text-blue-400 font-bold mb-1">
									Certificación Oficial
								</h4>
								<p className="text-sm text-gray-400">
									Al aprobar los cursos, recibes certificación válida para
									presentar ante instituciones.
								</p>
							</div>
							<div className="bg-[#13161b] p-5 rounded-lg border border-gray-800">
								<h4 className="text-blue-400 font-bold mb-1">
									Instructores Expertos
								</h4>
								<p className="text-sm text-gray-400">
									Contenido desarrollado por profesionales con experiencia real
									en gestión de emergencias.
								</p>
							</div>
							<div className="bg-[#13161b] p-5 rounded-lg border border-gray-800">
								<h4 className="text-blue-400 font-bold mb-1">
									Contenido Actualizado
								</h4>
								<p className="text-sm text-gray-400">
									Material constantemente actualizado según los últimos
									protocolos internacionales de gestión de riesgos.
								</p>
							</div>
						</div>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-green-500 pl-4">
							Objetivo: Preparación Nacional
						</h2>
						<div className="border border-gray-700 bg-gray-800/50 p-6 rounded-lg">
							<p className="text-gray-300">
								EDANOS School busca crear una{" "}
								<strong>nueva cultura de prevención en Venezuela</strong>. La
								mejor respuesta a cualquier emergencia es una población
								preparada y educada. Creemos que cada venezolano que complete
								nuestros cursos será un{" "}
								<strong>agente multiplicador de conocimiento</strong> en su
								comunidad, familia y lugar de trabajo.
							</p>
							<p className="text-gray-300 mt-4">
								Este proyecto es parte de la visión de un{" "}
								<strong>grupo de investigación tecnológica</strong> que trabaja
								por <strong>Venezuela</strong>. A pesar de los obstáculos
								burocráticos y el escepticismo de algunos, seguimos adelante
								porque creemos que la educación es la herramienta más poderosa
								para salvar vidas.
							</p>
						</div>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-purple-500 pl-4">
							El Creador
						</h2>
						<p className="leading-relaxed text-gray-300">
							EDANOS School fue creado por{" "}
							<Link
								to="/gabriel-osuna"
								className="text-green-400 hover:text-green-300 underline"
							>
								Gabriel Leonardo Espitia Osuna
							</Link>
							, desarrollador de software Mérida y{" "}
							<strong>exfuncionario de Protección Civil</strong>. Gabriel, quien
							durante años trabajó directamente en la formación de personal de
							emergencias, identificó la necesidad de crear una plataforma que
							hiciera accesible este conocimiento a todos los venezolanos.
						</p>
						<p className="leading-relaxed text-gray-300 mt-4">
							EDANOS School representa la{" "}
							<strong>lucha de un desarrollador Mérida</strong> contra la falta de
							inversión en educación para la gestión de riesgos. Mientras las
							instituciones burocráticas se niegan a innovar, nosotros
							continuamos construyendo soluciones que{" "}
							<strong>ayudan a Venezuela</strong>. Creemos que la educación es la
							clave para un futuro más seguro.
						</p>
					</section>

					<div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
						<p className="mb-2">
							© {new Date().getFullYear()} EDANOS School. Todos los derechos
							reservados.
						</p>
						<p className="text-xs">
							Primera escuela online de gestión de riesgos en Venezuela.
							Educando para proteger.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProyectoEdanosSchool;
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useSeoJsonLd, proyectoSchema } from "../../hooks/useSeoJsonLd";

const ProyectoSatos = () => {
	const jsonLd = proyectoSchema(
		"SATOS",
		"Primer sistema de alerta temprana y notificaciones comunitarias de Venezuela. Tecnología pioneer para prevención de emergencias.",
		"https://edanosapp.site/proyectos/satos",
	);
	useSeoJsonLd({ script: jsonLd });

	useEffect(() => {
		document.title =
			"SATOS - Sistema de Alerta Temprana y Notificaciones Comunitarias | Venezuela";

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
			"SATOS es el primer sistema de alerta temprana comunitario de Venezuela. Notificaciones inmediatas a comunidades sobre emergencias. Somos pioneros en tecnología de prevención.",
		);
		updateMeta(
			"keywords",
			"sistema alerta temprana Venezuela, notificaciones comunitarias, gestión de riesgos Venezuela, protección civil Venezuela, prevención desastres Venezuela, tecnología emergencia venezolana, alerta sismicavenezuela, aviso inundación",
		);

		updateMeta("og:type", "website", true);
		updateMeta(
			"og:title",
			"SATOS - Alerta Temprana Comunitaria Venezuela",
			true,
		);
		updateMeta(
			"og:description",
			"Primer sistema de alerta temprana de Venezuela. Notificaciones Push para comunidades en riesgo.",
			true,
		);
		updateMeta("og:url", window.location.href, true);
		updateMeta("og:image", "https://edanosapp.site/icon.png", true);

		updateMeta("twitter:card", "summary_large_image", false);
		updateMeta("twitter:title", "SATOS - Alerta Temprana Venezuela", false);
		updateMeta(
			"twitter:description",
			"Sistema de notificaciones comunitarias para gestión de riesgos. Primeros en Venezuela.",
			false,
		);

		return () => {
			document.title = "EDANOS";
		};
	}, []);

	return (
		<div className="min-h-screen bg-[#13161b] text-gray-300 py-12 px-4 sm:px-6 lg:px-8 font-sans">
			<div className="max-w-4xl mx-auto bg-[#1a1f26] rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
				<div className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 p-8 border-b border-gray-800 flex flex-col items-center text-center">
					<Link
						to="/"
						className="self-start inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors mb-6 group"
					>
						<span className="mr-2 group-hover:-translate-x-1 transition-transform">
							←
						</span>
						Volver al inicio
					</Link>

					<div className="mb-6">
						<div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 p-1">
							<div className="w-full h-full rounded-full bg-[#1a1f26] flex items-center justify-center">
								<span className="text-3xl text-cyan-400">🔔</span>
							</div>
						</div>
					</div>

					<h1 className="text-3xl md:text-5xl font-bold text-white mb-2 tracking-tight">
						SATOS
					</h1>
					<p className="text-cyan-400 font-semibold text-lg">
						Sistema de Alerta Temprana y Notificaciones
					</p>
					<p className="text-gray-400 mt-2">
						Venezuela • PRIMER SISTEMA NACIONAL
					</p>
				</div>

				<div className="p-8 md:p-12 space-y-12">
					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-cyan-500 pl-4">
							¿Qué es SATOS?
						</h2>
						<p className="leading-relaxed text-gray-300 text-lg">
							<strong>SATOS</strong> (Sistema de Alerta Temprana y Notificaciones
							Comunitarias) es el{" "}
							<strong>primer sistema venezolano de notificación de alertas</strong>{" "}
							diseñado para <strong>comunidades en riesgo</strong>. Es el módulo
							de prevención y alerta del ecosistema EDANOS, la tecnología que
							Venezuela necesitaba para proteger a sus ciudadanos{" "}
							<strong>antes de que ocurra el desastre</strong>.
						</p>
						<p className="leading-relaxed text-gray-300 mt-4">
							Este sistema permite que las comunidades reciban{" "}
							<strong>notificaciones inmediatas</strong> sobre emergencias
							potenciales, alertas meteorológicas, evacuaciones y cualquier
							información crítica para su seguridad. Mientras otros países ya
							tienen sistemas maduros, Venezuela da sus primeros pasos con una
							solución nativa, diseñada específicamente para nuestras realidades
							geográficas y sociales.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-cyan-500 pl-4">
							Somos Pioneros en Venezuela
						</h2>
						<div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 p-6 rounded-xl border border-cyan-900/30 mb-6">
							<p className="text-gray-200">
								<strong>SATOS es el primer sistema de alertas comunitarias
								desarrollado en Venezuela.</strong> Fuimos los primeros en crear
								una tecnología nativa de notificación de emergencias que
								funciona en el territorio nacional. Nadie había hecho esto
								antes en el país.
							</p>
						</div>

						<div className="grid md:grid-cols-2 gap-4">
							<div className="bg-[#13161b] p-5 rounded-lg border border-gray-800">
								<h4 className="text-cyan-400 font-bold mb-2">
									Derechos de Autor
								</h4>
								<p className="text-sm text-gray-400">
									SATOS forma parte del ecosistema EDANOS con{" "}
									<b>derechos de autor registrados</b>. Somos los{" "}
									<b>primeros y únicos</b> en Venezuela en desarrollar un
									sistema completo de alertas comunitarias.
								</p>
							</div>
							<div className="bg-[#13161b] p-5 rounded-lg border border-gray-800">
								<h4 className="text-cyan-400 font-bold mb-2">
									Infraestructura Nacional
								</h4>
								<p className="text-sm text-gray-400">
									100% creado en Venezuela. Sin dependencias de servicios
									externos para el envío de alertas. Nuestra propia
									infraestructura garantiza la entrega cuando más se necesita.
								</p>
							</div>
						</div>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-blue-500 pl-4">
							El Problema que Resolvemos
						</h2>
						<p className="text-gray-400 mb-4">
							Antes de SATOS, las comunidades en Venezuela enfrentaban:
						</p>
						<ul className="space-y-4 mb-8">
							<li className="flex items-start">
								<span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-900/50 flex items-center justify-center text-cyan-400 font-bold mr-3">
									✕
								</span>
								<div>
									<strong className="text-white block">Sin Alertas Tempranas</strong>
									<span className="text-gray-400">
										Las comunidades no recibían información oportuna sobre
										amenazas inminentes como terremotos, inundaciones o
										deslizamientos.
									</span>
								</div>
							</li>
							<li className="flex items-start">
								<span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-900/50 flex items-center justify-center text-cyan-400 font-bold mr-3">
									✕
								</span>
								<div>
									<strong className="text-white block">Comunicación Lenta</strong>
									<span className="text-gray-400">
										La información sobre emergencias tardaba horas o días en
										llegar a las personas que más la necesitaban.
									</span>
								</div>
							</li>
							<li className="flex items-start">
								<span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-900/50 flex items-center justify-center text-cyan-400 font-bold mr-3">
									✕
								</span>
								<div>
									<strong className="text-white block">Comunidades Desprotegidas</strong>
									<span className="text-gray-400">
										No existía un sistema que permitiera a los ciudadanos
										recibir alertas específicas de su zona geográfica.
									</span>
								</div>
							</li>
						</ul>
						<p className="text-gray-300 font-semibold text-lg">
							SATOS soluciona todo esto.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-purple-500 pl-4">
							¿Qué hace SATOS?
						</h2>
						<div className="grid md:grid-cols-2 gap-4">
							<div className="bg-[#13161b] p-5 rounded-lg border border-gray-800">
								<h4 className="text-blue-400 font-bold mb-1">
									Alertas por Zona
								</h4>
								<p className="text-sm text-gray-400">
									Las alertas se envían únicamente a las comunidades dentro
									del área de riesgo, usando ubicación geográfica precisa.
								</p>
							</div>
							<div className="bg-[#13161b] p-5 rounded-lg border border-gray-800">
								<h4 className="text-blue-400 font-bold mb-1">
									Notificaciones Instantáneas
								</h4>
								<p className="text-sm text-gray-400">
									Mensajes push inmediatos a todos los dispositivos registrados
									en zonas de riesgo. La tecnología más rápida disponible.
								</p>
							</div>
							<div className="bg-[#13161b] p-5 rounded-lg border border-gray-800">
								<h4 className="text-blue-400 font-bold mb-1">
									Integración con EDANOS
								</h4>
								<p className="text-sm text-gray-400">
									Al detectar una emergencia en EDANOS, SATOS automáticamente
									activa las alertas a las comunidades afectadas.
								</p>
							</div>
							<div className="bg-[#13161b] p-5 rounded-lg border border-gray-800">
								<h4 className="text-blue-400 font-bold mb-1">
									Múltiples Tipos de Alerta
								</h4>
								<p className="text-sm text-gray-400">
									Soporte para diferentes emergencias: evacuación,
									meteorológica, sísmica, inundación y alertas personalizadas.
								</p>
							</div>
						</div>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-cyan-500 pl-4">
							Gestión Integral 360°
						</h2>
						<div className="border border-gray-700 bg-gray-800/50 p-6 rounded-lg">
							<p className="text-gray-300">
								SATOS complementa a EDANOS creando un{" "}
								<strong>ecosistema de gestión de riesgos completo</strong>. Mientras
								EDANOS se enfoca en la fase de respuesta y evaluación post-desastre,
								SATOS trabaja en la prevención y alerta. Juntas, estas tecnologías
								representan el enfoque más completo desarrollado en Venezuela
								para la protección de comunidades.
							</p>
							<p className="text-gray-300 mt-4">
								Este sistema es el resultado de un{" "}
								<strong>grupo de investigación tecnológica</strong> que cree que la{" "}
								<strong>prevención salva vidas</strong>. Trabajamos para llevar
								esta tecnología a cada rincón de Venezuela, sin importar los
								obstáculos burocráticos.
							</p>
						</div>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-purple-500 pl-4">
							El Creador
						</h2>
						<p className="leading-relaxed text-gray-300">
							SATOS fue creado por{" "}
							<Link
								to="/gabriel-osuna"
								className="text-cyan-400 hover:text-cyan-300 underline"
							>
								Gabriel Leonardo Espitia Osuna
							</Link>
							, desarrollador de software y{" "}
							<strong>exfuncionario de Protección Civil</strong> del estado
							Mérida. Gabriel, un profesional Mérida que enfrentó múltiples
							desafíos burocráticos, demuestra que desde Venezuela es posible
							crear soluciones innovadoras para la protección de nuestra
							población.
						</p>
						<p className="leading-relaxed text-gray-300 mt-4">
							SATOS representa la{" "}
							<strong>lucha de un desarrollador venezolano</strong> contra la
							burocracia que rechaza la innovación. Esta es nuestra contribución
							a <strong>Venezuela y su pueblo</strong>, demostrando que el
							desarrollo tecnológico nacional puede marcar la diferencia entre
							la vida y la muerte en emergencias.
						</p>
					</section>

					<div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
						<p className="mb-2">
							© {new Date().getFullYear()} SATOS - Sistema de Alerta Temprana.
							Todos los derechos reservados.
						</p>
						<p className="text-xs">
							Desarrollado en Mérida, Venezuela. PRIMER sistema nacional de
							notificaciones comunitarias para gestión de riesgos.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProyectoSatos;
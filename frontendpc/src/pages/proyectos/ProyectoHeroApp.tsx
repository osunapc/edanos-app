import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useSeoJsonLd, proyectoSchema } from "../../hooks/useSeoJsonLd";

const ProyectoHeroApp = () => {
	const jsonLd = proyectoSchema(
		"Hero App",
		"Aplicación móvil del ecosistema EDANOS para respuesta a emergencias en Venezuela. Notificaciones push y sincronización en segundo plano.",
		"https://edanosapp.site/proyectos/hero-app",
	);
	useSeoJsonLd({ script: jsonLd });

	useEffect(() => {
		document.title =
			"Hero App - Aplicación Móvil de Respuesta a Emergencias | Venezuela";

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
			"Hero App es una aplicación móvil del ecosistema EDANOS para respuesta a emergencias en Venezuela. Notificaciones push, sincronización en segundo plano. Tecnología pioneer nacional.",
		);
		updateMeta(
			"keywords",
			"app emergencias Venezuela, aplicación móvil protección civil Venezuela, respuesta desastres Venezuela, notificaciones emergencias Venezuela, app respuesta inmediata Venezuela",
		);

		updateMeta("og:type", "website", true);
		updateMeta(
			"og:title",
			"Hero App - App de Emergencias Venezuela",
			true,
		);
		updateMeta(
			"og:description",
			"Aplicación móvil del ecosistema EDANOS para respuesta a emergencias. Primeros en Venezuela.",
			true,
		);
		updateMeta("og:url", window.location.href, true);
		updateMeta("og:image", "https://edanosapp.site/icon.png", true);

		updateMeta("twitter:card", "summary_large_image", false);
		updateMeta("twitter:title", "Hero App - Emergencias Venezuela", false);
		updateMeta(
			"twitter:description",
			"Aplicación móvil de emergencias. Desarrollo pioneer en Venezuela.",
			false,
		);

		return () => {
			document.title = "EDANOS";
		};
	}, []);

	return (
		<div className="min-h-screen bg-[#13161b] text-gray-300 py-12 px-4 sm:px-6 lg:px-8 font-sans">
			<div className="max-w-4xl mx-auto bg-[#1a1f26] rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
				<div className="bg-gradient-to-r from-rose-900/40 to-pink-900/40 p-8 border-b border-gray-800 flex flex-col items-center text-center">
					<Link
						to="/"
						className="self-start inline-flex items-center text-rose-400 hover:text-rose-300 transition-colors mb-6 group"
					>
						<span className="mr-2 group-hover:-translate-x-1 transition-transform">
							←
						</span>
						Volver al inicio
					</Link>

					<div className="mb-6">
						<div className="w-24 h-24 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 p-1">
							<div className="w-full h-full rounded-full bg-[#1a1f26] flex items-center justify-center">
								<span className="text-3xl text-rose-400">🦸</span>
							</div>
						</div>
					</div>

					<h1 className="text-3xl md:text-5xl font-bold text-white mb-2 tracking-tight">
						Hero App
					</h1>
					<p className="text-rose-400 font-semibold text-lg">
						Aplicación Móvil de Respuesta a Emergencias
					</p>
					<p className="text-gray-400 mt-2">
						Venezuela • ECOSISTEMA EDANOS
					</p>
				</div>

				<div className="p-8 md:p-12 space-y-12">
					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-rose-500 pl-4">
							¿Qué es Hero App?
						</h2>
						<p className="leading-relaxed text-gray-300 text-lg">
							<strong>Hero App</strong> es una{" "}
							<strong>aplicación móvil del ecosistema EDANOS</strong> diseñada
							para facilitar la respuesta inmediata ante emergencias. Forma
							parte del conjunto de tecnologías pioneras que hemos desarrollado
							en Venezuela para transformar la gestión de desastres en el país.
						</p>
						<p className="leading-relaxed text-gray-300 mt-4">
							Esta app permite a los usuarios recibir notificaciones críticas,
							acceder a información de emergencia y mantenerse conectados con
							el sistema EDANOS en todo momento. Es nuestra contribución para
							que cada ciudadano pueda convertirse en un{" "}
							<strong>héroe</strong> durante las emergencias.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-rose-500 pl-4">
							Somos Pioneros en Venezuela
						</h2>
						<div className="bg-gradient-to-br from-rose-900/20 to-pink-900/20 p-6 rounded-xl border border-rose-900/30 mb-6">
							<p className="text-gray-200">
								<strong>Hero App es parte del primer ecosistema completo de
								gestión de riesgos desarrollado en Venezuela.</strong> Fuimos
								los primeros en crear un sistema integrado que conecta
								aplicaciones móviles, plataformas web, APIs y sistemas de alerta
								para la gestión de emergencias. Ninguna otra iniciativa en el
								país había logrado esto antes.
							</p>
						</div>

						<div className="grid md:grid-cols-2 gap-4">
							<div className="bg-[#13161b] p-5 rounded-lg border border-gray-800">
								<h4 className="text-rose-400 font-bold mb-2">
									Parte del Ecosistema
								</h4>
								<p className="text-sm text-gray-400">
									<b>Pioneros</b> en crear un ecosistema completo de apps
									móviles para gestión de riesgos en Venezuela.
								</p>
							</div>
							<div className="bg-[#13161b] p-5 rounded-lg border border-gray-800">
								<h4 className="text-rose-400 font-bold mb-2">
									Notificaciones Avanzadas
								</h4>
								<p className="text-sm text-gray-400">
									<b>Primero en implementar</b> notificaciones push con
									 Background fetch en apps de emergencia venezolanas.
								</p>
							</div>
						</div>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-blue-500 pl-4">
							El Problema que Resolvemos
						</h2>
						<p className="text-gray-400 mb-4">
							Antes de Hero App y el ecosistema EDANOS, los venezolanos
							frente a emergencias tenían:
						</p>
						<ul className="space-y-4 mb-8">
							<li className="flex items-start">
								<span className="flex-shrink-0 w-8 h-8 rounded-full bg-rose-900/50 flex items-center justify-center text-rose-400 font-bold mr-3">
									✕
								</span>
								<div>
									<strong className="text-white block">Sin Información Rápida</strong>
									<span className="text-gray-400">
										No había forma de recibir alertas inmediatas en el
										teléfono sobre emergencias cercanas.
									</span>
								</div>
							</li>
							<li className="flex items-start">
								<span className="flex-shrink-0 w-8 h-8 rounded-full bg-rose-900/50 flex items-center justify-center text-rose-400 font-bold mr-3">
									✕
								</span>
								<div>
									<strong className="text-white block">Apps Desconectadas</strong>
									<span className="text-gray-400">
										No existía un sistema que conectara a los ciudadanos
										con Protección Civil de manera eficiente.
									</span>
								</div>
							</li>
							<li className="flex items-start">
								<span className="flex-shrink-0 w-8 h-8 rounded-full bg-rose-900/50 flex items-center justify-center text-rose-400 font-bold mr-3">
									✕
								</span>
								<div>
									<strong className="text-white block">Preparación Cero</strong>
									<span className="text-gray-400">
										No había herramientas que prepararan a las personas
										para actuar durante una emergencia.
									</span>
								</div>
							</li>
						</ul>
						<p className="text-gray-300 font-semibold text-lg">
							Hero App soluciona esto como parte del ecosistema EDANOS.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-purple-500 pl-4">
							¿Qué hace Hero App?
						</h2>
						<div className="grid md:grid-cols-2 gap-4">
							<div className="bg-[#13161b] p-5 rounded-lg border border-gray-800">
								<h4 className="text-blue-400 font-bold mb-1">
									Notificaciones Push
								</h4>
								<p className="text-sm text-gray-400">
									Recibe alertas inmediatas sobre emergencias en tu zona.
									 technology advanced para Venezuela.
								</p>
							</div>
							<div className="bg-[#13161b] p-5 rounded-lg border border-gray-800">
								<h4 className="text-blue-400 font-bold mb-1">
									Sincronización en Segundo Plano
								</h4>
								<p className="text-sm text-gray-400">
									La app mantiene actualizado el sistema incluso cuando no
									está activamente en uso.
								</p>
							</div>
							<div className="bg-[#13161b] p-5 rounded-lg border border-gray-800">
								<h4 className="text-blue-400 font-bold mb-1">
									Integración con EDANOS
								</h4>
								<p className="text-sm text-gray-400">
									Conectada directamente con el ecosistema EDANOS para
									recibir y enviar datos de emergencias.
								</p>
							</div>
							<div className="bg-[#13161b] p-5 rounded-lg border border-gray-800">
								<h4 className="text-blue-400 font-bold mb-1">
									Tareas en Background
								</h4>
								<p className="text-sm text-gray-400">
									Funciona continuamente en segundo plano para mantener al
									usuario informado sin consumir batería excesiva.
								</p>
							</div>
						</div>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-rose-500 pl-4">
							Parte del Ecosistema EDANOS
						</h2>
						<div className="border border-gray-700 bg-gray-800/50 p-6 rounded-lg">
							<p className="text-gray-300">
								Hero App no está sola. Forma parte del{" "}
								<strong>primer ecosistema completo de gestión de riesgos de
								Venezuela</strong>, que incluye: EDANOS (evaluación de daños),
								SATOS (alertas tempranas), EDANOS School (educación), plataforma
								web y backend nacional. Juntas, estas tecnologías representan
								la solución más completa desarrollada en el país para la
								protección de la población.
							</p>
							<p className="text-gray-300 mt-4">
								Este ecosistema es el resultado de un{" "}
								<strong>grupo de investigación tecnológica</strong> que trabaja
								por <strong>Venezuela</strong>. Creemos que cada app, cada
								función, cada notificación puede marcar la diferencia entre la
								vida y la muerte durante una emergencia.
							</p>
						</div>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-purple-500 pl-4">
							El Creador
						</h2>
						<p className="leading-relaxed text-gray-300">
							Hero App fue creada por{" "}
							<Link
								to="/gabriel-osuna"
								className="text-rose-400 hover:text-rose-300 underline"
							>
								Gabriel Leonardo Espitia Osuna
							</Link>
							, desarrollador de software y{" "}
							<strong>exfuncionario de Protección Civil</strong> del estado
							Mérida. Gabriel diseñó este ecosistema completo porque
							entendió que una sola app no era suficiente; se necesitaba un
							sistema integrado para proteger efectivamente a los venezolanos.
						</p>
						<p className="leading-relaxed text-gray-300 mt-4">
							Hero App representa la{" "}
							<strong>visión de un desarrollador Mérida</strong> que cree que
							cada persona puede convertirse en un héroe durante las
							emergencias si tiene las herramientas correctas.{" "}
							<strong>Somos pioneros y seguirem os creando tecnología</strong>
							para proteger a Venezuela.
						</p>
					</section>

					<div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
						<p className="mb-2">
							© {new Date().getFullYear()} Hero App - Ecosistema EDANOS. Todos
							los derechos reservados.
						</p>
						<p className="text-xs">
							Desarrollado en Mérida, Venezuela. Parte del primer ecosistema
							nacional de gestión de riesgos.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProyectoHeroApp;
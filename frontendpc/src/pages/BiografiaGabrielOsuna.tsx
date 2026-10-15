import { Link } from "react-router-dom";
import { useEffect } from "react";

const BiografiaGabrielOsuna = () => {
	useEffect(() => {
		// Title
		document.title =
			"Gabriel Leonardo Espitia Osuna - Creador de EDANOS | Biografía";

		// Helper function to create/update meta tags
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

		// Meta Tags
		updateMeta(
			"description",
			"Biografía de Gabriel Leonardo Espitia Osuna, desarrollador de software y exfuncionario de Protección Civil venezolano. Creador del sistema EDANOS para la gestión de riesgos.",
		);
		updateMeta(
			"keywords",
			"Gabriel Osuna, Gabriel Espitia, EDANOS, Protección Civil, Venezuela, Desarrollador de Software, Gestión de Riesgos, App EDANOS",
		);

		// Open Graph / Facebook
		updateMeta("og:type", "profile", true);
		updateMeta(
			"og:title",
			"Gabriel Leonardo Espitia Osuna - Creador de EDANOS",
			true,
		);
		updateMeta(
			"og:description",
			"Conoce la historia de Gabriel Osuna, el creador visionario detrás del sistema nacional de gestión de riesgos EDANOS.",
			true,
		);
		updateMeta("og:url", window.location.href, true);
		updateMeta("og:image", "https://edanosapp.site/icon.png", true); // Using app icon as placeholder

		// Twitter
		updateMeta("twitter:card", "summary_large_image", false);
		updateMeta("twitter:title", "Gabriel Osuna - Creador de EDANOS", false);
		updateMeta(
			"twitter:description",
			"Biografía del creador del sistema de gestión de riesgos EDANOS.",
			false,
		);

		// Cleanup function (optional, but good practice for SPA)
		return () => {
			document.title = "EDANOS";
			// Note: Removing meta tags might not be strictly necessary if other pages overwrite them,
			// but for a clean state ideally we'd track and remove them.
			// For now, simple title reset is enough context switching.
		};
	}, []);

	return (
		<div className="min-h-screen bg-[#13161b] text-gray-300 py-12 px-4 sm:px-6 lg:px-8 font-sans">
			<div className="max-w-4xl mx-auto bg-[#1a1f26] rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
				{/* Header Section */}
				<div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 p-8 border-b border-gray-800 flex flex-col items-center text-center">
					<Link
						to="/"
						className="self-start inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors mb-6 group"
					>
						<span className="mr-2 group-hover:-translate-x-1 transition-transform">
							←
						</span>
						Volver al inicio
					</Link>

					<div className="mb-6 relative">
						<div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1">
							<div className="w-full h-full rounded-full bg-[#1a1f26] flex items-center justify-center overflow-hidden">
								<span className="text-4xl text-gray-500">GO</span>
								{/* Placeholder for actual image */}
							</div>
						</div>
					</div>

					<h1 className="text-3xl md:text-5xl font-bold text-white mb-2 tracking-tight">
						Gabriel Leonardo Espitia Osuna
					</h1>
					<p className="text-gray-400 text-lg max-w-2xl">
						Desarrollador de Software • Artista Plástico • Exfuncionario de
						Protección Civil
					</p>
					<p className="text-orange-400 font-semibold mt-2">
						Creador del Sistema EDANOS
					</p>
				</div>

				{/* Content Section */}
				<div className="p-8 md:p-12 space-y-12">
					{/* Intro */}
					<section>
						<p className="leading-relaxed text-gray-300 text-lg">
							Gabriel Leonardo Espitia Osuna (Valencia, Venezuela; 6 de mayo de
							1989) es un desarrollador de software, artista plástico y
							exfuncionario de Protección Civil venezolano. Es el creador y
							principal desarrollador del sistema <strong>EDANOS</strong>, una
							plataforma tecnológica diseñada para la transformación digital y
							modernización de la gestión de riesgos y administración de
							desastres en Venezuela.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-blue-500 pl-4">
							Resumen Biográfico
						</h2>
						<p className="leading-relaxed text-gray-300 mb-4">
							Hijo de José Erison Espitia Quiñones y Hortensia Osuna González,
							Espitia vivió su infancia en Pueblo Llano, Mérida, donde cursó
							estudios primarios en la escuela Foción Febre Cordero. A los 12
							años se trasladó a la ciudad de Mérida, donde continuó su
							formación secundaria en diversas instituciones como el Liceo San
							Rafael de Tabay y el Fermín Ruiz Valero. Debido a conflictos
							personales durante su juventud, se retiró del Liceo Fray Juan
							Ramos de Lora poco antes de culminar el bachillerato en
							humanidades.
						</p>
						<p className="leading-relaxed text-gray-300">
							A los 18 años ingresó al ejército en busca de disciplina,
							destacándose como "Soldado de Honor" en el Fuerte Caribay. Durante
							este periodo, su talento artístico le permitió decorar la capilla
							de la institución con motivos religiosos, obra que él mismo
							denominó su "Capilla Sixtina". Tras su salida, incursionó en el
							arte del vitralismo y las lámparas Tiffany durante dos años antes
							de iniciar su carrera en el servicio público.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-purple-500 pl-4">
							Carrera en Protección Civil y Gestión de Riesgos
						</h2>
						<p className="mb-4 text-gray-300">
							Espitia se formó en manejo de emergencias y acción contra
							desastres, ingresando posteriormente a Protección Civil y
							Administración de Desastres. Durante varios años trabajó en
							gestión de riesgos y atención prehospitalaria, destacándose por su
							compromiso operativo.
						</p>
						<p className="leading-relaxed text-gray-300">
							Un punto de inflexión en su carrera ocurrió mientras trabajaba en
							la oficina de prensa de la institución. Allí realizó las artes
							gráficas y desarrolló la primera revista digital de Protección
							Civil, un proyecto que despertó su curiosidad por la informática y
							la programación. Lamentablemente, su carrera en la institución se
							vio interrumpida por la falta de apoyo institucional ante una
							tragedia familiar personal, lo que lo llevó a buscar nuevos
							horizontes profesionales.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-blue-500 pl-4">
							Trayectoria en el Desarrollo de Software
						</h2>
						<p className="leading-relaxed text-gray-300 mb-6">
							A pesar de no contar con un título universitario formal tras
							intentos en el Instituto Cristóbal Mendoza y el UTE, Espitia
							consolidó una formación autodidacta de alto nivel. Su transición
							definitiva al desarrollo de software ocurrió durante la pandemia
							de COVID-19, periodo que aprovechó para profundizar en lenguajes
							de programación y desarrollo de aplicaciones.
						</p>

						<h3 className="text-xl font-medium text-white mb-3">
							Proyectos Destacados
						</h3>
						<div className="grid md:grid-cols-2 gap-4">
							<div className="bg-[#13161b] p-5 rounded-lg border border-gray-800">
								<h4 className="text-blue-400 font-bold mb-1">
									Arfesec (Colombia)
								</h4>
								<p className="text-sm text-gray-400">
									Desarrollo de branding, rediseño de marca y creación de
									empaques para importaciones masivas desde China para esta
									empresa de seguridad industrial.
								</p>
							</div>
							<div className="bg-[#13161b] p-5 rounded-lg border border-gray-800">
								<h4 className="text-blue-400 font-bold mb-1">
									Sector Inmobiliario (USA)
								</h4>
								<p className="text-sm text-gray-400">
									Desarrollo de una plataforma web para la venta de terrenos en
									Florida, un reto técnico que consolidó su capacidad para
									resolver problemas complejos.
								</p>
							</div>
							<div className="bg-[#13161b] p-5 rounded-lg border border-gray-800">
								<h4 className="text-blue-400 font-bold mb-1">Go Express</h4>
								<p className="text-sm text-gray-400">
									Cofundador y responsable del desarrollo tecnológico de esta
									empresa emergente junto a exgerentes del sector farmacéutico.
								</p>
							</div>
							<div className="bg-[#13161b] p-5 rounded-lg border border-gray-800">
								<h4 className="text-blue-400 font-bold mb-1">
									Clientes Internacionales
								</h4>
								<p className="text-sm text-gray-400">
									Lideró proyectos para Vivo Sport (Chile), servicios de
									reparación en EE.UU. (Garage Door) y diversos desarrollos en
									Puerto Rico.
								</p>
							</div>
							<div className="bg-[#13161b] p-5 rounded-lg border border-gray-800 md:col-span-2">
								<h4 className="text-blue-400 font-bold mb-1">FONHVI</h4>
								<p className="text-sm text-gray-400">
									Actualmente se desempeña en el área de desarrollo de software
									para esta institución.
								</p>
							</div>
						</div>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-orange-500 pl-4">
							El Sistema EDANOS: Innovación Nacional
						</h2>
						<div className="bg-gradient-to-br from-orange-900/20 to-red-900/20 p-6 rounded-xl border border-orange-900/30 mb-6">
							<p className="text-gray-200">
								El proyecto más ambicioso de Espitia es <strong>EDANOS</strong>{" "}
								(Evaluación de Daños y Análisis de Necesidades), una plataforma
								tecnológica integral concebida para sustituir los métodos
								manuales y obsoletos de recolección de datos en emergencias.
							</p>
						</div>

						<h3 className="text-xl font-medium text-white mb-4">
							Arquitectura y Funcionamiento
						</h3>
						<p className="text-gray-400 mb-4">
							El sistema se basa en una arquitectura de tres pilares diseñados
							para eliminar el "nudo gordiano" que representa el uso de
							formularios de papel:
						</p>
						<ul className="space-y-4 mb-8">
							<li className="flex items-start">
								<span className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-900/50 flex items-center justify-center text-orange-400 font-bold mr-3">
									1
								</span>
								<div>
									<strong className="text-white block">Aplicación Móvil</strong>
									<span className="text-gray-400">
										Permite la captura de datos en el "punto cero" de la
										emergencia, integrando coordenadas GPS y fotografías para
										dar fe visual de los daños.
									</span>
								</div>
							</li>
							<li className="flex items-start">
								<span className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-900/50 flex items-center justify-center text-orange-400 font-bold mr-3">
									2
								</span>
								<div>
									<strong className="text-white block">Plataforma Web</strong>
									<span className="text-gray-400">
										Centraliza la información en mapas georreferenciados
										interactivos y genera gráficos estadísticos automáticos para
										la toma de decisiones en tiempo real.
									</span>
								</div>
							</li>
							<li className="flex items-start">
								<span className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-900/50 flex items-center justify-center text-orange-400 font-bold mr-3">
									3
								</span>
								<div>
									<strong className="text-white block">Backend</strong>
									<span className="text-gray-400">
										Un núcleo robusto que garantiza la integridad, seguridad y
										disponibilidad de los datos sensibles de la nación.
									</span>
								</div>
							</li>
						</ul>

						<div className="border border-gray-700 bg-gray-800/50 p-6 rounded-lg">
							<h3 className="text-xl font-medium text-white mb-2">
								Impacto Estratégico
							</h3>
							<p className="text-gray-300">
								EDANOS es presentado como una herramienta de soberanía de datos.
								Al ser una creación nacional de un desarrollador que fue
								funcionario, el sistema entiende perfectamente los protocolos
								operativos y las necesidades reales del personal en el terreno.
								Su implementación busca la unificación nacional, asegurando que
								todos los niveles de Protección Civil compartan la misma "foto
								operativa" durante un desastre.
							</p>
						</div>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-purple-500 pl-4">
							Vida Personal y Actualidad
						</h2>
						<p className="leading-relaxed text-gray-300">
							Espitia reside actualmente en una vivienda rural que construyó con
							sus propias manos. Tras diversas experiencias laborales que lo
							mantuvieron alejado de su hogar, tomó la determinación de trabajar
							exclusivamente desde su casa para priorizar a su familia. Continúa
							su formación diaria, enfocándose actualmente en estudiosen el
							campo de la ciberseguridad, con la visión de seguir aportando
							soluciones tecnológicas que protejan a la comunidad.
						</p>
					</section>

					<div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
						<p className="mb-2">
							© {new Date().getFullYear()} Gabriel Osuna. Todos los derechos
							reservados.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BiografiaGabrielOsuna;

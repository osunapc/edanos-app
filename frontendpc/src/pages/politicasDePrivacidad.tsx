import { Link } from "react-router-dom";

const PoliticasDePrivacidad = () => {
	return (
		<div className="min-h-screen bg-[#13161b] text-gray-300 py-12 px-4 sm:px-6 lg:px-8 font-sans">
			<div className="max-w-4xl mx-auto bg-[#1a1f26] rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
				{/* Header Section */}
				<div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 p-8 border-b border-gray-800">
					<Link
						to="/"
						className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors mb-6 group"
					>
						<span className="mr-2 group-hover:-translate-x-1 transition-transform">
							←
						</span>
						Volver al inicio
					</Link>
					<h1 className="text-3xl md:text-5xl font-bold text-white mb-2 tracking-tight">
						Política de Privacidad
					</h1>
					<p className="text-gray-400 text-lg">
						Aplicable para{" "}
						<span className="text-blue-400 font-semibold">edos</span> y{" "}
						<span className="text-purple-400 font-semibold">
							edos-comunidad
						</span>
					</p>
				</div>

				{/* Content Section */}
				<div className="p-8 md:p-12 space-y-10">
					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-blue-500 pl-4">
							1. Introducción
						</h2>
						<p className="leading-relaxed text-gray-300">
							La presente Política de Privacidad establece los términos en que{" "}
							<strong>edos</strong> y <strong>edos-comunidad</strong> usan y
							protegen la información que es proporcionada por sus usuarios al
							momento de utilizar nuestros sitios web y aplicaciones. Estamos
							comprometidos con la seguridad de los datos de nuestros usuarios.
							Cuando le pedimos llenar los campos de información personal con la
							cual usted pueda ser identificado, lo hacemos asegurando que sólo
							se empleará de acuerdo con los términos de este documento.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-purple-500 pl-4">
							2. Información que Recogemos
						</h2>
						<p className="mb-4">
							Nuestro sistema podrá recoger información personal, por ejemplo:
						</p>
						<ul className="list-disc list-inside space-y-2 ml-4 text-gray-300">
							<li>
								<strong className="text-gray-100">
									Información de contacto:
								</strong>{" "}
								Nombre, dirección de correo electrónico, número de teléfono.
							</li>
							<li>
								<strong className="text-gray-100">
									Información demográfica:
								</strong>{" "}
								Dirección, código postal, preferencias e intereses.
							</li>
							<li>
								<strong className="text-gray-100">Datos de uso:</strong>{" "}
								Información sobre cómo utiliza nuestra aplicación para mejorar
								su experiencia.
							</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-blue-500 pl-4">
							3. Uso de la Información Recogida
						</h2>
						<p className="leading-relaxed text-gray-300">
							Empleamos la información con el fin de proporcionar el mejor
							servicio posible, particularmente para:
						</p>
						<div className="grid md:grid-cols-2 gap-4 mt-4">
							<div className="bg-[#13161b] p-4 rounded-lg border border-gray-800">
								<h3 className="text-white font-medium mb-2">
									Mejora de Servicios
								</h3>
								<p className="text-sm text-gray-400">
									Mantener un registro de usuarios y mejorar nuestros productos
									y funcionalidades.
								</p>
							</div>
							<div className="bg-[#13161b] p-4 rounded-lg border border-gray-800">
								<h3 className="text-white font-medium mb-2">Comunicación</h3>
								<p className="text-sm text-gray-400">
									Enviar correos electrónicos con ofertas especiales, nuevos
									productos e información publicitaria relevante.
								</p>
							</div>
						</div>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-purple-500 pl-4">
							4. Cookies
						</h2>
						<p className="leading-relaxed text-gray-300 mb-4">
							Una cookie se refiere a un fichero que es enviado con la finalidad
							de solicitar permiso para almacenarse en su ordenador. Nuestro
							sitio web emplea las cookies para poder identificar las páginas
							que son visitadas y su frecuencia.
						</p>
						<div className="bg-blue-900/20 p-4 rounded-lg border border-blue-900/50">
							<p className="text-sm text-blue-200">
								Usted puede aceptar o negar el uso de cookies. Sin embargo, la
								mayoría de navegadores las aceptan automáticamente para
								proporcionar un mejor servicio web. También puede cambiar la
								configuración de su ordenador para declinar las cookies.
							</p>
						</div>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-blue-500 pl-4">
							5. Enlaces a Terceros
						</h2>
						<p className="leading-relaxed text-gray-300">
							Nuestro sitio web pudiera contener enlaces a otros sitios que
							pudieran ser de su interés. Una vez que usted de clic en estos
							enlaces y abandone nuestra página, ya no tenemos control sobre al
							sitio al que es redirigido y por lo tanto no somos responsables de
							los términos o privacidad ni de la protección de sus datos en esos
							otros sitios terceros.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-purple-500 pl-4">
							6. Control de su Información Personal
						</h2>
						<p className="leading-relaxed text-gray-300 mb-4">
							En cualquier momento usted puede restringir la recopilación o el
							uso de la información personal que es proporcionada a nuestro
							sitio web.
						</p>
						<p className="leading-relaxed text-gray-300">
							Esta compañía no venderá, cederá ni distribuirá la información
							personal que es recopilada sin su consentimiento, salvo que sea
							requerido por un juez con un orden judicial.
						</p>
					</section>

					<div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
						<p className="mb-2">
							© {new Date().getFullYear()} edos & edos-comunidad. Todos los
							derechos reservados.
						</p>
						<p>
							Nos reservamos el derecho de cambiar los términos de la presente
							Política de Privacidad en cualquier momento.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PoliticasDePrivacidad;

import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export function Navbar() {
	const { isAuthenticated, logout, user } = useAuth();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const handleLogout = () => {
		logout();
		setIsMenuOpen(false);
	};

	// Estilos para los enlaces
	const linkStyles =
		"text-gray-300 hover:text-orange-400 transition-colors duration-200 font-medium px-3 py-2 rounded-md hover:bg-gray-700/50";

	if (isAuthenticated && user?.rol === "user") {
		return (
			<nav className="bg-gray-900 shadow-md">
				<div className="container mx-auto px-4">
					<div className="flex justify-between items-center py-4">
						<h1 className="text-3xl font-bold text-orange-500">
							<Link to="/">EDANOS</Link>
						</h1>
						<div className="text-right">
							<p className="text-white font-semibold">
								Bienvenido, {user?.nombre}
							</p>
							{user?.tipoInstitucion && (
								<p className="text-orange-400 text-sm">{user.tipoInstitucion}</p>
							)}
						</div>
						<p className="text-red-500">
							Tu rango necesita Mayor autorización.
						</p>
						<div>
							<Link
								to="/login"
								onClick={handleLogout}
								className="px-6 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
							>
								Salir
							</Link>
						</div>
					</div>
				</div>
			</nav>
		);
	}

	return (
		<nav className="bg-gray-800 shadow-md">
			<div className="w-full mx-auto px-4">
				<div className="flex justify-between items-center py-4">
					{/* Logo */}
					<h1 className="text-3xl font-bold text-orange-500">
						<Link to={!isAuthenticated ? "/login" : "/"}>EDANOS</Link>
					</h1>

					{/* Hamburger Menu Button */}
					<button
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						className="md:hidden text-white focus:outline-none focus:ring-2 focus:ring-orange-500 rounded p-2"
						aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
						aria-expanded={isMenuOpen}
					>
						{isMenuOpen ? (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						) : (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 6h16M4 12h16m-7 6h7"
								/>
							</svg>
						)}
					</button>

					{/* Desktop Menu */}
					<nav className="hidden md:block" aria-label="Navegación principal">
						<ul className="flex items-center gap-x-2">
							{isAuthenticated ? (
								<>
								<li className="text-right mr-4">
									<p className="text-white font-semibold text-sm">
										Bienvenido, {user?.nombre}
									</p>
									{user?.tipoInstitucion && (
										<p className="text-orange-400 text-xs">{user.tipoInstitucion}</p>
									)}
								</li>
									{(user?.rol === "coordinador" ||
										user?.rol === "admin" ||
										user?.rol === "superadmin") && (
										<>
											<li>
												<Link to="/usuarios" className={linkStyles}>
													Funcionarios
												</Link>
											</li>
											<li>
												<Link to="/graficos" className={linkStyles}>
													Edan
												</Link>
											</li>
											<li>
												<Link to="/register" className={linkStyles}>
													Registrar
												</Link>
											</li>
											<li>
												<Link to="/analiticas" className={linkStyles}>
													Analizar
												</Link>
											</li>
											{user?.rol === "superadmin" && (
												<li>
													<Link to="/solicitudes" className={linkStyles}>
														Solicitudes
													</Link>
												</li>
											)}
											<li>
												<Link to="/satos" className={linkStyles}>
													Sat
												</Link>
											</li>
										</>
									)}
									<li>
										<Link
											to="/login"
											onClick={handleLogout}
											className="ml-2 px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
										>
											Salir
										</Link>
									</li>
								</>
							) : (
								<li>
									<Link
										to="/login"
										className="px-6 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
									>
										Iniciar Sesión
									</Link>
								</li>
							)}
						</ul>
					</nav>
				</div>

				{/* Mobile Menu */}
				{isMenuOpen && (
					<div className="md:hidden pb-4 border-t border-gray-700 mt-2">
						<nav aria-label="Navegación móvil">
							<ul className="flex flex-col gap-y-2 pt-4">
								{isAuthenticated ? (
									<>
									<li className="text-center mb-4 pb-4 border-b border-gray-700">
										<p className="text-white font-semibold">
											Bienvenido, {user?.nombre}
										</p>
										{user?.tipoInstitucion && (
											<p className="text-orange-400 text-sm">{user.tipoInstitucion}</p>
										)}
									</li>
										{(user?.rol === "coordinador" ||
											user?.rol === "admin" ||
											user?.rol === "superadmin") && (
											<>
												<li>
													<Link
														to="/usuarios"
														onClick={() => setIsMenuOpen(false)}
														className="block text-gray-300 hover:text-orange-400 hover:bg-gray-700/50 transition-colors py-3 px-4 rounded-md"
													>
														Funcionarios
													</Link>
												</li>
												<li>
													<Link
														to="/graficos"
														onClick={() => setIsMenuOpen(false)}
														className="block text-gray-300 hover:text-orange-400 hover:bg-gray-700/50 transition-colors py-3 px-4 rounded-md"
													>
														Edan
													</Link>
												</li>
												<li>
													<Link
														to="/register"
														onClick={() => setIsMenuOpen(false)}
														className="block text-gray-300 hover:text-orange-400 hover:bg-gray-700/50 transition-colors py-3 px-4 rounded-md"
													>
														Registrar
													</Link>
												</li>
												<li>
													<Link
														to="/analiticas"
														onClick={() => setIsMenuOpen(false)}
														className="block text-gray-300 hover:text-orange-400 hover:bg-gray-700/50 transition-colors py-3 px-4 rounded-md"
													>
														Analizar
													</Link>
												</li>
												{user?.rol === "superadmin" && (
													<li>
														<Link
															to="/solicitudes"
															onClick={() => setIsMenuOpen(false)}
															className="block text-gray-300 hover:text-orange-400 hover:bg-gray-700/50 transition-colors py-3 px-4 rounded-md"
														>
															Solicitudes
														</Link>
													</li>
												)}
											</>
										)}
										<li className="mt-4">
											<Link
												to="/login"
												onClick={handleLogout}
												className="block text-center px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
											>
												Salir
											</Link>
										</li>
									</>
								) : (
									<li>
										<Link
											to="/login"
											onClick={() => setIsMenuOpen(false)}
											className="block text-center px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
										>
											Iniciar Sesión
										</Link>
									</li>
								)}
							</ul>
						</nav>
					</div>
				)}
			</div>
		</nav>
	);
}

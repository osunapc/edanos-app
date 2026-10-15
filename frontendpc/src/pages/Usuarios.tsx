import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { UserPen, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../components/uiredix/card";

function Usuarios() {
	const {
		loadUsuarios,
		users,
		user,
		loading,
		isAuthenticated,
		deleteUsuarios,
	} = useAuth();

	useEffect(() => {
		loadUsuarios();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<h1 className="text-center text-4xl font-bold text-white">
					Cargando...
				</h1>
			</div>
		);
	}

	if (
		!isAuthenticated ||
		(user?.rol !== "coordinador" &&
			user?.rol !== "admin" &&
			user?.rol !== "superadmin")
	) {
		return (
			<div className="flex justify-center items-center h-screen">
				<h1 className="text-white font-bold text-center text-4xl">
					No está autorizado para ver esta página.
				</h1>
			</div>
		);
	}

	const filteredUsers = users.filter((u) => {
		if (user?.rol === "superadmin") {
			return true; // Ve todos los usuarios
		}
		if (user?.rol === "admin") {
			// Ve usuarios de su estado (código empieza con su código)
			return u.codigo?.startsWith(user.codigo || "") && u.rol !== "superadmin";
		}
		if (user?.rol === "coordinador") {
			// Ve solo usuarios de su código exacto y solo rol user
			return u.codigo === user.codigo && u.rol === "user";
		}
		return false;
	});

	return (
		<div className="container mx-auto p-4 sm:p-6 lg:p-8">
			<h1 className="text-orange-500 text-3xl sm:text-4xl text-center my-8 font-bold text-shadow">
				Funcionarios Autorizados en EDAN
			</h1>

			{filteredUsers.length === 0 ? (
				<p className="text-center text-gray-400 text-lg">
					No se encontraron funcionarios.
				</p>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{filteredUsers.map((u) => (
						<Card
							key={u.id}
							className="bg-zinc-900 border-zinc-800 text-white flex flex-col"
						>
							<CardHeader>
								<CardTitle className="text-orange-500 text-xl">
									{u.nombre} {u.apellido}
								</CardTitle>
							</CardHeader>
							<CardContent className="flex-grow">
								<p className="text-sm text-gray-300 mb-2">
									<span className="font-semibold text-gray-100">Email:</span>{" "}
									{u.email}
								</p>
								<p className="text-sm text-gray-300 mb-2">
									<span className="font-semibold text-gray-100">Cargo:</span>{" "}
									{u.cargo}
								</p>
								<p className="text-sm text-gray-300 mb-2">
									<span className="font-semibold text-gray-100">Cédula:</span>{" "}
									{u.cedula}
								</p>
								<p className="text-sm text-gray-300 mb-2">
									<span className="font-semibold text-gray-100">Teléfono:</span>{" "}
									{u.telefono}
								</p>
								<p className="text-sm text-gray-300">
									<span className="font-semibold text-gray-100">
										Ubicación:
									</span>{" "}
									{u.ubicacion}
								</p>
							</CardContent>
							<CardFooter className="mt-auto flex justify-end items-center gap-x-2">
								<Link
									to={`/user/${u.id}`}
									className="p-2 text-blue-500 hover:text-blue-400 transition-colors duration-200"
									aria-label={`Editar usuario ${u.nombre} ${u.apellido}`}
								>
									<UserPen size={20} />
								</Link>
								<button
									className="p-2 text-red-500 hover:text-red-400 transition-colors duration-200"
									onClick={() => deleteUsuarios(u.id)}
									aria-label={`Eliminar usuario ${u.nombre} ${u.apellido}`}
								>
									<Trash2 size={20} />
								</button>
							</CardFooter>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}

export default Usuarios;

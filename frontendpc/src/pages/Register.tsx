import { useAuth } from "../context/AuthContext";
import { Card, Message, Button, Input, Label } from "../components/ui";
import { useForm } from "react-hook-form";
import { registerSchema, registerSchemaEdit, ESTADOS_VENEZUELA, INSTITUCIONES } from "../schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterData, UserRole } from "../type/type";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function Register() {
	const params = useParams();
	const {
		signup,
		errors: registerErrors,
		loadUsuario,
		editUsuario,
		user,
	} = useAuth();
	const [usuarioEditado, setUsuarioEditado] = useState<RegisterData | null>(null);
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
	} = useForm<RegisterData>({
		resolver: zodResolver(params.id ? registerSchemaEdit : registerSchema),
	});
	const navigate = useNavigate();

	const [isMunicipal, setIsMunicipal] = useState(false);

	const usuarioId = Number(params.id);

	useEffect(() => {
		async function cargarUsuario() {
			if (params.id) {
				const usuario = await loadUsuario(usuarioId);
				setUsuarioEditado(usuario);
				setValue("nombre", usuario.nombre);
				setValue("apellido", usuario.apellido);
				setValue("email", usuario.email);
				setValue("contrasena", "");
				setValue("cargo", usuario.cargo);
				setValue("cedula", usuario.cedula);
				setValue("telefono", usuario.telefono);
				setValue("ubicacion", usuario.ubicacion);
				setValue("rol", usuario.rol);
				setValue("tipoInstitucion", usuario.tipoInstitucion);

				if (usuario.nivelCuenta === "municipal" && usuario.codigo) {
					setIsMunicipal(true);
				} else {
					setIsMunicipal(false);
					setValue("codigo", usuario.codigo);
				}
			}
		}
		cargarUsuario();
	}, [loadUsuario, params.id, setValue, usuarioId]);

	const watchedRole = watch("rol");
	useEffect(() => {
		if (!params.id) {
			if (watchedRole === UserRole.admin) {
				setIsMunicipal(false);
			} else {
				setIsMunicipal(true);
			}
		}
	}, [watchedRole, params.id]);

	// Auto-fill code and tipoInstitucion for Admin creating users
	useEffect(() => {
		if (!params.id && user?.rol === UserRole.admin && user.codigo && !isMunicipal) {
			setValue("codigo", user.codigo);
			setValue("ubicacion", user.ubicacion);
			if (user.tipoInstitucion) {
				setValue("tipoInstitucion", user.tipoInstitucion);
			}
		}
	}, [params.id, user, isMunicipal, setValue]);

	const onSubmit = async (value: RegisterData): Promise<void> => {
		if (params.id) {
			const dataToSubmit = {
				...value,
				rol:
					(user?.rol === UserRole.coordinador || user?.rol === UserRole.admin || user?.rol === UserRole.superadmin)
						? value.rol
						: usuarioEditado?.rol,
				codigo:
					(user?.rol === UserRole.superadmin || user?.rol === UserRole.admin || user?.rol === UserRole.coordinador)
						? value.codigo
						: user?.codigo,
			};
			if (!dataToSubmit.contrasena) {
				delete dataToSubmit.contrasena;
			}
			await editUsuario(usuarioId, dataToSubmit);
			navigate("/usuarios");
		} else {
			let rolAsignado = UserRole.user;
			let nivelCuentaAsignado = "municipal";

			if (user?.rol === UserRole.superadmin) {
				rolAsignado = value.rol || UserRole.user;
			} else if (user?.rol === UserRole.admin) {
				rolAsignado = value.rol || UserRole.user;
			} else if (user?.rol === UserRole.coordinador) {
				rolAsignado = UserRole.user;
			}

			if (rolAsignado === UserRole.admin) {
				nivelCuentaAsignado = "estadal";
			} else if (rolAsignado === UserRole.coordinador) {
				nivelCuentaAsignado = "municipal";
			} else {
				nivelCuentaAsignado = user?.nivelCuenta || "municipal";
			}

			// Superadmin selecciona tipoInstitucion; admin hereda la suya
			const tipoInstitucionFinal =
				user?.rol === UserRole.superadmin
					? value.tipoInstitucion
					: user?.tipoInstitucion;

			const dataToSubmit = {
				...value,
				rol: rolAsignado,
				nivelCuenta: nivelCuentaAsignado,
				tipoInstitucion: tipoInstitucionFinal,
				codigo:
					user?.rol === UserRole.superadmin || user?.rol === UserRole.admin
						? value.codigo
						: user?.codigo,
			};
			await signup(dataToSubmit);
			navigate("/usuarios");
		}
	};

	return (
		<div className="h-[calc(100vh-50px)] flex items-center justify-center ">
			<Card>
				{registerErrors.map((error, i) => (
					<Message message={error} key={i} />
				))}
				<h1 className="text-3xl font-bold text-orange-600 mb-10">
					{params.id ? "Editar Funcionario" : "Registro de funcionarios"}
				</h1>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<Label htmlFor="Nombre">Nombres:</Label>
							<Input
								type="text"
								placeholder="Escribe tu nombre"
								{...register("nombre")}
								autoFocus
							/>
							{typeof errors.nombre?.message === "string" && (
								<p className="text-red-500">{errors.nombre?.message}</p>
							)}
						</div>
						<div>
							<Label htmlFor="apellido">Apellidos:</Label>
							<Input
								type="text"
								placeholder="Escribe tu apellido"
								{...register("apellido")}
								autoFocus
							/>
							{typeof errors.apellido?.message === "string" && (
								<p className="text-red-500">{errors.apellido?.message}</p>
							)}
						</div>
						<div>
							<Label htmlFor="email">Email:</Label>
							<Input
								type="email"
								placeholder="Escribe tu email"
								{...register("email")}
								autoFocus
							/>
							{typeof errors.email?.message === "string" && (
								<p className="text-red-500">{errors.email?.message}</p>
							)}
						</div>
						<div>
							<Label htmlFor="contrasena">contraseña:</Label>
							<Input
								type="password"
								placeholder="Escribe tu contraseña"
								{...register("contrasena")}
								autoFocus
							/>
							{typeof errors.contrasena?.message === "string" && (
								<p className="text-red-500">{errors.contrasena?.message}</p>
							)}
						</div>
						<div>
							<Label htmlFor="cargo">Cargo:</Label>
							<Input
								type="text"
								placeholder="Escribe tu cargo"
								{...register("cargo")}
								autoFocus
							/>
							{typeof errors.cargo?.message === "string" && (
								<p className="text-red-500">{errors.cargo?.message}</p>
							)}
						</div>
						<div>
							<Label htmlFor="cedula">Cedula:</Label>
							<Input
								type="text"
								placeholder="Escribe tu cedula"
								{...register("cedula")}
								autoFocus
							/>
							{typeof errors.cedula?.message === "string" && (
								<p className="text-red-500">{errors.cedula?.message}</p>
							)}
						</div>
						<div>
							<Label htmlFor="telefono">Telefono:</Label>
							<Input
								type="text"
								placeholder="Escribe tu telefono"
								{...register("telefono")}
								autoFocus
							/>
							{typeof errors.telefono?.message === "string" && (
								<p className="text-red-500">{errors.telefono?.message}</p>
							)}
						</div>
						<div>
							<Label htmlFor="ubicacion">Estado:</Label>
							<select
								{...register("ubicacion")}
								className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
							>
								<option value="">Seleccione estado</option>
								{ESTADOS_VENEZUELA.map((e) => (
									<option key={e} value={e}>{e}</option>
								))}
							</select>
							{typeof errors.ubicacion?.message === "string" && (
								<p className="text-red-500">{errors.ubicacion?.message}</p>
							)}
						</div>
						{(user?.rol === UserRole.coordinador ||
							user?.rol === UserRole.admin ||
							user?.rol === UserRole.superadmin) && (
							<>
								<div>
									<Label htmlFor="role">Rol:</Label>
									<select
										{...register("rol")}
										className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
									>
										<option value={UserRole.user}>Evaluador</option>
										{(user?.rol === UserRole.admin || user?.rol === UserRole.superadmin) && (
											<option value={UserRole.coordinador}>Coordinador</option>
										)}
										{(user?.rol === UserRole.admin || user?.rol === UserRole.superadmin) && (
											<option value={UserRole.admin}>Administrador</option>
										)}
										{user?.rol === UserRole.superadmin && (
											<option value={UserRole.superadmin}>Super Administrador</option>
										)}
									</select>
								</div>

								{user?.rol === UserRole.superadmin && (
									<div>
										<Label htmlFor="tipoInstitucion">Tipo de Institución:</Label>
										<select
											{...register("tipoInstitucion")}
											className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
										>
											<option value="">Seleccione institución</option>
											{INSTITUCIONES.map((inst) => (
												<option key={inst} value={inst}>{inst}</option>
											))}
										</select>
										{typeof errors.tipoInstitucion?.message === "string" && (
											<p className="text-red-500">{errors.tipoInstitucion?.message}</p>
										)}
									</div>
								)}

								<div>
									<Label htmlFor="codigo">Codigo:</Label>
									<Input
										type="text"
										placeholder="Escribe el codigo de la institucion"
										{...register("codigo")}
										autoFocus
										disabled={user?.rol !== UserRole.superadmin && user?.rol !== UserRole.admin}
										className={
											user?.rol === UserRole.coordinador
												? "bg-zinc-800 text-gray-400 cursor-not-allowed"
												: ""
										}
									/>
									{typeof errors.codigo?.message === "string" && (
										<p className="text-red-500">{errors.codigo?.message}</p>
									)}
								</div>
							</>
						)}
					</div>
					<div className="col-span-2">
						<Button onClick={handleSubmit(onSubmit)}>
							{params.id ? "Guardar" : "Registrar"}
						</Button>
					</div>
				</form>
			</Card>
		</div>
	);
}

export default Register;

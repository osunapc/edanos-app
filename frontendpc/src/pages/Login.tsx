import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, Message, Button, Input, Label } from "../components/ui";
import { useForm } from "react-hook-form";
import { loginSchema } from "../schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginData } from "../type/type";

function Login() {
	const { signin, errors: loginErrors, isAuthenticated } = useAuth();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginData>({
		resolver: zodResolver(loginSchema),
	});
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);

	const onSubmit = async (values: LoginData) => {
		await signin(values);
	};

	useEffect(() => {
		if (isAuthenticated) navigate("/graficos");
	}, [isAuthenticated, navigate]);

	return (
		<div className="relative min-h-screen flex items-center justify-center p-4">
			{/* Fondo de pantalla con blur */}
			<div className="absolute inset-0 -z-10">
				<img
					src="/ver.webp"
					alt="Fondo"
					className="w-full h-full object-cover filter blur-sm"
				/>
				<div className="absolute inset-0 bg-black/50" />
			</div>

			{/* Contenedor principal con sombra */}
			<div className="relative w-full max-w-4xl max-h-[30rem] flex rounded-lg shadow-5xl overflow-hidden">
				{/* Contenedor de la imagen */}
				<div className="w-1/2 hidden md:block">
					<img
						src="/hor.webp"
						alt="Decoración"
						className="w-full h-full object-cover"
					/>
				</div>

				{/* Contenedor del formulario con fondo blur */}
				<div className="w-full md:w-1/2 p-8 bg-orange-500/30 flex items-center justify-center">
					<Card>
						{loginErrors.map((error, i) => (
							<Message message={error} key={i} />
						))}
						<h1 className="text-3xl font-bold text-orange-500 mb-6 text-center">
							Iniciar Sesión
						</h1>
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
							<div>
								<Label htmlFor="cedula">Cédula:</Label>
								<Input type="number" {...register("cedula")} autoFocus />
								{errors.cedula && (
									<p className="text-red-500 text-xs mt-1">
										{String(errors.cedula.message)}
									</p>
								)}
							</div>
							<div>
								<Label htmlFor="contrasena">Contraseña:</Label>
								<div className="relative">
									<Input
										type={showPassword ? "text" : "password"}
										{...register("contrasena")}
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
									>
										{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
									</button>
								</div>
								{errors.contrasena && (
									<p className="text-red-500 text-xs mt-1">
										{String(errors.contrasena.message)}
									</p>
								)}
							</div>
							<Button onClick={handleSubmit(onSubmit)}>Entrar</Button>
						</form>
						<div>
							<p className="text-sm mt-4 text-center text-white">
								<a className="text-orange-500" href="/">
									Regresar a Inicio
								</a>
							</p>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
}

export default Login;

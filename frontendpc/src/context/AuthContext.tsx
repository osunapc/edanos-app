import { createContext, useState, useEffect, useContext } from "react";
//import { useAuth } from "../hooks/useAuth";
import {
	register,
	login,
	logoutt,
	verifyToken,
	getUsuarios,
	deleteUsuario,
	getUsuario,
	updateUsuario,
	setStoredToken,
	clearStoredToken,
} from "../api/auth";
import { AuthContextType, LoginData, RegisterData, User } from "../type/type";
import { connectSocket, disconnectSocket } from "../../services/socketService";
import toast from "react-hot-toast";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(
	undefined,
);
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth debe usarse dentro de un AuthProvider");
	}
	return context;
};

interface Props {
	children: React.ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
	const [user, setUser] = useState<User | null>(null);
	const [users, setUsers] = useState<User[]>([]);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [errors, setErrors] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);

	const signin = async (data: LoginData): Promise<void> => {
		try {
			const res = await login(data);
			const authData = await res.json();
			if (!res.ok) {
				setIsAuthenticated(false);
				toast.error(authData.message || authData.error);
				return setErrors([authData.message || authData.error]);
			}
			if (authData.token) {
				setStoredToken(authData.token);
			}
			setUser(authData);
			setIsAuthenticated(true);
		} catch (error) {
			if (Array.isArray(error)) {
				toast.error("Error al iniciar sesión.");
				return setErrors(error);
			}
			setErrors([error instanceof Error ? error.message : String(error)]);
		}
	};

	const signup = async (RegisterData: RegisterData): Promise<void> => {
		try {
			const res = await register(RegisterData);
			const signupData = await res.json();
			if (!res.ok) {
				setIsAuthenticated(false);
				const errorMessage = signupData.message || signupData.error;
				toast.error(errorMessage);
				return setErrors([errorMessage]);
			}
			// No es necesario autenticar al nuevo usuario, solo registrarlo.
			// La lista de usuarios se actualizará.
			//loadUsuarios();
			toast.success("¡Usuario registrado exitosamente!");
		} catch (error) {
			if (Array.isArray(error)) {
				return setErrors(error);
			}
			setErrors([error instanceof Error ? error.message : String(error)]);
		}
	};
	const logout = async () => {
		await logoutt();
		clearStoredToken();
		setIsAuthenticated(false);
		setUser(null);
	};

	const loadUsuarios = async () => {
		try {
			const res = await getUsuarios();
			const data = await res.json();
			if (!res.ok) {
				throw new Error("No se pudo cargar los usuarios");
			}
			setUsers(data);
		} catch (error) {
			console.error(error);
		}
	};

	const deleteUsuarios = async (id: number) => {
		try {
			if (
				window.confirm("¿Estás seguro de que deseas eliminar este usuario?")
			) {
				const res = await deleteUsuario(id);
				if (res.status === 200) {
					setUsers(users.filter((user) => user.id !== id));
					toast.success("Usuario eliminado exitosamente");
				} else {
					const data = await res.json();
					toast.error(data.error || "No se pudo eliminar el funcionario");
				}
			}
		} catch (error) {
			toast.error("No se pudo borrar el funcionario");
			console.error(error);
		}
	};

	const loadUsuario = async (id: number) => {
		try {
			const response = await getUsuario(id);
			if (!response.ok) {
				toast.error("Error al cargar los datos del usuario.");
				throw new Error("Error al cargar los datos del usuario.");
			}
			const data = await response.json();
			return data;
		} catch (error) {
			console.error(error);
		}
	};

	const editUsuario = async (id: number, data: RegisterData) => {
		try {
			const res = await updateUsuario(id, data);
			if (!res.ok) {
				const errorData = await res.json();
				setErrors([errorData.error || "Error al actualizar el usuario."]);
				throw new Error(errorData.error || "Error al actualizar el usuario.");
			}
			toast.success("¡Usuario actualizado exitosamente!");
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error("Ocurrió un error inesperado al actualizar el usuario.");
			}
		}
	};

	useEffect(() => {
		if (isAuthenticated && user) {
			connectSocket();
		} else {
			disconnectSocket();
		}

		return () => {
			disconnectSocket();
		};
	}, [isAuthenticated, user]);

	useEffect(() => {
		if (errors.length > 0) {
			const timer = setTimeout(() => {
				setErrors([]); //reset
			}, 5000);
			return () => clearTimeout(timer);
		}
	}, [errors]);

	useEffect(() => {
		async function checkLogin() {
			// Yield to main thread to allow initial paint
			await new Promise((resolve) => setTimeout(resolve, 0));

			try {
				const res = await verifyToken();
				// Si la respuesta no es OK (ej. 401 No Autorizado), no hay sesión válida.
				if (!res.ok) {
					setIsAuthenticated(false);
					setUser(null);
					setLoading(false);
					return;
				}

				const loginData = await res.json();

				setIsAuthenticated(true);
				setUser(loginData);
				setLoading(false);
			} catch (error) {
				console.error(error);
				setIsAuthenticated(false);
				setUser(null);
				setLoading(false);
			}
		}
		checkLogin();
	}, []);

	return (
		<AuthContext.Provider
			value={{
				signup,
				signin,
				logout,
				loading,
				user,
				users,
				isAuthenticated,
				errors,
				loadUsuarios,
				deleteUsuarios,
				loadUsuario,
				editUsuario,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

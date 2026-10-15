import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CONFIG } from "../constants/Config";
import { apiService } from "../services/api.service";

interface User {
	id: number;
	nombre: string;
	email: string;
	activo: boolean;
}

interface AuthContextType {
	user: User | null;
	token: string | null;
	loading: boolean;
	login: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadStorageData();
	}, []);

	const loadStorageData = async () => {
		try {
			const storedToken = await AsyncStorage.getItem(CONFIG.TOKEN_KEY);
			const storedUser = await AsyncStorage.getItem(CONFIG.USER_KEY);

			if (storedToken && storedUser) {
				setToken(storedToken);
				setUser(JSON.parse(storedUser));
			}
		} catch (e) {
			console.error("Error loading auth data:", e);
		} finally {
			setLoading(false);
		}
	};

	const login = async (email: string, password: string) => {
		try {
			const data = await apiService.post(
				"/api/funcionarios/login",
				{ email, password },
				false
			);

			const { token, funcionario } = data;

			await AsyncStorage.setItem(CONFIG.TOKEN_KEY, token);
			await AsyncStorage.setItem(CONFIG.USER_KEY, JSON.stringify(funcionario));

			setToken(token);
			setUser(funcionario);
		} catch (error) {
			throw error;
		}
	};

	const logout = async () => {
		await AsyncStorage.removeItem(CONFIG.TOKEN_KEY);
		await AsyncStorage.removeItem(CONFIG.USER_KEY);
		setToken(null);
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, token, loading, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

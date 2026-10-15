import { API_URL } from "../conf/constnts";
import { LoginData, RegisterData } from "../type/type";

const TOKEN_KEY = "auth_token";

export function getStoredToken(): string | null {
	return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
	localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken(): void {
	localStorage.removeItem(TOKEN_KEY);
}

function authHeaders(): Record<string, string> {
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
	};
	const token = getStoredToken();
	if (token) {
		headers["Authorization"] = `Bearer ${token}`;
	}
	return headers;
}

export function login(data: LoginData): Promise<Response> {
	return fetch(`${API_URL}/api/usuarios/login`, {
		method: "POST",
		headers: {
			Accept: "application/json, text/plain, */*",
			"Content-Type": "application/json",
		},
		credentials: "include",
		body: JSON.stringify(data),
	});
}

export function register(data: RegisterData): Promise<Response> {
	return fetch(`${API_URL}/api/usuarios/registro`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});
}

export function getUsuarios() {
	return fetch(`${API_URL}/api/usuarios`, {
		method: "GET",
		credentials: "include",
		headers: authHeaders(),
	});
}

export function getUsuario(id: number) {
	return fetch(`${API_URL}/api/usuarios/${id}`, {
		method: "GET",
		credentials: "include",
		headers: authHeaders(),
	});
}

export function updateUsuario(id: number, data: RegisterData) {
	return fetch(`${API_URL}/api/usuarios/${id}`, {
		method: "PATCH",
		credentials: "include",
		headers: authHeaders(),
		body: JSON.stringify(data),
	});
}

export function deleteUsuario(id: number) {
	return fetch(`${API_URL}/api/usuarios/${id}`, {
		method: "DELETE",
		credentials: "include",
		headers: authHeaders(),
	});
}

export function logoutt() {
	return fetch(`${API_URL}/api/usuarios/logout`, {
		method: "POST",
		headers: authHeaders(),
		credentials: "include",
	});
}

export function verifyToken(): Promise<Response> {
	return fetch(`${API_URL}/api/verifyToken`, {
		method: "GET",
		credentials: "include",
		headers: authHeaders(),
	});
}

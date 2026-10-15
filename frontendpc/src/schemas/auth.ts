import { z } from "zod";
import { UserRole } from "../type/type";

export const ESTADOS_VENEZUELA = [
	'Amazonas', 'Anzoátegui', 'Apure', 'Aragua', 'Barinas', 'Bolívar',
	'Carabobo', 'Cojedes', 'Delta Amacuro', 'Distrito Capital', 'Falcón',
	'Guárico', 'Lara', 'Mérida', 'Miranda', 'Monagas', 'Nueva Esparta',
	'Portuguesa', 'Sucre', 'Táchira', 'Trujillo', 'Vargas', 'Yaracuy', 'Zulia'
] as const;

export const INSTITUCIONES = [
	'Protección Civil',
	'Bomberos',
	'Grupo de Rescate',
	'Civil Protection',
	'Fire Department',
	'Search and Rescue'
] as const;

export const loginSchema = z.object({
	cedula: z.string().min(7, {
		message: "por favor ingrece una cedula valida",
	}),
	contrasena: z.string().min(6, {
		message: "contaseña minimo 6 caracteres",
	}),
});

export const registerSchema = z.object({
	nombre: z
		.string({
			required_error: "nombre es requerido",
		})
		.min(3, {
			message: "Username must be at least 3 characters",
		}),
	apellido: z
		.string({
			required_error: "apellido es requerido",
		})
		.min(3, {
			message: "Username must be at least 3 characters",
		}),
	contrasena: z.string().min(6, {
		message: "contaseña minimo 6 caracteres",
	}),
	email: z.string().email({
		message: "por favor ingrese un email valido",
	}),
	cargo: z.string().min(6, {
		message: "cargo minimo 6 caracteres",
	}),
	cedula: z.string().min(7, {
		message: "cedula minimo 7 caracteres",
	}),
	telefono: z.string().min(7, {
		message: "telefono minimo 7 caracteres",
	}),
	ubicacion: z.string().min(3, {
		message: "ubicacion es requerida",
	}),
	codigo: z.string().min(3, {
		message: "codigo minimo 3 caracteres",
	}),
	tipoInstitucion: z.string().optional(),
	rol: z.nativeEnum(UserRole).optional(),
	
});

export const registerSchemaEdit = z.object({
	nombre: z.string().optional(),
	apellido: z.string().optional(),
	email: z.string().email({ message: "Email invalido" }).optional(),
	contrasena: z
		.string()
		.optional(),
	cargo: z.string().optional(),
	cedula: z.string().optional(),
	telefono: z.string().optional(),
	ubicacion: z.string().optional(),
	codigo: z.string().optional(),
	tipoInstitucion: z.string().optional(),
	rol: z.nativeEnum(UserRole).optional(),
});
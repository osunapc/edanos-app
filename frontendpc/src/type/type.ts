export interface LoginData {
	cedula: string;
	contrasena: string;
}

export enum UserRole {
	user = "user",
	coordinador = "coordinador",
	admin = "admin",
	superadmin = "superadmin",
}

export interface RegisterData {
	nombre?: string;
	apellido?: string;
	email?: string;
	contrasena?: string;
	cargo?: string;
	cedula?: string;
	telefono?: string;
	ubicacion?: string;
	rol?: UserRole;
	codigo?: string;
	tipoInstitucion?: string;
	nivelCuenta?: string;
}

export interface User {
	id: number;
	email: string;
	nombre: string;
	apellido: string;
	contrasena?: string;
	cargo: string;
	cedula: string;
	telefono: string;
	ubicacion: string;
	createdAt: string;
	rol: UserRole;
	codigo: string;
	tipoInstitucion?: string;
	nivelCuenta?: string;
	codigoEstadal?: string;
	token?: string;
}

export interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean;
	errors: string[];
	loading: boolean;
	signin: (LoginData: LoginData) => Promise<void>;
	signup: (RegisterData: RegisterData) => Promise<void>;
	logout: () => void;
	users: User[];
	loadUsuarios: () => void;
	deleteUsuarios: (id: number) => Promise<void>;
	loadUsuario: (id: number) => Promise<User>;
	editUsuario: (id: number, data: RegisterData) => Promise<void>;
}

export interface GrupoFamiliar {
	id: string;
	evaluacionId: number;
	apellidosNombres?: string;
	cedula?: string;
	edad?: string;
	sexo?: string;
	parentesco?: string;
	tallaC?: string;
	tallaP?: string;
	tallaZ?: string;
	patologias?: string;
}

export interface Evaluation {
	id: number;
	userId?: number;
	codigo: string;
	createdAt: string;
	updatedAt: string;
	informacionPreliminar?: string;
	fechaEvento?: string;
	estado?: string;
	municipio?: string;
	parroquia?: string;
	cuadranteDePaz?: string;
	urbanizacion?: string;
	calle?: string;
	casa?: string;
	barrioSector?: string;
	vereda?: string;
	apto?: string;
	avenida?: string;
	usoEstructura?: string;
	otrosUsoEstructura?: string;
	latitud?: string;
	longitud?: string;
	cota?: string;
	este?: string;
	norte?: string;
	huso?: string;
	tipoEvento?: string;
	horaEvento?: string;
	apellidosJefe?: string;
	nombresJefe?: string;
	telefonoJefe?: string;
	condicionVivienda?: string;
	otrosCondicionVivienda?: string;
	viasAcceso: string[];
	otrosViasAcceso?: string;
	condicionAcceso?: string;
	otrosCondicionAcceso?: string;
	jefeFamilia?: string;
	edadJefe?: string;
	sexoJefe?: string;
	cedulaJefe?: string;
	tallaC?: string;
	tallaP?: string;
	tallaZ?: string;
	telefonoJefeFamilia?: string;
	patologiasJefe?: string;
	viviendaSolidaria: boolean;
	albergue: boolean;
	telefonoContactoAlbergue?: string;
	direccionAlbergue?: string;
	nombreResponsableAlbergue?: string;
	cedulaResponsableAlbergue?: string;
	materialesConstruccion: string[];
	otrosMaterialesConstruccion?: string;
	afectacionesNoEstructurales: string[];
	otrosNoEstructurales?: string;
	afectacionesEstructuralesColapso: string[];
	otrosEstructuralesColapso?: string;
	afectacionesParciales: string[];
	otrosAfectacionesParciales?: string;
	perdidasEnseres: string[];
	otrosPerdidasEnseres?: string;
	lineasVitalesAfectadas: string[];
	otrosLineasVitalesAfectadas?: string;
	necesidadesInmediatas?: string[];
	observaciones?: string;
	nombreEvaluado?: string;
	cedulaEvaluado?: string;
	telefonoEvaluado?: string;
	nombreEvaluador?: string;
	cedulaEvaluador?: string;
	telefonoEvaluador?: string;
	firmaEvaluado?: string | null;
	firmaEvaluador?: string | null;
	fotoFamiliar: string | null;
	fotosAdicionales: string[];
	grupoFamiliar: GrupoFamiliar[];
	
	// ⭐ NUEVO: Relación con Evento
	eventoId?: number;
	evento?: Evento;
	tipoInstitucion?: string;
}

// ⭐ NUEVO: Interfaz para Evento
export interface Evento {
	id: number;
	nombre: string;
	descripcion?: string;
	tipoEvento: string;
	codigo: string;
	estado: string;
	municipios: string[];
	tipoInstitucion?: string;
	estadoEvento: 'activo' | 'cerrado' | 'archivado';
	fechaInicio: string;
	fechaCierre?: string;
	fechaArchivado?: string;
	creadoPor: number;
	creador?: {
		nombre: string;
		apellido: string;
		cargo?: string;
	};
	usuarioCierre?: {
		nombre: string;
		apellido: string;
	};
	_count?: {
		evaluaciones: number;
	};
	createdAt: string;
	updatedAt: string;
}

// ⭐ NUEVO: Interfaz para Asignación Evaluador-Evento
export interface EventoUsuario {
	id: number;
	eventoId: number;
	userId: number;
	evento?: Evento;
	user?: {
		id: number;
		nombre: string;
		apellido: string;
		cedula: string;
	};
	createdAt: string;
}

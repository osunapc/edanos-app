export enum InformacionPreliminar {
  LEVE = 'leve',
  GRAVE = 'grave',
  TOTAL = 'total',
  RIESGO = 'riesgo',
  AISLADA = 'aislada',
}

export enum UsoEstructura {
  UNIFAMILIAR = 'unifamiliar',
  MULTIFAMILIAR = 'multifamiliar',
  MIXTA = 'mixta',
  OTROS = 'otros',
}

export enum CondicionVivienda {
  PROPIA = 'propia',
  ALQUILADA = 'alquilada',
  OTROS = 'otros',
}

export enum CondicionAcceso {
  TRANSITABLE = 'transitable',
  INTRANSITABLE = 'intransitable',
  REGULADO = 'regulado',
  OTROS = 'otros',
}

export interface MiembroFamiliar {
  //id: string;
  apellidosNombres: string;
  cedula: string;
  edad: string;
  sexo: string;
  parentesco: string;
  tallaC: string;
  tallaP: string;
  tallaZ: string;
  patologias: string;
}

export interface FormData {
  id: string;
  informacionPreliminar: InformacionPreliminar | string;
  codigo: string;
  estado: string;
  municipio: string;
  parroquia: string;
  cuadranteDePaz: string;
  urbanizacion: string;
  calle: string;
  casa: string;
  barrioSector: string;
  vereda: string;
  apto: string;
  avenida: string;
  usoEstructura: UsoEstructura | string;
  otrosUsoEstructura: string;
  latitud: string;
  longitud: string;
  cota: string;
  este: string;
  norte: string;
  huso: string;
  tipoEvento: string;
  horaEvento: string;
  apellidosJefe: string;
  nombresJefe: string;
  telefonoJefe: string;
  condicionVivienda: CondicionVivienda | string;
  otrosCondicionVivienda: string;
  viasAcceso: string[];
  otrosViasAcceso: string;
  condicionAcceso: CondicionAcceso | string;
  otrosCondicionAcceso: string;
  jefeFamilia: string;
  edadJefe: string;
  sexoJefe: string;
  cedulaJefe: string;
  tallaC: string;
  tallaP: string;
  tallaZ: string;
  telefonoJefeFamilia: string;
  patologiasJefe: string;
  viviendaSolidaria: boolean;
  albergue: boolean;
  telefonoContactoAlbergue: string;
  direccionAlbergue: string;
  nombreResponsableAlbergue: string;
  cedulaResponsableAlbergue: string;
  materialesConstruccion: string[];
  otrosMaterialesConstruccion: string;
  afectacionesNoEstructurales: string[];
  otrosNoEstructurales: string;
  afectacionesEstructuralesColapso: string[];
  otrosEstructuralesColapso: string;
  afectacionesParciales: string[];
  otrosAfectacionesParciales: string;
  perdidasEnseres: string[];
  otrosPerdidasEnseres: string;
  lineasVitalesAfectadas: string[];
  otrosLineasVitalesAfectadas: string;
  observaciones: string;
  nombreEvaluado: string;
  cedulaEvaluado: string;
  telefonoEvaluado: string;
  nombreEvaluador: string;
  cedulaEvaluador: string;
  telefonoEvaluador: string;
  firmaEvaluado: string | null;
  firmaEvaluador: string | null;
  grupoFamiliar: MiembroFamiliar[];

  // Campos para las URLs de las imágenes (vienen de la BD)
  fotoFamiliar: string | null;
  fotosAdicionales: string[];

  // Campos para manejar los archivos en el frontend
  fotoFamiliarFile?: any; // Puede ser un objeto de archivo o una URI
  fotosAdicionalesFiles?: any[];

  // ⭐ NUEVO: Relación con Evento
  eventoId?: number;
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
}

export interface TextFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: string;
  onBlur?: () => void;
}

export interface TextAreaProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onBlur?: () => void;
}

export interface CheckboxProps {
  label: string;
  checked: boolean;
  onPress: () => void;
}

export interface MultipleCheckboxProps {
  label: string;
  checked: boolean;
  onPress: () => void;
}

export interface SectionTitleProps {
  title: string;
}

export interface SubsectionTitleProps {
  title: string;
}

export interface SignatureComponentProps {
  title: string;
  onSave: (signature: string | null) => void;
}

export interface EvaluationSummary {
  id: string;
  createdAt: string;
  updatedAt: string;
  informacionPreliminar: string;
  estado: string;
  municipio: string;
  parroquia: string;
  jefeFamilia: string;
  synced: boolean;
  _deleted?: boolean;
}

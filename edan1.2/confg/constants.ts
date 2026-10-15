//export const API_URL = 'http://localhost:4500';
export const API_URL = 'https://backedanos.edanosapp.site';

// Data sync timing
export const AUTO_SAVE_INTERVAL = 30000; // 30 seconds
export const SYNC_INTERVAL = 60000; // 1 minute

// Timeouts
export const SESSION_TIMEOUT = 1800000; // 30 minutes
export const AUTH_TOKEN_KEY = 'auth_token';
export const USER_DATA_KEY = 'user_data';
export const EVALUATIONS_KEY = 'evaluations';
export const LAST_SYNC_KEY = 'last_sync';

// Form sections
export const FORM_SECTIONS = [
  { id: 'preliminary', title: 'Información Preliminar' },
  { id: 'location', title: 'Ubicación' },
  { id: 'housing', title: 'Vivienda' },
  { id: 'household', title: 'Grupo Familiar' },
  { id: 'damage', title: 'Daños y Afectaciones' },
  { id: 'vitals', title: 'Líneas Vitales' },
  { id: 'signatures', title: 'Firmas y Validación' },
];
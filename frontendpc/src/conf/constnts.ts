// En Vite no existe `process` en tiempo de ejecución del navegador.
// Usamos `import.meta.env.VITE_API_URL` para leer variables de entorno definidas
// en archivos `.env` (prefijo VITE_). Si no está definida, usamos el valor por
// defecto http://localhost:4500.
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4500";


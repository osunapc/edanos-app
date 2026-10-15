import multer from 'multer';

// Usamos almacenamiento en memoria (memoryStorage) porque vamos a procesar
// las imágenes con 'sharp' antes de subirlas a MinIO.
// No las guardaremos en el disco del servidor de la API.
const storage = multer.memoryStorage();

// Configuramos multer para aceptar múltiples archivos.
const upload = multer({
	storage,
	limits: { fileSize: 15 * 1024 * 1024 } // Límite de 15MB por archivo
});

export default upload;

import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

// Validamos que todas las variables de entorno necesarias para MinIO estén presentes.
if (!process.env.MINIO_ENDPOINT || !process.env.MINIO_ACCESS_KEY || !process.env.MINIO_SECRET_KEY) {
	throw new Error('Faltan variables de entorno para la configuración de MinIO');
}

// Creamos el cliente de S3. Como MinIO es compatible con la API de S3,
// podemos usar el SDK de AWS para comunicarnos con él.
export const s3Client = new S3Client({
	// La URL de tu servidor MinIO (ej: http://minio.pcmerida.com o http://localhost:9000)
	endpoint: process.env.MINIO_ENDPOINT,

	// La región es requerida por el SDK, pero para MinIO puede ser cualquier string.
	region: 'us-east-1',

	// Credenciales de acceso que configuraste en Dokploy.
	credentials: {
		accessKeyId: process.env.MINIO_ACCESS_KEY,
		secretAccessKey: process.env.MINIO_SECRET_KEY
	},

	// Importante: Se necesita para endpoints que no son HTTPS, como en desarrollo local.
	forcePathStyle: true
});

import sharp from 'sharp';
import { s3Client } from '../libs/s3-client.js';
import { PutObjectCommand } from '@aws-sdk/client-s3';

export const uploadSatosPhoto = async (fileBuffer, originalName) => {
	if (!process.env.MINIO_BUCKET_NAME) {
		throw new Error('MINIO_BUCKET_NAME no definido en variables de entorno');
	}

	const fileName = `satos/${Date.now()}-${originalName.replace(/\s+/g, '_')}`;

	// Optimizar imagen (max 800px ancho, calidad 75%, formato webp)
	// Esto reduce significativamente el uso de ancho de banda y almacenamiento
	const processedBuffer = await sharp(fileBuffer)
		.resize({ width: 800, withoutEnlargement: true })
		.webp({ quality: 75 })
		.toBuffer();

	await s3Client.send(
		new PutObjectCommand({
			Bucket: process.env.MINIO_BUCKET_NAME,
			Key: fileName,
			Body: processedBuffer,
			ContentType: 'image/webp'
		})
	);

	return `${process.env.MINIO_ENDPOINT}/${process.env.MINIO_BUCKET_NAME}/${fileName}`;
};

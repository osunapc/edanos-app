import prisma from '../libs/prisma.js';
import { uploadSatosPhoto } from '../helpers/uploadSatosPhoto.js';

// --- Métodos del Controlador ---

export const createReport = async (req, res) => {
	try {
		const { lat, lng, level, comment, emergency } = req.body;
		const file = req.file;

		if (!file) {
			return res.status(400).json({ error: 'La fotografía es obligatoria' });
		}

		if (!lat || !lng || !level) {
			return res.status(400).json({ error: 'Faltan campos requeridos (lat, lng, level)' });
		}

		// 1. Subir foto a MinIO usando el helper
		const photoUrl = await uploadSatosPhoto(file.buffer, file.originalname);

		// 2. Crear reporte en la Base de Datos
		const report = await prisma.satosReport.create({
			data: {
				lat: parseFloat(lat),
				lng: parseFloat(lng),
				level: parseInt(level),
				comment,
				emergency: emergency === 'true' || emergency === true,
				photoUrl,
				validated: false,
				isClosed: false
			}
		});

		// 3. Notificar vía WebSockets (Tiempo Real)
		if (req.io) {
			// Notificar al Frontend Web (Sala 'web')
			req.io.to('web').emit('satos:new-report', report);

			// Notificar a Funcionarios de Guardia solo si es crítico (Nivel 4 o Emergencia declarada)
			if (report.level >= 4 || report.emergency) {
				// Este evento será interceptado en sockets.js para filtrar a los funcionarios "de guardia"
				req.io.emit('internal:trigger-alert-officials', report);
			}
		}

		return res.status(201).json(report);
	} catch (error) {
		console.error('Error creando reporte Satos:', error);
		return res.status(500).json({ error: 'Error interno al crear reporte' });
	}
};

export const getReports = async (req, res) => {
	try {
		const { page = 1, limit = 50, isClosed, emergency } = req.query;
		// Calcular cuántos registros saltar para la paginación
		const skip = (parseInt(page) - 1) * parseInt(limit);

		// Construir filtros dinámicos
		const where = {};
		if (isClosed !== undefined) where.isClosed = isClosed === 'true';
		if (emergency !== undefined) where.emergency = emergency === 'true';

		// Ejecutar consultas en paralelo (obtener datos y contar total)
		const [reports, total] = await Promise.all([
			prisma.satosReport.findMany({
				where,
				orderBy: { createdAt: 'desc' }, // Ordenar por fecha (más reciente primero)
				take: parseInt(limit),
				skip
			}),
			prisma.satosReport.count({ where })
		]);

		return res.status(200).json({
			data: reports,
			pagination: {
				total,
				page: parseInt(page),
				limit: parseInt(limit),
				pages: Math.ceil(total / parseInt(limit))
			}
		});
	} catch (error) {
		console.error('Error obteniendo reportes Satos:', error);
		return res.status(500).json({ error: 'Error al obtener reportes' });
	}
};

export const closeReport = async (req, res) => {
	try {
		const { id } = req.params;
		const report = await prisma.satosReport.update({
			where: { id: parseInt(id) },
			data: { isClosed: true }
		});

		// Notificar actualización al frontend
		if (req.io) req.io.to('web').emit('satos:report-updated', report);

		return res.status(200).json(report);
	} catch (error) {
		return res.status(500).json({ error: 'Error cerrando reporte' });
	}
};

export const validateReport = async (req, res) => {
	try {
		const { id } = req.params;
		const report = await prisma.satosReport.update({
			where: { id: parseInt(id) },
			data: { validated: true }
		});

		// Notificar actualización al frontend
		if (req.io) req.io.to('web').emit('satos:report-updated', report);

		return res.status(200).json(report);
	} catch (error) {
		return res.status(500).json({ error: 'Error validando reporte' });
	}
};

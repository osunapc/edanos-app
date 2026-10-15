import prisma from '../libs/prisma.js';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { s3Client } from '../libs/s3-client.js';

const BUCKET_NAME = process.env.MINIO_BUCKET_NAME;

// --- Helper para procesar y subir imágenes ---
const uploadImage = async (file) => {
	const fileName = `edan/${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;

	const processedImageBuffer = await sharp(file.buffer)
		.resize({ width: 1200, withoutEnlargement: true })
		.webp({ quality: 80 })
		.toBuffer();

	const params = {
		Bucket: BUCKET_NAME,
		Key: fileName,
		Body: processedImageBuffer,
		ContentType: 'image/webp'
	};

	await s3Client.send(new PutObjectCommand(params));

	return `${process.env.MINIO_ENDPOINT.replace(/\/$/, '')}/${BUCKET_NAME}/${fileName}`;
};

// --- Funciones de Lógica de Negocio (Reutilizables) ---

export const _obtenerEvaluations = async (queryOptions = {}) => {
	const query = {
		...queryOptions,
		include: {
			grupoFamiliar: true,
			...(queryOptions.include || {})
		},
		orderBy: {
			createdAt: 'desc'
		}
	};
	return prisma.evaluation.findMany(query);
};

export const _createEvaluation = async (data) => {
	if (!data.grupoFamiliar || !Array.isArray(data.grupoFamiliar)) {
		throw new Error('grupoFamiliar debe ser un array válido');
	}

	// Extract userId, eventoId, and grupoFamiliar to properly connect relations
	const { userId, eventoId, grupoFamiliar, ...restData } = data;

	if (!userId) {
		throw new Error('userId es requerido para crear una evaluación');
	}

	return prisma.evaluation.create({
		data: {
			...restData,
			user: {
				connect: { id: userId }
			},
			// Connect evento relation if eventoId is provided
			...(eventoId && {
				evento: {
					connect: { id: eventoId }
				}
			}),
			grupoFamiliar: {
				create: grupoFamiliar
			}
		},
		include: {
			grupoFamiliar: true
		}
	});
};

export const _updateEvaluation = async (id, evaluationData, familiarData) => {
	return prisma.evaluation.update({
		where: { id: parseInt(id) },
		data: {
			...evaluationData,
			...(familiarData && { grupoFamiliar: familiarData })
		},
		include: {
			grupoFamiliar: true
		}
	});
};

export const _deleteEvaluation = async (id) => {
	return prisma.evaluation.delete({
		where: { id: parseInt(id) }
	});
};

// --- Controladores de Rutas HTTP ---

export const obtenerEdan = async (req, res) => {
	try {
		const user = req.user;
		const { eventoId } = req.query;
		let whereClause = {};

		if (user.rol === 'superadmin') {
			whereClause = {};
		} else if (user.rol === 'admin' || user.rol === 'coordinador') {
			// Admin/Coordinador ven evaluaciones de su institución
			if (user.tipoInstitucion) {
				whereClause.user = { tipoInstitucion: user.tipoInstitucion };
			}
		} else {
			// Evaluadores ven solo las suyas
			whereClause.userId = user.id;
		}

		// Filtrar por eventoId si se proporciona
		if (eventoId) {
			whereClause.eventoId = parseInt(eventoId);
		}

		const evaluations = await prisma.evaluation.findMany({
			where: whereClause,
			include: {
				grupoFamiliar: true,
				evento: {
					select: {
						id: true,
						nombre: true,
						codigo: true,
						estadoEvento: true
					}
				}
			}
		});

		return res.status(200).json(evaluations);
	} catch (error) {
		console.error('Error fetching evaluations:', error);
		return res.status(500).json({ error: 'Error fetching evaluations' });
	}
};

export const obtenerEdanId = async (req, res) => {
	try {
		const { id } = req.params;
		const evaluation = await prisma.evaluation.findUnique({
			where: {
				id: parseInt(id)
			},
			include: {
				grupoFamiliar: true,
				evento: true // ⭐ NUEVO: Incluir evento
			}
		});

		if (!evaluation) {
			return res.status(404).json({ error: 'Evaluation not found' });
		}
		return res.status(200).json(evaluation);
	} catch (error) {
		console.error('Error fetching evaluation:', error);
		return res.status(500).json({ error: 'Error fetching evaluation' });
	}
};

export const crearEdan = async (req, res) => {
	try {
		const user = req.user;
		const { eventoId, ...restBody } = req.body;

		const evaluationData = {
			...restBody,
			userId: user.id,
			eventoId: eventoId ? parseInt(eventoId) : null,
			tipoInstitucion: user.tipoInstitucion || null
		};

		const newEvaluation = await _createEvaluation(evaluationData);

		// Emitir evento WebSocket
		if (req.io) {
			req.io.to('superadmin').emit('server:new-evaluation', newEvaluation);
			if (newEvaluation.tipoInstitucion) {
				req.io.to(`institucion:${newEvaluation.tipoInstitucion}`).emit('server:new-evaluation', newEvaluation);
			}
			if (newEvaluation.eventoId) {
				req.io.to(`evento:${newEvaluation.eventoId}`).emit('server:new-evaluation', newEvaluation);
			}
		}

		return res.status(200).json(newEvaluation);
	} catch (error) {
		console.error('Error al crear la evaluación:', error);
		return res.status(500).json({
			message: 'Error interno del servidor al crear la evaluación.',
			error: error.message
		});
	}
};

export const actualizarEdan = async (req, res) => {
	try {
		const { id } = req.params;
		const user = req.user;

		// Obtener la evaluación actual para validar permisos
		const evaluation = await prisma.evaluation.findUnique({
			where: { id: parseInt(id) }
		});

		if (!evaluation) {
			return res.status(404).json({ error: 'Evaluación no encontrada' });
		}

		// Validar permisos según el rol
		const canEdit =
			user.rol === 'superadmin' ||
			(user.rol === 'admin' && user.tipoInstitucion && evaluation.tipoInstitucion === user.tipoInstitucion) ||
			(user.rol === 'user' && evaluation.userId === user.id);

		if (!canEdit) {
			return res.status(403).json({ error: 'No tiene permisos para editar esta evaluación' });
		}

		const updatedEvaluation = await _updateEvaluation(id, req.body);

		if (req.io) {
			req.io.to('superadmin').emit('server:evaluation-updated', updatedEvaluation);
			if (updatedEvaluation.tipoInstitucion) {
				req.io.to(`institucion:${updatedEvaluation.tipoInstitucion}`).emit('server:evaluation-updated', updatedEvaluation);
			}
			if (updatedEvaluation.eventoId) {
				req.io.to(`evento:${updatedEvaluation.eventoId}`).emit('server:evaluation-updated', updatedEvaluation);
			}
		}

		res.status(200).json(updatedEvaluation);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const uploadFiles = async (req, res) => {
	try {
		const uploadPromises = req.files.map((file) => uploadImage(file));
		console.log(
			'Archivos a subir:',
			req.files.map((f) => f.originalname)
		);
		const filesUrls = await Promise.all(uploadPromises);

		// Separar las URLs basadas en el fieldname original
		const response = {
			fotoFamiliar: null,
			fotosAdicionales: []
		};

		req.files.forEach((file, index) => {
			if (file.fieldname === 'fotoFamiliar') {
				response.fotoFamiliar = filesUrls[index];
			} else if (file.fieldname.startsWith('fotosAdicionales')) {
				response.fotosAdicionales.push(filesUrls[index]);
			}
		});
		console.log('Archivos subidos con éxito:', response);

		res.status(200).json(response);
	} catch (error) {
		console.error('Error al subir archivos:', error);
		res.status(500).json({ message: 'Error al subir archivos', error: error.message });
	}
};

export const eliminarEdan = async (req, res) => {
	try {
		const { id } = req.params;
		const user = req.user;

		// Obtener la evaluación actual para validar permisos
		const evaluation = await prisma.evaluation.findUnique({
			where: { id: parseInt(id) }
		});

		if (!evaluation) {
			return res.status(404).json({ error: 'Evaluación no encontrada' });
		}

		// Validar permisos según el rol
		const canDelete =
			user.rol === 'superadmin' ||
			(user.rol === 'admin' && user.tipoInstitucion && evaluation.tipoInstitucion === user.tipoInstitucion) ||
			(user.rol === 'user' && evaluation.userId === user.id);

		if (!canDelete) {
			return res
				.status(403)
				.json({ error: 'No tiene permisos para eliminar esta evaluación' });
		}

		const deletedEvaluation = await _deleteEvaluation(id);

		if (req.io) {
			req.io.to('superadmin').emit('server:evaluation-deleted', { id: deletedEvaluation.id });
			if (deletedEvaluation.tipoInstitucion) {
				req.io.to(`institucion:${deletedEvaluation.tipoInstitucion}`).emit('server:evaluation-deleted', { id: deletedEvaluation.id });
			}
			if (deletedEvaluation.eventoId) {
				req.io.to(`evento:${deletedEvaluation.eventoId}`).emit('server:evaluation-deleted', { id: deletedEvaluation.id });
			}
		}

		res.status(200).json(deletedEvaluation);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

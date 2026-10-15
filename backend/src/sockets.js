import jwt from 'jsonwebtoken';
import prisma from './libs/prisma.js';
import {
	_createEvaluation,
	_updateEvaluation,
	_deleteEvaluation
} from './controller/edan.controller.js';

const getUserFromToken = async (token) => {
	if (!token) return null;
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

		if (decoded.role === 'funcionario') {
			return await prisma.funcionario.findUnique({ where: { id: decoded.id } });
		}

		const user = await prisma.user.findUnique({ where: { id: decoded.id } });
		return user;
	} catch (error) {
		console.error('Error al verificar token en socket:', error.message);
		return null;
	}
};

export default (io) => {
	io.on('connection', async (socket) => {
		// console.log('Socket intentando conectar:', socket.id);

		// El cliente debe enviar su token al conectar
		const token = socket.handshake.auth.token;

		let user;
		if (token) {
			user = await getUserFromToken(token);
		} else {
			// Fallback para pruebas o si el auth se pasa diferente
			user = socket.handshake.auth.user;
		}

		if (!user) {
			// Si después de todo no hay usuario, rechazamos
			// console.log('Conexión de socket rechazada: Usuario no autenticado.');
			socket.disconnect(true);
			return;
		}

		// --- Lógica para Funcionarios (AF-App) ---
		if (user.email && user.hasOwnProperty('activo')) {
			// Duck typing para identificar Funcionario
			socket.join(`funcionario:${user.id}`);

			// Actualizar socketId en BD
			await prisma.funcionario.update({
				where: { id: user.id },
				data: { socketId: socket.id }
			});

			if (user.activo) {
				// Activo = De Guardia
				socket.join('funcionarios-guardia');
				// console.log(`Funcionario ${user.nombre} unido a sala: funcionarios-guardia`);
			}

			socket.on('disconnect', async () => {
				await prisma.funcionario.update({
					where: { id: user.id },
					data: { socketId: null }
				});
			});

			return; // Salir aquí para funcionarios, usualmente no necesitan lógica EDAN
		}

		// --- Lógica para Usuarios EDAN ---

		// Unirse a sala basada en tipoInstitucion
		if (user.rol === 'superadmin') {
			socket.join('superadmin');
			socket.join('web');
		} else if (user.tipoInstitucion) {
			socket.join(`institucion:${user.tipoInstitucion}`);
			socket.join('web');

			// Sala geográfica según nivel de cuenta
			if (user.nivelCuenta === 'estadal' && user.codigo) {
				socket.join(`estado:${user.codigo}|${user.tipoInstitucion}`);
			} else if (user.nivelCuenta === 'municipal' && user.codigo) {
				socket.join(`municipio:${user.codigo}|${user.tipoInstitucion}`);
			}
		}

		// Unirse/salir de sala de evento específico
		socket.on('join-evento', ({ eventoId }) => {
			if (eventoId) {
				socket.join(`evento:${eventoId}`);
			}
		});

		socket.on('leave-evento', ({ eventoId }) => {
			if (eventoId) {
				socket.leave(`evento:${eventoId}`);
			}
		});

		// CREATE
		const handleCreateEvaluation = async (data) => {
			try {
				const evaluationData = data.data;

				const dataWithUser = {
					...evaluationData,
					userId: user.id,
					tipoInstitucion: user.tipoInstitucion || null
				};

				const newEvaluation = await _createEvaluation(dataWithUser);

				io.to('superadmin').emit('server:new-evaluation', newEvaluation);

				if (newEvaluation.tipoInstitucion) {
					io.to(`institucion:${newEvaluation.tipoInstitucion}`).emit('server:new-evaluation', newEvaluation);
				}
				if (newEvaluation.eventoId) {
					io.to(`evento:${newEvaluation.eventoId}`).emit('server:new-evaluation', newEvaluation);
				}
			} catch (error) {
				console.error('Error en socket al crear evaluación:', error);
				socket.emit('server:error', {
					message: 'Error al crear la evaluación',
					details: error.message
				});
			}
		};

		// UPDATE
		const handleUpdateEvaluation = async (data) => {
			try {
				const updateData = data.data;

				const {
					id,
					createdAt,
					updatedAt,
					grupoFamiliar,
					synced,
					userId,
					fotosAdicionalesFiles,
					...restOfData
				} = updateData;

				if (!id) {
					throw new Error('Se requiere ID para actualizar la evaluación');
				}

				const familiarData = {
					deleteMany: {},
					create: grupoFamiliar.map(({ id: memberId, evaluacionId, ...member }) => member)
				};

				const updatedEvaluation = await _updateEvaluation(id, restOfData, familiarData);

				io.to('superadmin').emit('server:evaluation-updated', updatedEvaluation);

				if (updatedEvaluation.tipoInstitucion) {
					io.to(`institucion:${updatedEvaluation.tipoInstitucion}`).emit('server:evaluation-updated', updatedEvaluation);
				}
				if (updatedEvaluation.eventoId) {
					io.to(`evento:${updatedEvaluation.eventoId}`).emit('server:evaluation-updated', updatedEvaluation);
				}
			} catch (error) {
				console.error('Error en socket al actualizar evaluación:', error);
				socket.emit('server:error', {
					message: 'Error al actualizar la evaluación',
					details: error.message
				});
			}
		};

		// DELETE
		const handleDeleteEvaluation = async (data) => {
			try {
				const { id } = data;
				if (!id) {
					throw new Error('Se requiere ID para eliminar la evaluación');
				}
				const deletedEvaluation = await _deleteEvaluation(id);

				io.to('superadmin').emit('server:evaluation-deleted', { id: deletedEvaluation.id });

				if (deletedEvaluation.tipoInstitucion) {
					io.to(`institucion:${deletedEvaluation.tipoInstitucion}`).emit('server:evaluation-deleted', {
						id: deletedEvaluation.id
					});
				}
				if (deletedEvaluation.eventoId) {
					io.to(`evento:${deletedEvaluation.eventoId}`).emit('server:evaluation-deleted', {
						id: deletedEvaluation.id
					});
				}
			} catch (error) {
				console.error('Error en socket al eliminar evaluación:', error);
				socket.emit('server:error', {
					message: 'Error al eliminar la evaluación',
					details: error.message
				});
			}
		};

		// Listeners (Escuchadores) para eventos desde app móvil y frontend web
		socket.on('app:create-evaluation', handleCreateEvaluation);
		// socket.on('front:create-evaluation', handleCreateEvaluation);

		socket.on('app:update-evaluation', handleUpdateEvaluation);
		// socket.on('front:update-evaluation', handleUpdateEvaluation);

		socket.on('app:delete-evaluation', handleDeleteEvaluation);
		// socket.on('front:delete-evaluation', handleDeleteEvaluation);

		// Listeners para nuevos eventos Satos
		socket.on('internal:trigger-alert-officials', (report) => {
			// Re-emitir explícitamente a funcionarios de guardia
			io.to('funcionarios-guardia').emit('af:alerta-critica', report);
			// console.log('Alerta crítica retransmitida a funcionarios de guardia');
		});

		socket.on('disconnect', () => {
			console.log('Socket desconectado:', socket.id);
		});
	});
};

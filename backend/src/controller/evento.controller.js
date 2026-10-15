import prisma from '../libs/prisma.js';

// ============================================
// GENERAR CÓDIGO ÚNICO DE EVENTO
// ============================================
const generarCodigoEvento = async (estado) => {
	const prefijo = estado.substring(0, 3).toUpperCase();
	const ultimoEvento = await prisma.evento.findFirst({
		where: { codigo: { startsWith: `${prefijo}-` } },
		orderBy: { id: 'desc' },
		select: { codigo: true }
	});

	let siguiente = 1;
	if (ultimoEvento?.codigo) {
		const partes = ultimoEvento.codigo.split('-');
		siguiente = parseInt(partes[1], 10) + 1;
	}

	return `${prefijo}-${String(siguiente).padStart(3, '0')}`;
};

// Helper para emitir eventos por sockets a salas segmentadas geográficamente y por institución
const emitirEventoGeografico = (io, evento, user, eventName, data) => {
	io.to('superadmin').emit(eventName, data);

	if (user.tipoInstitucion) {
		// Admin estadal del mismo estado
		io.to(`estado:${evento.estado.toUpperCase()}|${user.tipoInstitucion}`).emit(eventName, data);

		// Coordinadores de municipios cubiertos
		if (evento.municipios && evento.municipios.length > 0) {
			for (const municipio of evento.municipios) {
				const codigoMunicipio = `${evento.estado.toUpperCase()}-${municipio.toUpperCase()}`;
				io.to(`municipio:${codigoMunicipio}|${user.tipoInstitucion}`).emit(eventName, data);
			}
		}
	}
};

// ============================================
// CREAR NUEVO EVENTO
// ============================================
export const crearEvento = async (req, res) => {
	try {
		const user = req.user;
		const { nombre, descripcion, tipoEvento, estado, municipios } = req.body;

		// Validaciones
		if (!nombre || !tipoEvento || !estado) {
			return res.status(400).json({
				error: 'Nombre, tipo de evento y estado son requeridos'
			});
		}

		// Verificar permisos (admin, superadmin y coordinador pueden crear eventos)
		if (!['admin', 'superadmin', 'coordinador'].includes(user.rol)) {
			return res.status(403).json({
				error: 'No tiene permisos para crear eventos'
			});
		}

		// Auto-asignación de municipios si es municipal y no vienen en el body
		let municipiosFinal = municipios || [];
		if (user.nivelCuenta === 'municipal' && municipiosFinal.length === 0 && user.codigo) {
			const [_, rawMunicipios] = user.codigo.split('-');
			if (rawMunicipios) {
				municipiosFinal = rawMunicipios.split(',');
			}
		}

		// Generar código único del evento
		const codigo = await generarCodigoEvento(estado);

		const nuevoEvento = await prisma.evento.create({
			data: {
				nombre,
				descripcion,
				tipoEvento,
				codigo,
				estado,
				municipios: municipiosFinal,
				tipoInstitucion: user.tipoInstitucion,
				creadoPor: user.id,
				estadoEvento: 'activo'
			},
			include: {
				creador: {
					select: {
						nombre: true,
						apellido: true,
						cargo: true
					}
				}
			}
		});

		// Emitir por WebSocket
		if (req.io) {
			emitirEventoGeografico(req.io, nuevoEvento, user, 'server:nuevo-evento', nuevoEvento);
		}

		return res.status(201).json(nuevoEvento);
	} catch (error) {
		console.error('Error al crear evento:', error);
		return res.status(500).json({ error: error.message });
	}
};

// ============================================
// OBTENER TODOS LOS EVENTOS
// ============================================
export const obtenerEventos = async (req, res) => {
	try {
		const user = req.user;
		const { estado: estadoEvento } = req.query; // 'activo', 'cerrado', 'archivado'

		let whereClause = {};

		// Filtrar por jerarquía de usuario e INSTITUCIÓN
		if (user.rol !== 'superadmin') {
			const jurisdictionFilters = {};

			// ⭐ Aislamiento por institución (si el usuario tiene una definida)
			if (user.tipoInstitucion) {
				jurisdictionFilters.tipoInstitucion = user.tipoInstitucion;
			}

			if (user.nivelCuenta === 'estadal') {
				jurisdictionFilters.estado = user.codigo; // El código del estadal es el Estado
			} else if (user.nivelCuenta === 'municipal' && user.codigo) {
				const [estado, rawMunicipios] = user.codigo.split('-');
				const municipiosList = rawMunicipios ? rawMunicipios.split(',') : [];

				jurisdictionFilters.estado = estado;
				jurisdictionFilters.municipios = { hasSome: municipiosList };
			}

			// El usuario ve lo de su jurisdicción OR lo que él mismo creó
			whereClause.OR = [
				{ ...jurisdictionFilters, ...(estadoEvento ? { estadoEvento } : {}) },
				{ creadoPor: user.id, ...(estadoEvento ? { estadoEvento } : {}) }
			];
		} else if (estadoEvento) {
			whereClause.estadoEvento = estadoEvento;
		}

		const eventos = await prisma.evento.findMany({
			where: whereClause,
			include: {
				_count: {
					select: { evaluaciones: true }
				},
				creador: {
					select: {
						nombre: true,
						apellido: true,
						cargo: true
					}
				},
				usuarioCierre: {
					select: {
						nombre: true,
						apellido: true
					}
				}
			},
			orderBy: { fechaInicio: 'desc' }
		});

		return res.status(200).json(eventos);
	} catch (error) {
		console.error('Error al obtener eventos:', error);
		return res.status(500).json({ error: error.message });
	}
};

// ============================================
// OBTENER EVENTOS ACTIVOS
// ============================================
export const obtenerEventosActivos = async (req, res) => {
	try {
		const user = req.user;
		let whereClause = { estadoEvento: 'activo' };

		// Filtrar por jerarquía de usuario e INSTITUCIÓN
		if (user.rol !== 'superadmin') {
			const jurisdictionFilters = { estadoEvento: 'activo' };

			// ⭐ Aislamiento por institución
			if (user.tipoInstitucion) {
				jurisdictionFilters.tipoInstitucion = user.tipoInstitucion;
			}

			if (user.nivelCuenta === 'estadal') {
				jurisdictionFilters.estado = user.codigo;
			} else if (user.nivelCuenta === 'municipal' && user.codigo) {
				const [estado, rawMunicipios] = user.codigo.split('-');
				const municipiosList = rawMunicipios ? rawMunicipios.split(',') : [];

				jurisdictionFilters.estado = estado;
				jurisdictionFilters.municipios = { hasSome: municipiosList };
			}

			// El usuario ve lo activo de su jurisdicción OR lo que él mismo creó (si está activo)
			whereClause.OR = [jurisdictionFilters, { creadoPor: user.id, estadoEvento: 'activo' }];
			delete whereClause.estadoEvento; // Quitamos el root level ya que está en el OR
		}

		const eventos = await prisma.evento.findMany({
			where: whereClause,
			include: {
				_count: {
					select: { evaluaciones: true }
				},
				creador: {
					select: { nombre: true, apellido: true }
				}
			},
			orderBy: { fechaInicio: 'desc' }
		});

		return res.status(200).json(eventos);
	} catch (error) {
		console.error('Error al obtener eventos activos:', error);
		return res.status(500).json({ error: error.message });
	}
};

// ============================================
// OBTENER EVENTO POR ID
// ============================================
export const obtenerEventoPorId = async (req, res) => {
	try {
		const { id } = req.params;

		const evento = await prisma.evento.findUnique({
			where: { id: parseInt(id) },
			include: {
				_count: {
					select: { evaluaciones: true }
				},
				creador: {
					select: {
						nombre: true,
						apellido: true,
						cargo: true,
						email: true
					}
				},
				usuarioCierre: {
					select: {
						nombre: true,
						apellido: true
					}
				},
				evaluaciones: {
					take: 10, // Solo las primeras 10 para preview
					orderBy: { createdAt: 'desc' },
					select: {
						id: true,
						municipio: true,
						parroquia: true,
						createdAt: true
					}
				}
			}
		});

		if (!evento) {
			return res.status(404).json({ error: 'Evento no encontrado' });
		}

		return res.status(200).json(evento);
	} catch (error) {
		console.error('Error al obtener evento:', error);
		return res.status(500).json({ error: error.message });
	}
};

// ============================================
// ACTUALIZAR EVENTO
// ============================================
export const actualizarEvento = async (req, res) => {
	try {
		const { id } = req.params;
		const user = req.user;
		const { nombre, descripcion, tipoEvento, municipios } = req.body;

		// Verificar que el evento existe
		const evento = await prisma.evento.findUnique({
			where: { id: parseInt(id) }
		});

		if (!evento) {
			return res.status(404).json({ error: 'Evento no encontrado' });
		}

		// Verificar permisos (Creador, Admin de su estado o Superadmin)
		const canEdit =
			user.rol === 'superadmin' ||
			evento.creadoPor === user.id ||
			(user.rol === 'admin' && evento.estado === user.codigo);

		if (!canEdit) {
			return res.status(403).json({
				error: 'No tiene permisos para editar este evento'
			});
		}

		const eventoActualizado = await prisma.evento.update({
			where: { id: parseInt(id) },
			data: {
				...(nombre && { nombre }),
				...(descripcion !== undefined && { descripcion }),
				...(tipoEvento && { tipoEvento }),
				...(municipios && { municipios })
			},
			include: {
				_count: {
					select: { evaluaciones: true }
				},
				creador: {
					select: { nombre: true, apellido: true }
				}
			}
		});

		// Emitir por WebSocket
		if (req.io) {
			emitirEventoGeografico(req.io, eventoActualizado, user, 'server:evento-actualizado', eventoActualizado);
		}

		return res.status(200).json(eventoActualizado);
	} catch (error) {
		console.error('Error al actualizar evento:', error);
		return res.status(500).json({ error: error.message });
	}
};

// ============================================
// CERRAR EVENTO
// ============================================
export const cerrarEvento = async (req, res) => {
	try {
		const { id } = req.params;
		const user = req.user;

		// Verificar que el evento existe
		const evento = await prisma.evento.findUnique({
			where: { id: parseInt(id) }
		});

		if (!evento) {
			return res.status(404).json({ error: 'Evento no encontrado' });
		}

		// Verificar que el evento está activo
		if (evento.estadoEvento !== 'activo') {
			return res.status(400).json({
				error: 'El evento ya está cerrado o archivado'
			});
		}

		// Verificar permisos (Creador, Admin de su estado o Superadmin)
		const canClose =
			user.rol === 'superadmin' ||
			evento.creadoPor === user.id ||
			(user.rol === 'admin' && evento.estado.toUpperCase() === user.codigo?.toUpperCase()) ||
			(user.rol === 'coordinador' && evento.estado.toUpperCase() === user.codigo?.toUpperCase());

		if (!canClose) {
			return res.status(403).json({
				error: 'No tiene permisos para cerrar este evento'
			});
		}

		const eventoCerrado = await prisma.$transaction(async (tx) => {
			// Revocar todas las asignaciones de evaluadores
			await tx.eventoUsuario.deleteMany({
				where: { eventoId: parseInt(id) }
			});

			return tx.evento.update({
				where: { id: parseInt(id) },
				data: {
					estadoEvento: 'cerrado',
					fechaCierre: new Date(),
					cerradoPor: user.id
				},
				include: {
					_count: {
						select: { evaluaciones: true }
					},
					creador: {
						select: { nombre: true, apellido: true }
					},
					usuarioCierre: {
						select: { nombre: true, apellido: true }
					}
				}
			});
		});

		// Emitir por WebSocket
		if (req.io) {
			emitirEventoGeografico(req.io, eventoCerrado, user, 'server:evento-cerrado', eventoCerrado);
		}

		return res.status(200).json(eventoCerrado);
	} catch (error) {
		console.error('Error al cerrar evento:', error);
		return res.status(500).json({ error: error.message });
	}
};

// ============================================
// REACTIVAR EVENTO
// ============================================
export const reactivarEvento = async (req, res) => {
	try {
		const { id } = req.params;
		const user = req.user;

		// Verificar que el evento existe
		const evento = await prisma.evento.findUnique({
			where: { id: parseInt(id) }
		});

		if (!evento) {
			return res.status(404).json({ error: 'Evento no encontrado' });
		}

		// Verificar que el evento está cerrado
		if (evento.estadoEvento !== 'cerrado') {
			return res.status(400).json({
				error: 'Solo se pueden reactivar eventos cerrados'
			});
		}

		// Verificar permisos (Creador, Admin de su estado o Superadmin)
		const canReactivate =
			user.rol === 'superadmin' ||
			evento.creadoPor === user.id ||
			(user.rol === 'admin' && evento.estado === user.codigo);

		if (!canReactivate) {
			return res.status(403).json({
				error: 'No tiene permisos para reactivar este evento'
			});
		}

		const eventoReactivado = await prisma.evento.update({
			where: { id: parseInt(id) },
			data: {
				estadoEvento: 'activo',
				fechaCierre: null,
				cerradoPor: null
			},
			include: {
				_count: {
					select: { evaluaciones: true }
				},
				creador: {
					select: { nombre: true, apellido: true }
				}
			}
		});

		// Emitir por WebSocket
		if (req.io) {
			emitirEventoGeografico(req.io, eventoReactivado, user, 'server:evento-reactivado', eventoReactivado);
		}

		return res.status(200).json(eventoReactivado);
	} catch (error) {
		console.error('Error al reactivar evento:', error);
		return res.status(500).json({ error: error.message });
	}
};

// ============================================
// ARCHIVAR EVENTO
// ============================================
export const archivarEvento = async (req, res) => {
	try {
		const { id } = req.params;
		const user = req.user;

		// Solo superadmin puede archivar
		if (user.rol !== 'superadmin') {
			return res.status(403).json({
				error: 'Solo superadmin puede archivar eventos'
			});
		}

		const evento = await prisma.evento.findUnique({
			where: { id: parseInt(id) }
		});

		if (!evento) {
			return res.status(404).json({ error: 'Evento no encontrado' });
		}

		// Verificar que el evento está cerrado
		if (evento.estadoEvento !== 'cerrado') {
			return res.status(400).json({
				error: 'Solo se pueden archivar eventos cerrados'
			});
		}

		const eventoArchivado = await prisma.evento.update({
			where: { id: parseInt(id) },
			data: {
				estadoEvento: 'archivado',
				fechaArchivado: new Date()
			}
		});

		// Emitir por WebSocket
		if (req.io) {
			emitirEventoGeografico(req.io, eventoArchivado, user, 'server:evento-archivado', eventoArchivado);
		}

		return res.status(200).json(eventoArchivado);
	} catch (error) {
		console.error('Error al archivar evento:', error);
		return res.status(500).json({ error: error.message });
	}
};

// ============================================
// ELIMINAR EVENTO (Solo superadmin)
// ============================================
export const eliminarEvento = async (req, res) => {
	try {
		const { id } = req.params;
		const user = req.user;

		// Verificar que el evento existe
		const evento = await prisma.evento.findUnique({
			where: { id: parseInt(id) }
		});

		if (!evento) {
			return res.status(404).json({ error: 'Evento no encontrado' });
		}

		// Verificar permisos (superadmin, admin de su estado, o creador del evento)
		const canDelete =
			user.rol === 'superadmin' ||
			evento.creadoPor === user.id ||
			(user.rol === 'admin' && evento.estado === user.codigo);

		if (!canDelete) {
			return res.status(403).json({
				error: 'No tiene permisos para eliminar este evento'
			});
		}

		// Verificar que el evento está cerrado (Capa de seguridad adicional)
		if (evento.estadoEvento !== 'cerrado') {
			return res.status(400).json({
				error: 'Solo se pueden eliminar eventos que han sido CERRADOS previamente.'
			});
		}

		// Borrado en cascada usando transacción
		await prisma.$transaction(async (tx) => {
			// 1. Eliminar todas las asignaciones del evento
			await tx.eventoUsuario.deleteMany({
				where: { eventoId: parseInt(id) }
			});

			// 2. Eliminar todas las evaluaciones asociadas al evento
			await tx.evaluation.deleteMany({
				where: { eventoId: parseInt(id) }
			});

			// 3. Eliminar el evento
			await tx.evento.delete({
				where: { id: parseInt(id) }
			});
		});

		// Emitir por WebSocket
		if (req.io) {
			emitirEventoGeografico(req.io, evento, user, 'server:evento-eliminado', { id: parseInt(id) });
		}

		return res.status(200).json({
			message: 'Evento y sus evaluaciones eliminados exitosamente'
		});
	} catch (error) {
		console.error('Error al eliminar evento:', error);
		return res.status(500).json({ error: error.message });
	}
};

// ============================================
// ⭐ NUEVO: VALIDAR CÓDIGO DE EVENTO
// ============================================
export const validarCodigoEvento = async (req, res) => {
	try {
		const { codigo } = req.body;

		if (!codigo) {
			return res.status(400).json({ error: 'Código requerido' });
		}

		const evento = await prisma.evento.findUnique({
			where: { codigo: codigo.toUpperCase() },
			select: {
				id: true,
				nombre: true,
				tipoEvento: true,
				estado: true,
				municipios: true,
				estadoEvento: true,
				tipoInstitucion: true
			}
		});

		if (!evento) {
			return res.status(404).json({ error: 'Código de evento no válido' });
		}

		if (evento.estadoEvento !== 'activo') {
			return res.status(400).json({ error: 'Este evento ya no está activo' });
		}

		return res.status(200).json(evento);
	} catch (error) {
		console.error('Error al validar código:', error);
		return res.status(500).json({ error: error.message });
	}
};

// ============================================
// ⭐ NUEVO: ASIGNAR EVALUADOR A EVENTO
// ============================================
export const asignarEvaluador = async (req, res) => {
	try {
		const user = req.user;
		const { eventoId, userId } = req.body;

		if (!['admin', 'superadmin'].includes(user.rol)) {
			return res.status(403).json({ error: 'No tiene permisos para asignar evaluadores' });
		}

		const evento = await prisma.evento.findUnique({ where: { id: eventoId } });
		if (!evento) {
			return res.status(404).json({ error: 'Evento no encontrado' });
		}
		if (evento.estadoEvento !== 'activo') {
			return res.status(400).json({ error: 'Solo se pueden asignar evaluadores a eventos activos' });
		}

		// Verificar que el evaluador existe
		const evaluador = await prisma.user.findUnique({ where: { id: userId } });
		if (!evaluador) {
			return res.status(404).json({ error: 'Evaluador no encontrado' });
		}

		// Crear asignación
		const asignacion = await prisma.eventoUsuario.create({
			data: { eventoId, userId },
			include: {
				user: { select: { id: true, nombre: true, apellido: true, cedula: true } }
			}
		});

		// Emitir por WebSocket
		if (req.io) {
			req.io.to(`user:${userId}`).emit('server:evento-asignado', {
				eventoId,
				eventoNombre: evento.nombre,
				codigo: evento.codigo
			});
		}

		return res.status(201).json(asignacion);
	} catch (error) {
		if (error.code === 'P2002') {
			return res.status(409).json({ error: 'Este evaluador ya está asignado a este evento' });
		}
		console.error('Error al asignar evaluador:', error);
		return res.status(500).json({ error: error.message });
	}
};

// ============================================
// ⭐ NUEVO: OBTENER ASIGNACIONES DEL USUARIO ACTUAL
// ============================================
export const obtenerMisAsignaciones = async (req, res) => {
	try {
		const user = req.user;

		const asignaciones = await prisma.eventoUsuario.findMany({
			where: { userId: user.id },
			include: {
				evento: {
					select: {
						id: true,
						nombre: true,
						tipoEvento: true,
						codigo: true,
						estado: true,
						municipios: true,
						estadoEvento: true,
						fechaInicio: true
					}
				}
			},
			orderBy: { createdAt: 'desc' }
		});

		// Filtrar solo eventos activos
		const activas = asignaciones.filter(a => a.evento.estadoEvento === 'activo');

		return res.status(200).json(activas);
	} catch (error) {
		console.error('Error al obtener asignaciones:', error);
		return res.status(500).json({ error: error.message });
	}
};

// ============================================
// ⭐ NUEVO: OBTENER EVALUADORES ASIGNADOS A UN EVENTO
// ============================================
export const obtenerEvaluadoresEvento = async (req, res) => {
	try {
		const { id } = req.params;
		const user = req.user;

		if (!['admin', 'superadmin'].includes(user.rol)) {
			return res.status(403).json({ error: 'No tiene permisos' });
		}

		const asignaciones = await prisma.eventoUsuario.findMany({
			where: { eventoId: parseInt(id) },
			include: {
				user: {
					select: {
						id: true,
						nombre: true,
						apellido: true,
						cedula: true,
						email: true,
						telefono: true
					}
				}
			},
			orderBy: { createdAt: 'desc' }
		});

		return res.status(200).json(asignaciones);
	} catch (error) {
		console.error('Error al obtener evaluadores del evento:', error);
		return res.status(500).json({ error: error.message });
	}
};

// ============================================
// ⭐ NUEVO: DESASIGNAR EVALUADOR DE EVENTO
// ============================================
export const desasignarEvaluador = async (req, res) => {
	try {
		const user = req.user;
		const { eventoId, userId } = req.body;

		if (!['admin', 'superadmin'].includes(user.rol)) {
			return res.status(403).json({ error: 'No tiene permisos para desasignar evaluadores' });
		}

		await prisma.eventoUsuario.deleteMany({
			where: { eventoId, userId }
		});

		return res.status(200).json({ message: 'Evaluador desasignado exitosamente' });
	} catch (error) {
		console.error('Error al desasignar evaluador:', error);
		return res.status(500).json({ error: error.message });
	}
};

import { Router } from 'express';
import {
	crearEvento,
	obtenerEventos,
	obtenerEventosActivos,
	obtenerEventoPorId,
	actualizarEvento,
	cerrarEvento,
	reactivarEvento,
	archivarEvento,
	eliminarEvento,
	validarCodigoEvento,
	asignarEvaluador,
	obtenerMisAsignaciones,
	obtenerEvaluadoresEvento,
	desasignarEvaluador
} from '../../controller/evento.controller.js';
import { autenticacion } from '../../middleware/validartoken.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(autenticacion);

// GET /api/eventos - Obtener todos los eventos (con query params)
router.get('/', obtenerEventos);

// GET /api/eventos/activos - Obtener solo eventos activos
router.get('/activos', obtenerEventosActivos);

// POST /api/eventos/validar-codigo - Validar código de evento
router.post('/validar-codigo', validarCodigoEvento);

// POST /api/eventos/mis-asignaciones - Obtener asignaciones del usuario actual
router.get('/mis-asignaciones', obtenerMisAsignaciones);

// GET /api/eventos/:id - Obtener evento específico
router.get('/:id', obtenerEventoPorId);

// GET /api/eventos/:id/evaluadores - Obtener evaluadores asignados
router.get('/:id/evaluadores', obtenerEvaluadoresEvento);

// POST /api/eventos - Crear nuevo evento
router.post('/', crearEvento);

// POST /api/eventos/asignar - Asignar evaluador a evento
router.post('/asignar', asignarEvaluador);

// DELETE /api/eventos/desasignar - Desasignar evaluador de evento
router.delete('/desasignar', desasignarEvaluador);

// PUT /api/eventos/:id - Actualizar evento
router.put('/:id', actualizarEvento);

// PUT /api/eventos/:id/cerrar - Cerrar evento
router.put('/:id/cerrar', cerrarEvento);

// PUT /api/eventos/:id/reactivar - Reactivar evento cerrado
router.put('/:id/reactivar', reactivarEvento);

// PUT /api/eventos/:id/archivar - Archivar evento
router.put('/:id/archivar', archivarEvento);

// DELETE /api/eventos/:id - Eliminar evento
router.delete('/:id', eliminarEvento);

export default router;

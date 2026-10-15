import { Router } from 'express';
import {
	crearSolicitud,
	obtenerSolicitudes,
	aprobarSolicitud,
	rechazarSolicitud,
	uploadCarta
} from '../../controller/registration.controller.js';
import { autenticacion } from '../../middleware/validartoken.js';
import upload from '../../libs/multer.js';

const router = Router();

// ==========================================
// RUTAS PÚBLICAS (sin autenticación)
// ==========================================

// Crear solicitud de registro
router.post('/registration-request', crearSolicitud);

// Upload de carta formal (PDF)
router.post('/registration-request/upload-carta', upload.single('cartaFormal'), uploadCarta);

// ==========================================
// RUTAS PROTEGIDAS (solo superadmin)
// ==========================================

// Obtener todas las solicitudes
router.get('/registration-requests', autenticacion, obtenerSolicitudes);

// Aprobar solicitud
router.put('/registration-requests/:id/approve', autenticacion, aprobarSolicitud);

// Rechazar solicitud
router.put('/registration-requests/:id/reject', autenticacion, rechazarSolicitud);

export default router;

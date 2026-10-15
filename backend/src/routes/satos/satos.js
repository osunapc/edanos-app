import { Router } from 'express';
import multer from 'multer';
import {
	createReport,
	getReports,
	closeReport,
	validateReport
} from '../../controller/satos.controller.js';
import { rateLimit } from 'express-rate-limit';

const router = Router();
// Configuración de Multer para guardar archivos en memoria antes de subirlos a MinIO
const upload = multer({ storage: multer.memoryStorage() });

// Limitador de velocidad: Max 10 reportes por IP cada 30 minutos
// Esto protege contra ataques de spam (DDoS o flood)
const createReportLimiter = rateLimit({
	windowMs: 30 * 60 * 1000,
	max: 10,
	message: { error: 'Demasiados reportes creados desde esta IP, por favor intente más tarde' },
	standardHeaders: true,
	legacyHeaders: false
});

// Endpoints Públicos (No requieren login)
router.post('/satos/report', createReportLimiter, upload.single('photo'), createReport);

// Endpoints Protegidos (TODO: Agregar middleware de Auth cuando esté lista la integración administrativa)
router.get('/satos/reports', getReports);
router.put('/satos/reports/:id/close', closeReport);
router.put('/satos/reports/:id/validate', validateReport);

export default router;

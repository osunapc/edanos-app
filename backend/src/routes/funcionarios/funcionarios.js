import { Router } from 'express';
import {
	loginFuncionario,
	getMe,
	getFuncionariosActivos,
	toggleGuardia
} from '../../controller/funcionarios.controller.js';
// TODO: Importar Middleware de Auth para verificación

const router = Router();

// Rutas Públicas
router.post('/funcionarios/login', loginFuncionario);

// Rutas Protegidas (Necesitan middleware)
router.get('/funcionarios/me', getMe);
router.get('/funcionarios/activos', getFuncionariosActivos);
router.put('/funcionarios/guardia', toggleGuardia);

export default router;

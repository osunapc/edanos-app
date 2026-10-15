import { Router } from 'express';
import {
	obtenerEdan,
	obtenerEdanId,
	crearEdan,
	actualizarEdan,
	eliminarEdan,
	uploadFiles
} from '../../controller/edan.controller.js';
import { autenticacion } from '../../middleware/validartoken.js';
import upload from '../../libs/multer.js';

const router = Router();

router.get('/edan', autenticacion, obtenerEdan);
router.get('/edan/:id', autenticacion, obtenerEdanId);
router.post('/edan', autenticacion, crearEdan);
router.post('/edan/upload', autenticacion, upload.any(), uploadFiles);
router.put('/edan/:id', autenticacion, actualizarEdan);
router.delete('/edan/:id', autenticacion, eliminarEdan);

export default router;

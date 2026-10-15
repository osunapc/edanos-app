import { Router } from 'express';
import {
	eliminarUsuario,
	login,
	logout,
	obtenerUsuarios,
	obtenerUsuarioPorCi,
	obtenerUsuario,
	registro,
	actualizarUsuario,
	verifyToken,
	loginMovil
} from '../../controller/usuarios.controller.js';
import { autenticacion } from '../../middleware/validartoken.js';

const router = Router();

router.get('/usuarios', autenticacion, obtenerUsuarios);

router.get('/usuarios/:id', obtenerUsuario);

router.get('/usuariosCedula/:ci', obtenerUsuarioPorCi);

router.post('/usuarios/login', login);

router.post('/usuarios/loginMovil', loginMovil);

router.post('/usuarios/registro', registro);

router.get('/verifyToken', verifyToken);

router.delete('/usuarios/:id', eliminarUsuario);

router.post('/usuarios/logout', logout);

router.patch('/usuarios/:id', autenticacion, actualizarUsuario);

export default router;

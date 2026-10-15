import prisma from '../libs/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const loginFuncionario = async (req, res) => {
	try {
		const { email, password } = req.body;

		const funcionario = await prisma.funcionario.findUnique({
			where: { email }
		});

		if (!funcionario || !funcionario.activo) {
			return res.status(401).json({ error: 'Credenciales inválidas o cuenta inactiva' });
		}

		const validPassword = await bcrypt.compare(password, funcionario.password);
		if (!validPassword) {
			return res.status(401).json({ error: 'Credenciales inválidas' });
		}

		// Generar token específico para funcionarios (rol: 'funcionario')
		const token = jwt.sign(
			{ id: funcionario.id, role: 'funcionario' },
			process.env.JWT_SECRET_KEY,
			{ expiresIn: '7d' } // Expira en 7 días
		);

		return res.json({
			token,
			funcionario: {
				id: funcionario.id,
				nombre: funcionario.nombre,
				email: funcionario.email,
				activo: funcionario.activo
			}
		});
	} catch (error) {
		console.error('Error en Login:', error);
		return res.status(500).json({ error: 'Error en el servidor' });
	}
};

export const getMe = async (req, res) => {
	try {
		// req.user es inyectado por el middleware de autenticación
		const funcionario = await prisma.funcionario.findUnique({
			where: { id: req.user.id },
			select: { id: true, nombre: true, email: true, activo: true }
		});
		res.json(funcionario);
	} catch (error) {
		res.status(500).json({ error: 'Error obteniendo perfil' });
	}
};

export const getFuncionariosActivos = async (req, res) => {
	try {
		const funcionarios = await prisma.funcionario.findMany({
			where: { activo: true },
			select: { id: true, nombre: true, email: true, activo: true }
		});
		res.json(funcionarios);
	} catch (error) {
		res.status(500).json({ error: 'Error obteniendo funcionarios activos' });
	}
};

export const toggleGuardia = async (req, res) => {
	try {
		const { activo } = req.body; // true = entra de guardia, false = sale

		const updated = await prisma.funcionario.update({
			where: { id: req.user.id },
			data: { activo: activo }
		});

		return res.json(updated);
	} catch (error) {
		return res.status(500).json({ error: 'Error actualizando estado de guardia' });
	}
};

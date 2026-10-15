/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-tabs */
/* eslint-disable indent */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../libs/prisma.js';

export const login = async (req, res) => {
	const { cedula, contrasena } = req.body;

	try {
		if (!cedula || !contrasena) {
			return res.status(400).json({ error: 'cedula y contraseña son requeridos' });
		}
		// Verificar la conexión a la base de datos
		try {
			await prisma.$connect();
		} catch (dbError) {
			console.error('Error de conexión a la base de datos:', dbError);
			return res.status(500).json({ error: 'Error de conexión a la base de datos' });
		}

		const user = await prisma.user.findUnique({
			where: { cedula }
		});
		if (user) {
			const isMatch = await bcrypt.compare(contrasena, user.contrasena);

			if (isMatch) {
				const token = jwt.sign(
					{
						id: user.id,
						codigo: user.codigo,
						rol: user.rol,
						nivelCuenta: user.nivelCuenta,
						tipoInstitucion: user.tipoInstitucion || null
					},
					process.env.JWT_SECRET_KEY,
					{ expiresIn: '30d' }
				);

				const cookieOptions = {
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
					sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
					expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
				};
				const { contrasena: _, ...userWithoutPassword } = user;
				return res
					.cookie('token', token, cookieOptions)
					.status(200)
					.json({ ...userWithoutPassword, token });
			}
			return res.status(401).json([{ error: 'Credenciales inválidas' }]);
		} else {
			res.status(401).json({ error: 'Credenciales inválidas' });
		}
	} catch (error) {
		console.error('Error en el login:', error);
		res.status(500).json({ error: 'Error interno del servidor' });
	}
};

export const loginMovil = async (req, res) => {
	const { cedula, contrasena } = req.body;

	try {
		if (!cedula || !contrasena) {
			return res.status(400).json({ error: 'cedula y contraseña son requeridos' });
		}
		// Verificar la conexión a la base de datos
		try {
			await prisma.$connect();
		} catch (dbError) {
			console.error('Error de conexión a la base de datos:', dbError);
			return res.status(500).json({ error: 'Error de conexión a la base de datos' });
		}

		const user = await prisma.user.findUnique({
			where: { cedula }
		});
		if (user) {
			const isMatch = await bcrypt.compare(contrasena, user.contrasena);

			if (isMatch) {
				// 1. Se crea el token igual que antes.
				const token = jwt.sign(
					{
						id: user.id,
						codigo: user.codigo,
						rol: user.rol,
						nivelCuenta: user.nivelCuenta,
						tipoInstitucion: user.tipoInstitucion || null
					},
					process.env.JWT_SECRET_KEY,
					{
						expiresIn: '30d' // '30d' es más simple que el cálculo manual
					}
				);

				// 2. Por seguridad, creamos un nuevo objeto de usuario sin la contraseña.
				const { contrasena: _, ...userWithoutPassword } = user;

				// 3. Se devuelve un JSON con los datos del usuario Y el token.
				//    No se usan cookies.
				return res.status(200).json({ ...userWithoutPassword, token });
			}
			return res.status(401).json([{ error: 'Credenciales inválidas' }]);
		} else {
			res.status(401).json({ error: 'Credenciales inválidas' });
		}
	} catch (error) {
		console.error('Error en el login:', error);
		res.status(500).json({ error: 'Error interno del servidor' });
	}
};

export const registro = async (req, res) => {
	const {
		nombre,
		apellido,
		email,
		contrasena,
		cedula,
		telefono,
		ubicacion,
		cargo,
		codigo,
		tipoInstitucion
	} = req.body;
	try {
		if (
			!email ||
			!contrasena ||
			!nombre ||
			!apellido ||
			!cedula ||
			!telefono ||
			!ubicacion ||
			!cargo ||
			!codigo
		) {
			return res.status(400).json({ error: 'Todos los campos son requeridos' });
		}

		try {
			await prisma.$connect();
		} catch (dbError) {
			console.error('Error de conexión a la base de datos:', dbError);
			return res.status(500).json({ error: 'Error de conexión a la base de datos' });
		}

		const usuarioExistente = await prisma.user.findUnique({
			where: { cedula }
		});
		if (usuarioExistente) {
			return res.status(400).json({ error: 'El funcionario ya está registrado' });
		}

		const hashedcontraseña = await bcrypt.hash(contrasena, 10);

		// Lógica para determinar nivelCuenta y cuentaEstadalId
		let nivelCuenta = req.body.nivelCuenta || 'municipal'; // Default
		let cuentaEstadalId = null;
		let codigoFinal = codigo;

		// Si no se envió nivelCuenta, intentar inferirlo del rol
		if (!req.body.nivelCuenta) {
			if (req.body.rol === 'admin') nivelCuenta = 'estadal';
			else if (req.body.rol === 'coordinador') nivelCuenta = 'municipal';
		}

		// Validaciones y vinculación jerárquica
		if (nivelCuenta === 'estadal') {
			// Admin Estadal: El código debe ser el nombre del estado (ej: MERIDA)
			// Validar formato simple (letras mayúsculas, sin guiones idealmente, o solo letras)
			// Aquí asumimos que el superadmin sabe lo que hace, pero podríamos forzar uppercase
			codigoFinal = codigo.toUpperCase();
		} else if (nivelCuenta === 'municipal') {
			// Coordinador Municipal: El código debe ser ESTADO-MUNICIPIO
			codigoFinal = codigo.toUpperCase();

			// Intentar vincular con cuenta estadal
			if (codigoFinal.includes('-')) {
				const [estado] = codigoFinal.split('-');
				if (estado) {
					const cuentaEstadal = await prisma.user.findFirst({
						where: {
							codigo: estado,
							nivelCuenta: 'estadal',
							rol: 'admin'
						}
					});
					if (cuentaEstadal) {
						cuentaEstadalId = cuentaEstadal.id;
					}
				}
			}
		}

		const nuevoUsuario = await prisma.user.create({
			data: {
				email,
				nombre,
				apellido,
				contrasena: hashedcontraseña,
				cedula,
				telefono,
				ubicacion,
				cargo,
				rol: req.body.rol || 'user',
				codigo: codigoFinal,
				tipoInstitucion: tipoInstitucion || null,
				nivelCuenta,
				cuentaEstadalId,
				codigoEstadal: cuentaEstadalId ? codigoFinal.split('-')[0] : null
			}
		});
		// Por seguridad, eliminamos la contraseña del objeto antes de devolverlo.
		const { contrasena: _, ...userWithoutPassword } = nuevoUsuario;

		// Devolvemos el objeto del usuario sin la contraseña.
		return res.status(201).json(userWithoutPassword);
	} catch (error) {
		console.error('Error en el registro:', error);
		// Manejo específico para errores de constraint único de Prisma
		if (error.code === 'P2002') {
			const field = error.meta?.target?.[0];
			if (field === 'email') {
				return res.status(400).json({ error: 'El correo electrónico ya está en uso.' });
			}
			if (field === 'telefono') {
				return res.status(400).json({ error: 'El número de teléfono ya está en uso.' });
			}
			return res.status(400).json({ error: `El campo '${field}' ya está registrado.` });
		}
		return res.status(500).json({ error: 'Error interno del servidor' });
	}
};

export const verifyToken = async (req, res) => {
	try {
		let token = null;

		// 1. Intentar desde Authorization header (Bearer)
		if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
			token = req.headers.authorization.split(' ')[1];
		}

		// 2. Fallback: extraer desde cookie
		if (!token && req.headers.cookie) {
			const cookies = req.headers.cookie.split('; ').reduce((acc, cookie) => {
				const [name, value] = cookie.split('=');
				acc[name] = value;
				return acc;
			}, {});
			token = cookies.token;
		}

		if (!token) {
			return res.status(401).json({ message: 'No autorizado' });
		}

		jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, user) => {
			if (err) return res.status(401).json({ message: 'No autorizado' });

			const userFound = await prisma.user.findUnique({
				where: { id: user.id }
			});
			if (!userFound) return res.status(401).json({ message: 'No autorizado' });

			const { contrasena: _, ...userWithoutPassword } = userFound;
			return res.json(userWithoutPassword);
		});
	} catch (error) {
		res.status(401).json({ error: error.message });
	}
};

export const logout = async (req, res) => {
	const cookieOptions = {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'
	};

	res.cookie('token', '', { ...cookieOptions, expires: new Date(0) });

	return res.status(200).json({ message: 'Usuario deslogueado' });
};

export const obtenerUsuarios = async (req, res) => {
	try {
		const requestingUser = req.user; // Usuario que hace la petición (del middleware)
		// console.log('Requesting user:', requestingUser);

		const filter = {};

		// Implementar filtrado jerárquico por rol
		if (requestingUser.rol === 'superadmin') {
			// SUPERADMIN ve todos los usuarios
			// No se aplica ningún filtro
		} else if (requestingUser.rol === 'admin') {
			// ADMIN ve solo usuarios de su estado
			filter.where = {
				codigo: {
					startsWith: requestingUser.codigo
				}
			};
		} else if (requestingUser.rol === 'coordinador') {
			// COORDINADOR ve solo usuarios de su código exacto
			filter.where = {
				codigo: requestingUser.codigo
			};
		}
		// Si es USER, no debería tener acceso (manejado en el frontend)

		const usuarios = await prisma.user.findMany(filter);
		return res.status(200).json(usuarios.map(({ contrasena, ...user }) => user)); // Devolvemos sin contraseña
	} catch (error) {
		return res.status(500).json({ error: `Error al obtener usuarios ${error}` });
	}
};

export const obtenerUsuario = async (req, res) => {
	try {
		const usuario = await prisma.user.findUnique({
			where: { id: parseInt(req.params.id) }
		});
		if (!usuario) {
			return res.status(404).json({ error: 'Usuario no encontrado' });
		}
		const { contrasena: _, ...usuarioSinContrasena } = usuario;
		return res.status(200).json(usuarioSinContrasena);
	} catch (error) {
		return res.status(500).json({ error: `Error al obtener usuario ${error}` });
	}
};

export const obtenerUsuarioPorCi = async (req, res) => {
	try {
		const { ci } = req.params;
		const usuario = await prisma.user.findUnique({
			where: { cedula: ci }
		});
		if (!usuario) {
			return res.status(404).json({ error: 'Usuario no encontrado' });
		}
		const { contrasena: _, ...usuarioSinContrasena } = usuario;
		return res.status(200).json(usuarioSinContrasena);
	} catch (error) {
		return res.status(500).json({ error: `Error al obtener usuario ${error}` });
	}
};

export const actualizarUsuario = async (req, res) => {
	try {
		const id = parseInt(req.params.id);

		if (isNaN(id)) {
			return res.status(400).json({ error: 'ID de usuario inválido' });
		}

		const { contrasena, ...otrosDatos } = req.body;
		let datosActualizados = otrosDatos;
		// console.log('Usuario actualizado:', datosActualizados);
		/* const requestingUser = req.user; // Usuario que realiza la petición
		// Solo un SUPERADMIN puede cambiar el rol de otro usuario.
		// Si el que edita no es SUPERADMIN, eliminamos el campo 'role' del objeto de actualización.
		if (requestingUser.rol !== 'superadmin') {
			delete datosActualizados.rol;
		} */

		if (contrasena) {
			const salt = await bcrypt.genSalt(10);
			const contrasenaEncriptada = await bcrypt.hash(contrasena, salt);
			datosActualizados = { ...otrosDatos, contrasena: contrasenaEncriptada };
		}

		const usuarioActualizado = await prisma.user.update({
			where: { id },
			data: datosActualizados
		});

		const { contrasena: _, ...usuarioSinContrasena } = usuarioActualizado;
		return res.status(200).json(usuarioSinContrasena);
	} catch (error) {
		console.error('Error al actualizar usuario:', error);
		return res.status(500).json({ error: `Error al actualizar usuario: ${error.message}` });
	}
};

export const eliminarUsuario = async (req, res) => {
	try {
		const usuarioEliminado = await prisma.user.delete({
			where: { id: parseInt(req.params.id) }
		});
		const { contrasena: _, ...usuarioSinContrasena } = usuarioEliminado;
		return res.status(200).json(usuarioSinContrasena);
	} catch (error) {
		return res.status(500).json({ error: 'error al eliminar usuario', details: `${error}` });
	}
};

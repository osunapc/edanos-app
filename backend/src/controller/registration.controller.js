import prisma from '../libs/prisma.js';
import bcrypt from 'bcryptjs';
import {
	enviarEmailSuperadmin,
	enviarEmailAprobacion,
	enviarEmailRechazo
} from '../services/email.service.js';
import { generateRandomPassword } from '../utils/generatePassword.js';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../libs/s3-client.js';
import sharp from 'sharp';

const BUCKET_NAME = process.env.MINIO_BUCKET_NAME;

/**
 * Crear una nueva solicitud de registro (público, sin autenticación)
 */
export const crearSolicitud = async (req, res) => {
	try {
		const {
			nombreInstitucion,
			tipoInstitucion,
			estado,
			municipio,
			nivelCuenta, // NUEVO: "estadal" o "municipal"
			nombreResponsable,
			cargo,
			cedula,
			email,
			telefono,
			cartaFormalUrl
		} = req.body;

		console.log('Recibida solicitud de registro:', req.body); // Debug log

		// Validar campos base requeridos
		if (
			!nombreInstitucion ||
			!tipoInstitucion ||
			!estado ||
			!nivelCuenta ||
			!nombreResponsable ||
			!cargo ||
			!cedula ||
			!email ||
			!telefono ||
			!cartaFormalUrl
		) {
			return res
				.status(400)
				.json({ error: 'Todos los campos requeridos deben estar presentes' });
		}

		// Validar nivelCuenta
		if (!['estadal', 'municipal'].includes(nivelCuenta)) {
			return res.status(400).json({ error: 'nivelCuenta debe ser "estadal" o "municipal"' });
		}

		// Si es municipal, validar que municipio esté presente
		if (nivelCuenta === 'municipal' && !municipio) {
			return res
				.status(400)
				.json({ error: 'El campo municipio es requerido para cuentas municipales' });
		}

		let codigo;
		let codigoEstadal = null;

		if (nivelCuenta === 'estadal') {
			// Código estadal: solo el estado
			codigo = estado.toUpperCase().replace(/\s+/g, '-');

			// Validar que no exista ya una cuenta estadal para este estado E INSTITUCIÓN
			const estadalExistente = await prisma.registrationRequest.findFirst({
				where: {
					nivelCuenta: 'estadal',
					estado: estado,
					tipoInstitucion: tipoInstitucion, // Validar por tipo de institución también
					estadoSolicitud: { in: ['pending', 'approved'] }
				}
			});

			if (estadalExistente) {
				return res.status(400).json({
					error: `Ya existe una cuenta estadal para ${estado} en ${tipoInstitucion}. Solo puede haber una cuenta estadal por estado e institución.`
				});
			}

			// Verificar también en usuarios aprobados
			const usuarioEstadalExistente = await prisma.user.findFirst({
				where: {
					nivelCuenta: 'estadal',
					ubicacion: estado,
					tipoInstitucion: tipoInstitucion
				}
			});

			if (usuarioEstadalExistente) {
				return res.status(400).json({
					error: `Ya existe una cuenta estadal aprobada para ${estado} en ${tipoInstitucion}.`
				});
			}
		} else if (nivelCuenta === 'municipal') {
			// Código municipal: ESTADO-MUNICIPIO
			codigo = `${estado.toUpperCase().replace(/\s+/g, '-')}-${municipio.toUpperCase().replace(/\s+/g, '-')}`;
			codigoEstadal = estado.toUpperCase().replace(/\s+/g, '-');

			// MODIFICADO: Ya no bloqueamos si no existe la cuenta estadal.
			// Se permitirá el registro y se vinculará posteriormente si aparece la estadal.
		}

		// Verificar si la cédula o email ya existen en solicitudes pendientes
		const solicitudExistente = await prisma.registrationRequest.findFirst({
			where: {
				OR: [{ cedula }, { email }],
				estadoSolicitud: 'pending'
			}
		});

		if (solicitudExistente) {
			return res.status(400).json({
				error: 'Ya existe una solicitud pendiente con esta cédula o email'
			});
		}

		// Verificar si ya existe un usuario con esa cédula o email
		const usuarioExistente = await prisma.user.findFirst({
			where: {
				OR: [{ cedula }, { email }]
			}
		});

		if (usuarioExistente) {
			return res.status(400).json({
				error: 'Ya existe un usuario registrado con esta cédula o email'
			});
		}

		// Crear la solicitud
		const solicitud = await prisma.registrationRequest.create({
			data: {
				nombreInstitucion,
				tipoInstitucion,
				estado,
				municipio: nivelCuenta === 'municipal' ? municipio : null,
				codigo,
				nivelCuenta,
				codigoEstadal,
				nombreResponsable,
				cargo,
				cedula,
				email,
				telefono,
				cartaFormalUrl,
				estadoSolicitud: 'pending'
			}
		});

		// Enviar email al superadmin
		try {
			await enviarEmailSuperadmin(solicitud);
		} catch (emailError) {
			console.error('Error enviando email, pero solicitud creada:', emailError);
			// No fallar la creación si el email falla
		}

		return res.status(201).json({
			message: 'Solicitud enviada exitosamente. Recibirá una respuesta por email.',
			solicitudId: solicitud.id
		});
	} catch (error) {
		console.error('Error al crear solicitud (catch):', error);
		return res.status(500).json({ error: 'Error al procesar la solicitud' });
	}
};

/**
 * Obtener todas las solicitudes (solo superadmin)
 */
export const obtenerSolicitudes = async (req, res) => {
	try {
		const user = req.user;

		if (user.rol !== 'superadmin') {
			return res.status(403).json({ error: 'No autorizado' });
		}

		const solicitudes = await prisma.registrationRequest.findMany({
			orderBy: { createdAt: 'desc' },
			include: {
				usuarioCreado: {
					select: {
						id: true,
						nombre: true,
						apellido: true,
						email: true
					}
				}
			}
		});

		return res.status(200).json(solicitudes);
	} catch (error) {
		console.error('Error al obtener solicitudes:', error);
		return res.status(500).json({ error: 'Error al obtener solicitudes' });
	}
};

/**
 * Aprobar una solicitud y crear usuario admin (solo superadmin)
 */
export const aprobarSolicitud = async (req, res) => {
	try {
		const { id } = req.params;
		const user = req.user;

		if (user.rol !== 'superadmin') {
			return res.status(403).json({ error: 'No autorizado' });
		}

		const solicitud = await prisma.registrationRequest.findUnique({
			where: { id }
		});

		if (!solicitud) {
			return res.status(404).json({ error: 'Solicitud no encontrada' });
		}

		if (solicitud.estadoSolicitud !== 'pending') {
			return res.status(400).json({ error: 'Esta solicitud ya fue procesada' });
		}

		// Generar contraseña temporal
		const contrasenaTemp = generateRandomPassword();
		const hashedPassword = await bcrypt.hash(contrasenaTemp, 10);

		// Dividir el nombre completo en nombre y apellido
		const nombreParts = solicitud.nombreResponsable.trim().split(' ');
		const nombre = nombreParts[0];
		const apellido = nombreParts.slice(1).join(' ') || nombre;

		// Buscar cuenta estadal si es municipal
		let cuentaEstadalId = null;
		if (solicitud.nivelCuenta === 'municipal' && solicitud.codigoEstadal) {
			// BUSCAR CUENTA ESTADAL QUE COINCIDA EN ESTADO Y TIPO DE INSTITUCIÓN
			const cuentaEstadal = await prisma.user.findFirst({
				where: {
					nivelCuenta: 'estadal',
					ubicacion: solicitud.estado, // Usamos ubicacion como estado para estadales
					tipoInstitucion: solicitud.tipoInstitucion
				}
			});
			if (cuentaEstadal) {
				cuentaEstadalId = cuentaEstadal.id;
			}
		}

		// Determinar rol según nivel
		// Estadal -> admin, Municipal -> coordinador
		const rol = solicitud.nivelCuenta === 'estadal' ? 'admin' : 'coordinador';

		// Crear usuario admin
		const nuevoAdmin = await prisma.user.create({
			data: {
				nombre,
				apellido,
				email: solicitud.email,
				contrasena: hashedPassword,
				cedula: solicitud.cedula,
				telefono: solicitud.telefono,
				cargo: solicitud.cargo,
				ubicacion: solicitud.estado, // Para estadal es el estado, para municipal tambien guardamos el estado aqui? Ojo con esto.
				// En el modelo original, 'ubicacion' parece ser genérico. Para municipal, quiza sea mejor guardar Municipio?
				// Pero RegistrationForm manda 'estado' a 'ubicacion'. Mantengamos la coherencia.
				codigo: solicitud.codigo,
				rol: rol,
				nivelCuenta: solicitud.nivelCuenta,
				codigoEstadal: solicitud.codigoEstadal,
				cuentaEstadalId: cuentaEstadalId,
				tipoInstitucion: solicitud.tipoInstitucion // GUARDAR TIPO DE INSTITUCIÓN
			}
		});

		// SI SE CREÓ UNA CUENTA ESTADAL:
		// Buscar cuentas municipales huérfanas (sin padre) de este estado e institución y enlazarlas
		if (solicitud.nivelCuenta === 'estadal') {
			const municipalesHuerfanas = await prisma.user.updateMany({
				where: {
					nivelCuenta: 'municipal',
					ubicacion: solicitud.estado, // Asumiendo que municipales guardan el estado en 'ubicacion' o tienen forma de filtrar
					// OJO: Si 'ubicacion' en municipal es el Estado, funciona. Si es 'Municipio', falla.
					// Revisando crearSolicitud: `estado` se guarda en `solicitud.estado`.
					// Revisemos cómo se guarda en User. En el original: `ubicacion: solicitud.estado`.
					// Parece que todos guardan el ESTADO en `ubicacion`.
					tipoInstitucion: solicitud.tipoInstitucion,
					cuentaEstadalId: null
				},
				data: {
					cuentaEstadalId: nuevoAdmin.id
				}
			});
			console.log(
				`Enlazadas ${municipalesHuerfanas.count} cuentas municipales a la nueva cuenta estadal de ${solicitud.estado} (${solicitud.tipoInstitucion})`
			);
		}

		// Actualizar solicitud
		await prisma.registrationRequest.update({
			where: { id },
			data: {
				estadoSolicitud: 'approved',
				reviewedAt: new Date(),
				reviewedBy: user.id,
				usuarioCreadoId: nuevoAdmin.id
			}
		});

		// Enviar email al solicitante con credenciales
		try {
			await enviarEmailAprobacion(
				solicitud.email,
				{
					usuario: solicitud.email,
					contrasena: contrasenaTemp
				},
				solicitud.nombreInstitucion
			);
		} catch (emailError) {
			console.error('Error enviando email de aprobación:', emailError);
		}

		return res.status(200).json({
			message: 'Solicitud aprobada y usuario creado exitosamente',
			usuario: {
				id: nuevoAdmin.id,
				email: nuevoAdmin.email,
				rol: nuevoAdmin.rol,
				codigo: nuevoAdmin.codigo,
				nivelCuenta: nuevoAdmin.nivelCuenta
			}
		});
	} catch (error) {
		console.error('Error al aprobar solicitud:', error);
		return res.status(500).json({ error: 'Error al aprobar solicitud' });
	}
};

/**
 * Rechazar una solicitud (solo superadmin)
 */
export const rechazarSolicitud = async (req, res) => {
	try {
		const { id } = req.params;
		const { motivo } = req.body;
		const user = req.user;

		if (user.rol !== 'superadmin') {
			return res.status(403).json({ error: 'No autorizado' });
		}

		if (!motivo || motivo.trim().length < 10) {
			return res
				.status(400)
				.json({ error: 'Debe proporcionar un motivo de rechazo (mínimo 10 caracteres)' });
		}

		const solicitud = await prisma.registrationRequest.findUnique({
			where: { id }
		});

		if (!solicitud) {
			return res.status(404).json({ error: 'Solicitud no encontrada' });
		}

		if (solicitud.estadoSolicitud !== 'pending') {
			return res.status(400).json({ error: 'Esta solicitud ya fue procesada' });
		}

		// Actualizar solicitud
		await prisma.registrationRequest.update({
			where: { id },
			data: {
				estadoSolicitud: 'rejected',
				motivoRechazo: motivo,
				reviewedAt: new Date(),
				reviewedBy: user.id
			}
		});

		// Enviar email al solicitante
		try {
			await enviarEmailRechazo(solicitud.email, solicitud.nombreInstitucion, motivo);
		} catch (emailError) {
			console.error('Error enviando email de rechazo:', emailError);
		}

		return res.status(200).json({ message: 'Solicitud rechazada exitosamente' });
	} catch (error) {
		console.error('Error al rechazar solicitud:', error);
		return res.status(500).json({ error: 'Error al rechazar solicitud' });
	}
};

/**
 * Subir carta formal (PDF o Imagen)
 */
export const uploadCarta = async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ error: 'No se ha subido ningún archivo' });
		}

		const file = req.file;
		const timestamp = Date.now();
		const cleanName = file.originalname.replace(/\s+/g, '_');
		// Guardar en carpeta 'cartas'
		const fileName = `cartas/${timestamp}-${cleanName}`;
		let buffer = file.buffer;
		let contentType = file.mimetype;

		// Si es imagen, optimizar con sharp
		if (file.mimetype.startsWith('image/')) {
			buffer = await sharp(file.buffer)
				.resize({ width: 1200, withoutEnlargement: true })
				.webp({ quality: 80 })
				.toBuffer();
			contentType = 'image/webp';
			// Ajustar extensión si se desea, pero por ahora mantenemos el nombre base
		}

		const params = {
			Bucket: BUCKET_NAME,
			Key: fileName,
			Body: buffer,
			ContentType: contentType
		};

		await s3Client.send(new PutObjectCommand(params));

		const fileUrl = `${process.env.MINIO_ENDPOINT.replace(/\/$/, '')}/${BUCKET_NAME}/${fileName}`;

		return res.status(200).json({ url: fileUrl });
	} catch (error) {
		console.error('Error al subir carta:', error);
		return res.status(500).json({ error: 'Error al subir el archivo' });
	}
};

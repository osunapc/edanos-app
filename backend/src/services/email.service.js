import nodemailer from 'nodemailer';

// Configurar transporter de Gmail
const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.EMAIL_USER, // Tu email de Gmail
		pass: process.env.EMAIL_PASSWORD // App Password de Gmail
	}
});

/**
 * Envía email al superadmin cuando hay una nueva solicitud de registro
 */
export const enviarEmailSuperadmin = async (solicitud) => {
	try {
		const mailOptions = {
			from: process.env.EMAIL_USER,
			to: process.env.SUPERADMIN_EMAIL, // Email del superadmin
			subject: `🔔 Nueva Solicitud de Registro - ${solicitud.nombreInstitucion}`,
			html: `
				<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1e293b; color: #ffffff; padding: 20px; border-radius: 10px;">
					<div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
						<h1 style="margin: 0; color: white; font-size: 24px;">🚨 Nueva Solicitud de Acceso EDANOS</h1>
					</div>
					
					<div style="padding: 30px; background-color: #0f172a; border-radius: 0 0 10px 10px;">
						<h2 style="color: #f97316; border-bottom: 2px solid #f97316; padding-bottom: 10px;">📋 Información de la Institución</h2>
						<table style="width: 100%; margin: 20px 0;">
							<tr>
								<td style="padding: 8px 0; color: #94a3b8; font-weight: bold;">Institución:</td>
								<td style="padding: 8px 0; color: #ffffff;">${solicitud.nombreInstitucion}</td>
							</tr>
							<tr>
								<td style="padding: 8px 0; color: #94a3b8; font-weight: bold;">Tipo:</td>
								<td style="padding: 8px 0; color: #f97316; font-weight: bold;">${solicitud.tipoInstitucion}</td>
							</tr>
							<tr>
								<td style="padding: 8px 0; color: #94a3b8; font-weight: bold;">Ubicación:</td>
								<td style="padding: 8px 0; color: #ffffff;">${solicitud.estado}, ${solicitud.municipio}</td>
							</tr>
							<tr>
								<td style="padding: 8px 0; color: #94a3b8; font-weight: bold;">Código:</td>
								<td style="padding: 8px 0; color: #10b981; font-family: monospace;">${solicitud.codigo}</td>
							</tr>
						</table>

						<h2 style="color: #f97316; border-bottom: 2px solid #f97316; padding-bottom: 10px; margin-top: 30px;">👤 Datos del Responsable</h2>
						<table style="width: 100%; margin: 20px 0;">
							<tr>
								<td style="padding: 8px 0; color: #94a3b8; font-weight: bold;">Nombre:</td>
								<td style="padding: 8px 0; color: #ffffff;">${solicitud.nombreResponsable}</td>
							</tr>
							<tr>
								<td style="padding: 8px 0; color: #94a3b8; font-weight: bold;">Cargo:</td>
								<td style="padding: 8px 0; color: #ffffff;">${solicitud.cargo}</td>
							</tr>
							<tr>
								<td style="padding: 8px 0; color: #94a3b8; font-weight: bold;">Cédula:</td>
								<td style="padding: 8px 0; color: #ffffff;">${solicitud.cedula}</td>
							</tr>
							<tr>
								<td style="padding: 8px 0; color: #94a3b8; font-weight: bold;">Email:</td>
								<td style="padding: 8px 0; color: #3b82f6;">${solicitud.email}</td>
							</tr>
							<tr>
								<td style="padding: 8px 0; color: #94a3b8; font-weight: bold;">Teléfono:</td>
								<td style="padding: 8px 0; color: #ffffff;">${solicitud.telefono}</td>
							</tr>
						</table>

						<div style="background-color: #1e293b; padding: 20px; border-radius: 10px; margin: 30px 0; border-left: 4px solid #f97316;">
							<h3 style="margin: 0 0 10px 0; color: #f97316;">📄 Carta Formal Adjunta</h3>
							<p style="margin: 0; color: #cbd5e1;">La carta formal de solicitud está adjunta a este correo.</p>
							<a href="${solicitud.cartaFormalUrl}" style="display: inline-block; margin-top: 15px; padding: 10px 20px; background-color: #f97316; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">📥 Descargar PDF</a>
						</div>

						<div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 20px; border-radius: 10px; text-align: center; margin-top: 30px;">
							<p style="margin: 0 0 15px 0; color: white; font-size: 16px;">Revisa esta solicitud en el panel de administración</p>
							<a href="${process.env.FRONTEND_URL}/solicitudes" style="display: inline-block; padding: 12px 30px; background-color: white; color: #f97316; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
								🔍 Ver Solicitud en Panel
							</a>
						</div>

						<div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #334155; text-align: center; color: #64748b; font-size: 12px;">
							<p>Este es un correo automático de EDANOS - Sistema de Gestión de Emergencias</p>
							<p>© 2025 EDANOS Venezuela</p>
						</div>
					</div>
				</div>
			`,
			attachments: [
				{
					filename: `carta-formal-${solicitud.nombreInstitucion.replace(/\s+/g, '-')}.pdf`,
					path: solicitud.cartaFormalUrl
				}
			]
		};

		const info = await transporter.sendMail(mailOptions);
		console.log('✅ Email enviado al superadmin:', info.messageId);
		return info;
	} catch (error) {
		console.error('❌ Error enviando email al superadmin:', error);
		throw error;
	}
};

/**
 * Envía email al solicitante cuando su solicitud es aprobada
 */
export const enviarEmailAprobacion = async (email, credenciales, nombreInstitucion) => {
	try {
		const mailOptions = {
			from: process.env.EMAIL_USER,
			to: email,
			subject: '✅ Solicitud Aprobada - Acceso a EDANOS',
			html: `
				<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1e293b; color: #ffffff; padding: 20px; border-radius: 10px;">
					<div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
						<h1 style="margin: 0; color: white; font-size: 32px;">✅ ¡Solicitud Aprobada!</h1>
					</div>
					
					<div style="padding: 30px; background-color: #0f172a; border-radius: 0 0 10px 10px;">
						<p style="font-size: 18px; color: #cbd5e1; line-height: 1.6;">
							¡Felicitaciones! Su solicitud de acceso a EDANOS para <strong style="color: #f97316;">${nombreInstitucion}</strong> ha sido aprobada.
						</p>

						<div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 25px; border-radius: 10px; margin: 30px 0; border: 2px solid #f97316;">
							<h2 style="margin: 0 0 20px 0; color: #f97316; text-align: center;">🔑 Credenciales de Acceso</h2>
							<table style="width: 100%;">
								<tr>
									<td style="padding: 12px 0; color: #94a3b8; font-weight: bold;">Usuario:</td>
									<td style="padding: 12px 0; color: #10b981; font-family: monospace; font-size: 16px;">${credenciales.usuario}</td>
								</tr>
								<tr>
									<td style="padding: 12px 0; color: #94a3b8; font-weight: bold;">Contraseña Temporal:</td>
									<td style="padding: 12px 0; color: #f97316; font-family: monospace; font-size: 18px; font-weight: bold;">${credenciales.contrasena}</td>
								</tr>
							</table>
							
							<div style="background-color: #dc2626; padding: 15px; border-radius: 8px; margin-top: 20px;">
								<p style="margin: 0; color: white; font-size: 14px; text-align: center;">
									⚠️ <strong>IMPORTANTE:</strong> Cambie su contraseña al iniciar sesión por primera vez
								</p>
							</div>
						</div>

						<div style="text-align: center; margin: 30px 0;">
							<a href="${process.env.FRONTEND_URL}/login" style="display: inline-block; padding: 15px 40px; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px;">
								🚀 Acceder a EDANOS
							</a>
						</div>

						<div style="background-color: #1e293b; padding: 20px; border-radius: 10px; border-left: 4px solid #10b981;">
							<h3 style="margin: 0 0 10px 0; color: #10b981;">📱 Descarga la App Móvil</h3>
							<p style="margin: 0; color: #cbd5e1; line-height: 1.6;">
								Como administrador, también puede descargar la aplicación móvil EDANOS para realizar evaluaciones en campo.
							</p>
							<a href="https://drive.google.com/uc?export=download&id=1FJQl-vZbWw0_ftpd6Je4q80Lo9SpDIBv" download>
  Descargar App para evaluadores
</a>
						</div>

						<div style="margin-top: 30px; padding: 20px; background-color: #1e293b; border-radius: 10px;">
							<h3 style="color: #f97316; margin-top: 0;">¿Necesita ayuda?</h3>
							<p style="color: #cbd5e1; line-height: 1.6;">
								Si tiene alguna pregunta o necesita asistencia, no dude en contactarnos.
							</p>
							<p style="color: #64748b; font-size: 14px; margin-bottom: 0;">
								📧 Soporte: ${process.env.EMAIL_USER}<br>
								📱 WhatsApp: <a href="https://walink.co/50d363" style="color: #10b981;">+58 424...</a>
							</p>
						</div>

						<div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #334155; text-align: center; color: #64748b; font-size: 12px;">
							<p>Bienvenido a EDANOS - Sistema de Gestión de Emergencias</p>
							<p>© 2025 EDANOS Venezuela</p>
						</div>
					</div>
				</div>
			`
		};

		const info = await transporter.sendMail(mailOptions);
		console.log('✅ Email de aprobación enviado:', info.messageId);
		return info;
	} catch (error) {
		console.error('❌ Error enviando email de aprobación:', error);
		throw error;
	}
};

/**
 * Envía email al solicitante cuando su solicitud es rechazada
 */
export const enviarEmailRechazo = async (email, nombreInstitucion, motivo) => {
	try {
		const mailOptions = {
			from: process.env.EMAIL_USER,
			to: email,
			subject: '❌ Solicitud Rechazada - EDANOS',
			html: `
				<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1e293b; color: #ffffff; padding: 20px; border-radius: 10px;">
					<div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
						<h1 style="margin: 0; color: white; font-size: 28px;">Solicitud No Aprobada</h1>
					</div>
					
					<div style="padding: 30px; background-color: #0f172a; border-radius: 0 0 10px 10px;">
						<p style="font-size: 16px; color: #cbd5e1; line-height: 1.6;">
							Lamentamos informarle que su solicitud de acceso a EDANOS para <strong style="color: #f97316;">${nombreInstitucion}</strong> no ha sido aprobada en este momento.
						</p>

						<div style="background-color: #1e293b; padding: 20px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #dc2626;">
							<h3 style="margin: 0 0 10px 0; color: #dc2626;">Motivo:</h3>
							<p style="margin: 0; color: #ffffff;">${motivo}</p>
						</div>

						<p style="color: #cbd5e1; line-height: 1.6;">
							Si desea más información o corregir su solicitud, puede contactarnos directamente.
						</p>

						<div style="margin-top: 30px; padding: 20px; background-color: #1e293b; border-radius: 10px;">
							<h3 style="color: #f97316; margin-top: 0;">Contacto</h3>
							<p style="color: #cbd5e1;">
								📧 Email: ${process.env.EMAIL_USER}<br>
								📱 WhatsApp: <a href="https://walink.co/50d363" style="color: #10b981;">Soporte EDANOS</a>
							</p>
						</div>

						<div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #334155; text-align: center; color: #64748b; font-size: 12px;">
							<p>EDANOS - Sistema de Gestión de Emergencias</p>
							<p>© 2025 EDANOS Venezuela</p>
						</div>
					</div>
				</div>
			`
		};

		const info = await transporter.sendMail(mailOptions);
		console.log('✅ Email de rechazo enviado:', info.messageId);
		return info;
	} catch (error) {
		console.error('❌ Error enviando email de rechazo:', error);
		throw error;
	}
};

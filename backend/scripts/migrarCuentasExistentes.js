import prisma from '../src/libs/prisma.js';

async function migrarCuentasExistentes() {
	console.log('🔄 Iniciando migración de cuentas existentes...\n');

	try {
		// 1. Obtener todos los usuarios existentes
		const usuarios = await prisma.user.findMany();
		console.log(`📊 Encontrados ${usuarios.length} usuarios\n`);

		// 2. Marcar todos como municipales por defecto y extraer codigoEstadal
		for (const usuario of usuarios) {
			if (usuario.codigo) {
				const partes = usuario.codigo.split('-');
				// Si tiene guion, asumimos ESTADO-MUNICIPIO. Si no, podría ser ya estadal o un formato antiguo.
				// Asumiremos que todo lo existente es municipal para seguridad, salvo que el código sea simple.

				let codigoEstadal = null;
				let nivelCuenta = 'municipal';

				if (partes.length > 1) {
					codigoEstadal = partes[0];
				} else {
					// Si no tiene guion, podría ser estadal, pero por ahora lo marcamos como municipal sin padre claro
					// O mejor, si no tiene guion, asumimos que es el estado mismo si coincide con un estado conocido?
					// Por seguridad, extraeremos la primera parte como codigoEstadal si es posible.
					codigoEstadal = usuario.codigo;
				}

				await prisma.user.update({
					where: { id: usuario.id },
					data: {
						nivelCuenta: nivelCuenta,
						codigoEstadal: codigoEstadal
					}
				});

				console.log(
					`✅ Usuario ${usuario.email}: nivelCuenta=${nivelCuenta}, codigoEstadal=${codigoEstadal}`
				);
			}
		}

		// 3. Actualizar solicitudes existentes
		const solicitudes = await prisma.registrationRequest.findMany();
		console.log(`\n📊 Encontradas ${solicitudes.length} solicitudes\n`);

		for (const solicitud of solicitudes) {
			if (solicitud.codigo) {
				const partes = solicitud.codigo.split('-');
				let codigoEstadal = null;

				if (partes.length > 1) {
					codigoEstadal = partes[0];
				} else {
					codigoEstadal = solicitud.codigo;
				}

				await prisma.registrationRequest.update({
					where: { id: solicitud.id },
					data: {
						nivelCuenta: 'municipal',
						codigoEstadal: codigoEstadal
					}
				});

				console.log(
					`✅ Solicitud ${solicitud.id}: nivelCuenta=municipal, codigoEstadal=${codigoEstadal}`
				);
			}
		}

		console.log('\n✅ Migración completada exitosamente');
	} catch (error) {
		console.error('❌ Error en la migración:', error);
		throw error;
	}
}

migrarCuentasExistentes()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});

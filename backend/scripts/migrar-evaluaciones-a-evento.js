import prisma from '../src/libs/prisma.js';

async function migrarEvaluacionesAEventoHistorico() {
	try {
		console.log('🚀 Iniciando migración de evaluaciones...');

		// 1. Verificar si ya existe un evento "Histórico"
		let eventoHistorico = await prisma.evento.findFirst({
			where: { nombre: 'Evaluaciones Históricas' }
		});

		// 2. Si no existe, crear el evento histórico
		if (!eventoHistorico) {
			console.log('📦 Creando evento histórico...');

			// Obtener el primer superadmin para asignar como creador
			const superadmin = await prisma.user.findFirst({
				where: { rol: 'superadmin' }
			});

			if (!superadmin) {
				throw new Error('No se encontró un superadmin en el sistema');
			}

			eventoHistorico = await prisma.evento.create({
				data: {
					nombre: 'Evaluaciones Históricas',
					descripcion:
						'Evento creado automáticamente para agrupar evaluaciones existentes antes de la implementación del sistema de eventos',
					tipoEvento: 'Histórico',
					estado: 'TODOS',
					municipios: [],
					estadoEvento: 'cerrado',
					creadoPor: superadmin.id,
					fechaInicio: new Date('2024-01-01'), // Fecha simbólica
					fechaCierre: new Date()
				}
			});

			console.log('✅ Evento histórico creado:', eventoHistorico.id);
		} else {
			console.log('ℹ️ Evento histórico ya existe:', eventoHistorico.id);
		}

		// 3. Contar evaluaciones sin evento
		const evaluacionesSinEvento = await prisma.evaluation.count({
			where: { eventoId: null }
		});

		console.log(`📊 Evaluaciones sin evento: ${evaluacionesSinEvento}`);

		if (evaluacionesSinEvento === 0) {
			console.log('✅ No hay evaluaciones para migrar');
			return;
		}

		// 4. Actualizar todas las evaluaciones sin evento
		const resultado = await prisma.evaluation.updateMany({
			where: { eventoId: null },
			data: { eventoId: eventoHistorico.id }
		});

		console.log(
			`✅ Migración completada: ${resultado.count} evaluaciones asignadas al evento histórico`
		);

		// 5. Verificar
		const verificacion = await prisma.evaluation.count({
			where: { eventoId: null }
		});

		if (verificacion === 0) {
			console.log('✅ Verificación exitosa: Todas las evaluaciones tienen evento asignado');
		} else {
			console.warn(`⚠️ Advertencia: Aún quedan ${verificacion} evaluaciones sin evento`);
		}
	} catch (error) {
		console.error('❌ Error en la migración:', error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
}

// Ejecutar migración
migrarEvaluacionesAEventoHistorico()
	.then(() => {
		console.log('🎉 Proceso de migración finalizado');
		process.exit(0);
	})
	.catch((error) => {
		console.error('💥 Error fatal:', error);
		process.exit(1);
	});

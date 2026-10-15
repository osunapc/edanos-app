import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearEvaluations() {
	try {
		console.log('🗑️  Eliminando evaluaciones de prueba...');

		// Eliminar todos los registros de GrupoFamiliar primero (por FK)
		const deletedGrupos = await prisma.grupoFamiliar.deleteMany({});
		console.log(`✅ Eliminados ${deletedGrupos.count} registros de GrupoFamiliar`);

		// Eliminar todas las evaluaciones
		const deletedEvaluations = await prisma.evaluation.deleteMany({});
		console.log(`✅ Eliminadas ${deletedEvaluations.count} evaluaciones`);

		console.log('✨ Base de datos limpiada exitosamente');
	} catch (error) {
		console.error('❌ Error al limpiar la base de datos:', error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
}

clearEvaluations();

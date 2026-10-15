import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function main() {
  console.log('=== ESTADÍSTICAS EDANOS PARA ARTÍCULO CLIC ===\n');

  // 1. Total de usuarios
  const totalUsuarios = await prisma.user.count();
  console.log(`📊 Total de Usuarios: ${totalUsuarios}`);

  // 2. Usuarios por rol
  const usuariosPorRol = await prisma.user.groupBy({
    by: ['rol'],
    _count: true
  });
  console.log('\n👥 Usuarios por Rol:');
  usuariosPorRol.forEach(r => console.log(`   - ${r.rol}: ${r._count}`));

  // 3. Usuarios por tipo de institución
  const usuariosPorInstitucion = await prisma.user.groupBy({
    by: ['tipoInstitucion'],
    _count: true,
    where: {
      tipoInstitucion: { not: null }
    }
  });
  console.log('\n🏢 Usuarios por Institución:');
  usuariosPorInstitucion.forEach(r => console.log(`   - ${r.tipoInstitucion}: ${r._count}`));

  // 4. Total de evaluaciones
  const totalEvaluaciones = await prisma.evaluation.count();
  console.log(`\n📝 Total de Evaluaciones: ${totalEvaluaciones}`);

  // 5. Evaluaciones por evento
  const evaluacionesPorEvento = await prisma.evaluation.groupBy({
    by: ['eventoId'],
    _count: true
  });
  console.log('\n📋 Evaluaciones por Evento:');
  evaluacionesPorEvento.forEach(r => console.log(`   - Evento ${r.eventoId || 'Sin evento'}: ${r._count}`));

  // 6. Total de eventos
  const totalEventos = await prisma.evento.count();
  console.log(`\n🎯 Total de Eventos: ${totalEventos}`);

  // 7. Eventos por estado
  const eventosPorEstado = await prisma.evento.groupBy({
    by: ['estadoEvento'],
    _count: true
  });
  console.log('\n📈 Eventos por Estado:');
  eventosPorEstado.forEach(r => console.log(`   - ${r.estadoEvento}: ${r._count}`));

  // 8. Eventos por ubicación (estado)
  const eventosPorUbicacion = await prisma.evento.groupBy({
    by: ['estado'],
    _count: true
  });
  console.log('\n🗺️ Eventos por Estado (Ubicación):');
  eventosPorUbicacion.forEach(r => console.log(`   - ${r.estado}: ${r._count}`));

  // 9. Evaluaciones recientes (últimos 30 días)
  const hace30Dias = new Date();
  hace30Dias.setDate(hace30Dias.getDate() - 30);
  const evaluacionesRecientes = await prisma.evaluation.count({
    where: {
      createdAt: { gte: hace30Dias }
    }
  });
  console.log(`\n⏰ Evaluaciones (Últimos 30 días): ${evaluacionesRecientes}`);

  // 10. Evaluaciones por estado (ubicación)
  const evaluacionesPorEstado = await prisma.evaluation.groupBy({
    by: ['estado'],
    _count: true,
    where: {
      estado: { not: null }
    },
    orderBy: { _count: { estado: 'desc' } },
    take: 10
  });
  console.log('\n📍 Top 10 Estados con más Evaluaciones:');
  evaluacionesPorEstado.forEach(r => console.log(`   - ${r.estado}: ${r._count}`));

  // 11. Usuarios por nivel de cuenta
  const usuariosPorNivel = await prisma.user.groupBy({
    by: ['nivelCuenta'],
    _count: true
  });
  console.log('\n🔐 Usuarios por Nivel de Cuenta:');
  usuariosPorNivel.forEach(r => console.log(`   - ${r.nivelCuenta}: ${r._count}`));

  // 12. Solicitudes de registro
  const totalSolicitudes = await prisma.registrationRequest.count();
  const solicitudesPendientes = await prisma.registrationRequest.count({
    where: { estadoSolicitud: 'pending' }
  });
  const solicitudesAprobadas = await prisma.registrationRequest.count({
    where: { estadoSolicitud: 'approved' }
  });
  console.log(`\n📝 Solicitudes de Registro:`);
  console.log(`   - Total: ${totalSolicitudes}`);
  console.log(`   - Pendientes: ${solicitudesPendientes}`);
  console.log(`   - Aprobadas: ${solicitudesAprobadas}`);

  // 13. SATOS reports
  const totalSATOS = await prisma.satosReport.count();
  const satosEmergencia = await prisma.satosReport.count({
    where: { emergency: true }
  });
  console.log(`\n🚨 Reportes SATOS:`);
  console.log(`   - Total: ${totalSATOS}`);
  console.log(`   - Emergencias: ${satosEmergencia}`);

  // 14. Promedio de evaluaciones por usuario
  const promedioEvaluaciones = totalUsuarios > 0 ? (totalEvaluaciones / totalUsuarios).toFixed(2) : 0;
  console.log(`\n📊 Promedio de Evaluaciones por Usuario: ${promedioEvaluaciones}`);

  // 15. Primera y última evaluación
  const primeraEvaluacion = await prisma.evaluation.findFirst({
    orderBy: { createdAt: 'asc' },
    select: { createdAt: true }
  });
  const ultimaEvaluacion = await prisma.evaluation.findFirst({
    orderBy: { createdAt: 'desc' },
    select: { createdAt: true }
  });
  console.log(`\n📅 Período de Uso:`);
  console.log(`   - Primera evaluación: ${primeraEvaluacion?.createdAt?.toLocaleDateString() || 'N/A'}`);
  console.log(`   - Última evaluación: ${ultimaEvaluacion?.createdAt?.toLocaleDateString() || 'N/A'}`);

  console.log('\n=== FIN DEL REPORTE ===');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

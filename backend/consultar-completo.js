import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function main() {
  console.log('=== ESTADÍSTICAS COMPLETAS EDANOS ===\n');

  // 1. Todos los usuarios con su ubicación
  const usuarios = await prisma.user.findMany({
    select: {
      id: true,
      nombre: true,
      apellido: true,
      rol: true,
      ubicacion: true,
      tipoInstitucion: true,
      nivelCuenta: true,
      email: true,
      createdAt: true
    },
    orderBy: { createdAt: 'asc' }
  });
  
  console.log(`📊 Total de Usuarios: ${usuarios.length}\n`);
  
  console.log('👥 LISTA COMPLETA DE USUARIOS:');
  console.log('─'.repeat(80));
  usuarios.forEach((u, i) => {
    console.log(`${i+1}. ${u.nombre} ${u.apellido}`);
    console.log(`   Email: ${u.email}`);
    console.log(`   Rol: ${u.rol} | Nivel: ${u.nivelCuenta}`);
    console.log(`   Ubicación: ${u.ubicacion || 'No especificada'}`);
    console.log(`   Institución: ${u.tipoInstitucion || 'No especificada'}`);
    console.log(`   Registro: ${u.createdAt.toLocaleDateString()}`);
    console.log('');
  });

  // 2. Usuarios por ubicación
  const usuariosPorUbicacion = await prisma.user.groupBy({
    by: ['ubicacion'],
    _count: true,
    where: {
      ubicacion: { not: null }
    },
    orderBy: { _count: { ubicacion: 'desc' } }
  });
  
  console.log('\n📍 USUARIOS POR UBICACIÓN:');
  console.log('─'.repeat(40));
  usuariosPorUbicacion.forEach(r => {
    console.log(`   ${r.ubicacion}: ${r._count} usuarios`);
  });

  // 3. Evaluaciones con detalles
  const evaluaciones = await prisma.evaluation.findMany({
    select: {
      id: true,
      estado: true,
      municipio: true,
      tipoInstitucion: true,
      createdAt: true,
      user: {
        select: {
          nombre: true,
          apellido: true,
          ubicacion: true
        }
      }
    },
    orderBy: { createdAt: 'asc' }
  });
  
  console.log(`\n📝 Total de Evaluaciones: ${evaluaciones.length}\n`);
  
  console.log('📋 LISTA DE EVALUACIONES:');
  console.log('─'.repeat(80));
  evaluaciones.forEach((e, i) => {
    console.log(`${i+1}. Evaluación #${e.id}`);
    console.log(`   Evaluador: ${e.user.nombre} ${e.user.apellido}`);
    console.log(`   Ubicación evaluador: ${e.user.ubicacion || 'No especificada'}`);
    console.log(`   Estado evaluación: ${e.estado || 'No especificado'}`);
    console.log(`   Municipio: ${e.municipio || 'No especificado'}`);
    console.log(`   Institución: ${e.tipoInstitucion || 'No especificada'}`);
    console.log(`   Fecha: ${e.createdAt.toLocaleDateString()}`);
    console.log('');
  });

  // 4. Evaluaciones por estado
  const evaluacionesPorEstado = await prisma.evaluation.groupBy({
    by: ['estado'],
    _count: true,
    where: {
      estado: { not: null }
    },
    orderBy: { _count: { estado: 'desc' } }
  });
  
  console.log('\n🗺️ EVALUACIONES POR ESTADO:');
  console.log('─'.repeat(40));
  evaluacionesPorEstado.forEach(r => {
    console.log(`   ${r.estado}: ${r._count} evaluaciones`);
  });

  // 5. Evaluaciones por institución
  const evaluacionesPorInstitucion = await prisma.evaluation.groupBy({
    by: ['tipoInstitucion'],
    _count: true,
    where: {
      tipoInstitucion: { not: null }
    },
    orderBy: { _count: { tipoInstitucion: 'desc' } }
  });
  
  console.log('\n🏢 EVALUACIONES POR INSTITUCIÓN:');
  console.log('─'.repeat(40));
  evaluacionesPorInstitucion.forEach(r => {
    console.log(`   ${r.tipoInstitucion}: ${r._count} evaluaciones`);
  });

  // 6. Eventos con detalles
  const eventos = await prisma.evento.findMany({
    select: {
      id: true,
      nombre: true,
      codigo: true,
      tipoEvento: true,
      estado: true,
      municipios: true,
      estadoEvento: true,
      fechaInicio: true,
      fechaCierre: true,
      tipoInstitucion: true,
      _count: {
        select: { evaluaciones: true }
      }
    },
    orderBy: { fechaInicio: 'asc' }
  });
  
  console.log(`\n🎯 Total de Eventos: ${eventos.length}\n`);
  
  console.log('📋 LISTA DE EVENTOS:');
  console.log('─'.repeat(80));
  eventos.forEach((e, i) => {
    console.log(`${i+1}. ${e.nombre}`);
    console.log(`   Código: ${e.codigo}`);
    console.log(`   Tipo: ${e.tipoEvento}`);
    console.log(`   Estado: ${e.estado}`);
    console.log(`   Municipios: ${e.municipios.join(', ')}`);
    console.log(`   Estado evento: ${e.estadoEvento}`);
    console.log(`   Institución: ${e.tipoInstitucion || 'No especificada'}`);
    console.log(`   Evaluaciones: ${e._count.evaluaciones}`);
    console.log(`   Inicio: ${e.fechaInicio.toLocaleDateString()}`);
    console.log(`   Cierre: ${e.fechaCierre?.toLocaleDateString() || 'Activo'}`);
    console.log('');
  });

  // 7. Solicitudes de registro
  const solicitudes = await prisma.registrationRequest.findMany({
    select: {
      id: true,
      nombreInstitucion: true,
      tipoInstitucion: true,
      estado: true,
      municipio: true,
      estadoSolicitud: true,
      nombreResponsable: true,
      createdAt: true
    },
    orderBy: { createdAt: 'desc' }
  });
  
  console.log(`\n📝 Total de Solicitudes: ${solicitudes.length}\n`);
  
  console.log('📋 SOLICITUDES DE REGISTRO:');
  console.log('─'.repeat(80));
  solicitudes.forEach((s, i) => {
    console.log(`${i+1}. ${s.nombreInstitucion}`);
    console.log(`   Responsable: ${s.nombreResponsable}`);
    console.log(`   Tipo: ${s.tipoInstitucion}`);
    console.log(`   Estado: ${s.estado} | Municipio: ${s.municipio || 'N/A'}`);
    console.log(`   Solicitud: ${s.estadoSolicitud}`);
    console.log(`   Fecha: ${s.createdAt.toLocaleDateString()}`);
    console.log('');
  });

  // 8. Resumen por estado
  const resumenEstados = await prisma.user.groupBy({
    by: ['ubicacion'],
    _count: true,
    where: {
      ubicacion: { not: null }
    },
    orderBy: { _count: { ubicacion: 'desc' } }
  });
  
  console.log('\n📊 RESUMEN POR ESTADO:');
  console.log('═'.repeat(50));
  let totalConUbicacion = 0;
  resumenEstados.forEach(r => {
    console.log(`   ${r.ubicacion}: ${r._count} usuarios`);
    totalConUbicacion += r._count;
  });
  console.log(`   Total con ubicación: ${totalConUbicacion}`);
  console.log(`   Total general: ${usuarios.length}`);

  console.log('\n=== FIN DEL REPORTE COMPLETO ===');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

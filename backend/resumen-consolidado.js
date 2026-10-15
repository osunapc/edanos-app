import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const usuarios = await prisma.user.findMany({ select: { ubicacion: true } });
const evaluaciones = await prisma.evaluation.findMany({ select: { estado: true, municipio: true } });
const eventos = await prisma.evento.findMany({ select: { estado: true, municipios: true, estadoEvento: true, _count: { select: { evaluaciones: true } } } });
const satos = await prisma.satosReport.count();
const func = await prisma.funcionario.count();

console.log('=== RESUMEN CONSOLIDADO ===');
console.log('Usuarios:', usuarios.length);
console.log('Evaluaciones:', evaluaciones.length);
console.log('Eventos:', eventos.length);
console.log('Reportes SATOS:', satos);
console.log('Funcionarios HERO:', func);

const estadosMap = {
  'Merida': 'Mérida', 'Mérida': 'Mérida',
  'Zulia': 'Zulia', 'ZULIA-CATATUMBO': 'Zulia', 'Maracaibo': 'Zulia',
  'Sucre': 'Sucre', 'SUCRE': 'Sucre',
  'Apure': 'Apure',
  'Aragua': 'Aragua',
  'Lara': 'Lara',
  'Yaracuy': 'Yaracuy',
  'Carabobo': 'Carabobo'
};

const conteo = {};
usuarios.forEach(u => {
  const est = estadosMap[u.ubicacion] || u.ubicacion || 'Sin ubicación';
  conteo[est] = (conteo[est] || 0) + 1;
});
console.log('\nUsuarios por estado (normalizado):');
Object.entries(conteo).sort((a,b) => b[1]-a[1]).forEach(([est, count]) => {
  console.log('  ' + est + ': ' + count);
});

const evalConteo = {};
evaluaciones.forEach(e => {
  const est = estadosMap[e.estado] || e.estado || 'Sin estado';
  evalConteo[est] = (evalConteo[est] || 0) + 1;
});
console.log('\nEvaluaciones por estado:');
Object.entries(evalConteo).sort((a,b) => b[1]-a[1]).forEach(([est, count]) => {
  console.log('  ' + est + ': ' + count);
});

console.log('\nEventos por estado:');
eventos.forEach(e => {
  console.log('  ' + e.estado + ' (' + e.estadoEvento + '): ' + e._count.evaluaciones + ' evals - ' + e.municipios.join(', '));
});

await prisma.$disconnect();

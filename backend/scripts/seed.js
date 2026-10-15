import prisma from '../src/libs/prisma.js';

const maleFirstNames = [
	'Carlos',
	'José',
	'Luis',
	'Miguel',
	'Andrés',
	'Eduardo',
	'Javier',
	'Diego',
	'Rafael',
	'Gustavo'
];
const femaleFirstNames = [
	'María',
	'Ana',
	'Carolina',
	'Lucía',
	'Sofía',
	'Isabel',
	'Verónica',
	'Patricia',
	'Gabriela',
	'Lorena'
];
const lastNames = [
	'Pérez',
	'González',
	'Martínez',
	'Rodríguez',
	'García',
	'Hernández',
	'López',
	'Ramos',
	'Torres',
	'Vásquez'
];

const municipiosMerida = [
	'Libertador (Mérida)',
	'Campo Elías (Ejido)',
	'Tovar',
	'Alberto Adriani (El Vigía)',
	'Santos Marquina (Bailadores)',
	'Zea',
	'Rangel',
	'Miranda',
	'Sucre',
	'Obispo Ramos de Lora'
];

function randomFrom(array, i) {
	return array[i % array.length];
}

function randomPhone(prefix) {
	const n = Math.floor(100000 + Math.random() * 900000);
	return `${prefix}${n}`;
}

function randomCedula(prefixNum) {
	return `V${prefixNum + Math.floor(Math.random() * 9000000)}`;
}

async function main() {
	console.log('Iniciando seed: creando 10 evaluaciones de muestra (Mérida, VE)...');

	const seedData = [];

	for (let i = 0; i < 10; i++) {
		const gender = Math.random() < 0.5 ? 'M' : 'F';
		let firstName;
		if (gender === 'M') {
			firstName = randomFrom(maleFirstNames, i);
		} else {
			firstName = randomFrom(femaleFirstNames, i);
		}
		const lastName = randomFrom(lastNames, i);
		const fullName = `${firstName} ${lastName}`;
		const municipio = randomFrom(municipiosMerida, i);
		const ageJefe = 30 + Math.floor(Math.random() * 35); // 30-64

		seedData.push({
			informacionPreliminar: `Evaluación de muestra - ${fullName}`,
			estado: 'Mérida',
			municipio,
			parroquia: 'Centro',
			cuadranteDePaz: `Cuadrante ${i + 1}`,
			urbanizacion: `Urbanización ${i + 1}`,
			calle: `Calle ${i + 1}`,
			casa: `Casa ${i + 1}`,
			barrioSector: `Sector ${i + 1}`,
			vereda: null,
			apto: null,
			avenida: null,
			usoEstructura: 'Residencial',
			latitud: (8.6 + i * 0.01).toFixed(4),
			longitud: (-71.1 - i * 0.01).toFixed(4),
			tipoEvento: 'Sismo',
			horaEvento: `${8 + i}:30`,

			apellidosJefe: lastName,
			nombresJefe: firstName,
			telefonoJefe: randomPhone('0414'),

			condicionVivienda: i % 3 === 0 ? 'Dañada gravemente' : 'Parcialmente dañada',
			viasAcceso: ['vehicular', 'peatonal'],
			condicionAcceso: 'Transitable',

			jefeFamilia: fullName,
			edadJefe: `${ageJefe}`,
			sexoJefe: gender,
			cedulaJefe: randomCedula(1000000 + i * 10),

			viviendaSolidaria: false,
			albergue: false,

			materialesConstruccion: ['ladrillo', 'bloque'],
			afectacionesNoEstructurales: ['grietas'],
			afectacionesEstructuralesColapso: ['ninguna'],
			afectacionesParciales: ['fisuras en muros'],
			perdidasEnseres: ['ropa', 'muebles pequeños'],
			lineasVitalesAfectadas: ['agua'],
			observaciones: `Evaluación generada automáticamente - registro ${i + 1}`,

			nombreEvaluado: fullName,
			cedulaEvaluado: randomCedula(2000000 + i * 10),
			telefonoEvaluado: randomPhone(i % 2 === 0 ? '0424' : '0416'),

			nombreEvaluador: 'Equipo SIMULADO',
			cedulaEvaluador: 'SIM-0001',
			telefonoEvaluador: '0000000000',

			grupoFamiliar: {
				create: {
					apellidosNombres: `${randomFrom(lastNames, i)} ${randomFrom(femaleFirstNames, i)}`,
					cedula: randomCedula(3000000 + i * 10),
					edad: `${5 + (i % 4) * 5}`,
					sexo: i % 2 === 0 ? 'F' : 'M',
					parentesco: i % 2 === 0 ? 'Hija' : 'Hijo',
					tallaC: 'M',
					tallaP: 'S',
					tallaZ: 'M',
					patologias: null
				}
			}
		});
	}

	try {
		for (const item of seedData) {
			/* eslint-disable no-await-in-loop */
			const created = await prisma.evaluation.create({
				data: item,
				include: { grupoFamiliar: true }
			});
			console.log('Creada evaluación id=', created.id, '-', item.nombreEvaluado);
		}
		console.log('Seed completado: 10 evaluaciones creadas.');
	} catch (error) {
		console.error('Error durante seed:', error);
	} finally {
		await prisma.$disconnect();
	}
}

main();

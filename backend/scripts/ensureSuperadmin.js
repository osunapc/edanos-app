import prisma from '../src/libs/prisma.js';
import bcrypt from 'bcryptjs';

export async function ensureSuperadmin() {
	const SUPERADMIN_PLAIN_PASSWORD = process.env.SUPERADMIN_PASSWORD;
	const hashedPassword = await bcrypt.hash(SUPERADMIN_PLAIN_PASSWORD, 10);

	const superadminData = {
		email: 'osunapc@gmail.com',
		nombre: 'GABRIEL LEONARDO',
		apellido: 'ESPITIA OSUNA',
		contrasena: hashedPassword,
		rol: 'superadmin',
		cargo: 'Creador de EDANOS',
		cedula: '19997038',
		telefono: '04147353142',
		ubicacion: 'Merida',
		codigo: 'dev'
	};

	const existingSuperadmin = await prisma.user.findUnique({
		where: { email: superadminData.email }
	});

	if (existingSuperadmin) {
		await prisma.user.update({
			where: { email: superadminData.email },
			data: { contrasena: hashedPassword }
		});
		console.log(`Superadmin password updated for ${superadminData.email}`);
	} else {
		await prisma.user.create({ data: superadminData });
		console.log(`Superadmin user created: ${superadminData.email}`);
	}
}

async function main() {
	try {
		await ensureSuperadmin();
	} catch (error) {
		console.error('Error ensuring superadmin user:', error);
	} finally {
		await prisma.$disconnect();
	}
}

const isMainModule = process.argv[1]?.replace(/\\/g, '/').endsWith('ensureSuperadmin.js');
if (isMainModule) {
	main();
}

import pkg from '@prisma/client';
const { PrismaClient } = pkg;

global.prisma = global.prisma || new PrismaClient();

const prisma = global.prisma;

if (process.env.NODE_ENV !== 'production') {
	global.prisma = prisma;
}
export default prisma;

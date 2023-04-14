import { PrismaClient } from '@prisma/client';
import process from 'process';

const prisma = new PrismaClient({
	log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error']
});

export default prisma;

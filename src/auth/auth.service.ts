import prisma from '../lib/db';
import { AuthDTO } from '../lib/dto';
import bcrypt from 'bcrypt';
import { type User } from '@prisma/client';

export const getUserByUsername = (username: string): Promise<User | null> => {
	return prisma.user.findUnique({
		where: { username }
	});
};

export const createUser = async (body: AuthDTO): Promise<User> => {
	return prisma.user.create({
		data: {
			username: body.username,
			hashedPassword: bcrypt.hashSync(body.password, 10)
		}
	});
};

export const truncateUser = async (): Promise<void> => {
	await prisma.chat.deleteMany();
	await prisma.game.deleteMany();
	await prisma.user.deleteMany();
};

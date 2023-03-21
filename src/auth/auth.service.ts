import prisma from '../lib/db';
import { AuthDTO } from '../lib/dto';
import bcrypt from 'bcrypt';
import { type User } from '@prisma/client';

export const getUserByEmail = async (username: string): Promise<User | null> => {
	return await prisma.user.findUnique({
		where: { username },
	});
};

export const createUser = async (body: AuthDTO): Promise<User> => {
	return await prisma.user.create({
		data: { username: body.username, hashedPassword: bcrypt.hashSync(body.password, 10) },
	});
};

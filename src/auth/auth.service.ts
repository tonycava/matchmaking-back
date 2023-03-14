import prisma from '../lib/db';
import { AuthDTO } from '../lib/dto';
import bcrypt from 'bcrypt';

export const getUserByEmail = async (username: string) => {
	return await prisma.user.findUnique({
		where: { username },
	});
};

export const createUser = async (body: AuthDTO) => {
	return await prisma.user.create({
		data: { username: body.username, hashedPassword: bcrypt.hashSync(body.password, 10), },
	});
};
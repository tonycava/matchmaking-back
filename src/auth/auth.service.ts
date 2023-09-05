import prisma from '../lib/db';
import { AuthDTO } from '../lib/dto';
import bcrypt from 'bcrypt';
import { type User } from '@prisma/client';
import { authenticator } from 'otplib';

export const getUserByUsername = (username: string): Promise<User | null> => {
	return prisma.user.findFirst({
		where: { username }
	});
};

export const createUser = async (body: AuthDTO): Promise<User> => {
	return prisma.user.create({
		data: {
			username: body.username,
			hashedPassword: bcrypt.hashSync(body.password, 10),
			secret: authenticator.generateSecret()
		}
	});
};

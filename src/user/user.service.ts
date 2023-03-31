import prisma from '../lib/db';
import type { User } from '@prisma/client';

export const getUserProfilePicture = (userId: string): Promise<{ profilePicture: string }> => {
	return prisma.user.findUnique({
		where: { id: userId },
		select: { profilePicture: true },
	});
};

export const changeProfilePicture = (userId: string, profilePicture: string): Promise<User> => {
	return prisma.user.update({
		where: { id: userId },
		data: { profilePicture },
	});
};

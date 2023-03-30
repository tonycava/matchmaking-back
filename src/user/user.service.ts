import prisma from '../lib/db';

export const getUserProfilePicture = (userId: string): Promise<{ profilePicture: string }> => {
	return prisma.user.findUnique({
		where: { id: userId },
		select: { profilePicture: true },
	});
};
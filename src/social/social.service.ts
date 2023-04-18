import prisma from '../lib/db';
import { type Follow } from '@prisma/client';

export const startFollowSomeone = (idToFollow: string, userId: string): Promise<Follow> => {
	return prisma.follow.create({
		data: {
			followerId: userId,
			followedId: idToFollow
		}
	});
};

export const unFollowSomeone = (idToUnfollow: string, userId: string): Promise<Follow> => {
	return prisma.follow.delete({
		where: {
			followedId_followerId: {
				followerId: userId,
				followedId: idToUnfollow
			}
		}
	});
};

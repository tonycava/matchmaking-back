import prisma from '../lib/db';
import { Application, type Follow } from '@prisma/client';

export const startFollowSomeone = (idToFollow: string, userId: string): Promise<Follow> => {
	return prisma.follow.create({
		data: {
			followerId: idToFollow,
			followedId: userId
		}
	});
};

export const unFollowSomeone = (idToUnfollow: string, userId: string): any => {
	return prisma.follow.deleteMany({
		where: {
			followerId: idToUnfollow,
			followedId: userId
		}
	});
};

export const addNewApplication = (
	userIdToApply: string,
	userId: string
): Promise<
	Application & {
		userToFollow: {
			username: string;
			profilePicture: string;
		};
	}
> => {
	return prisma.application.create({
		select: {
			id: true,
			createdAt: true,
			userIdToFollow: true,
			userIdWhoFollow: true,
			userToFollow: {
				select: {
					username: true,
					profilePicture: true
				}
			}
		},
		data: {
			userWhoFollow: {
				connect: {
					id: userIdToApply
				}
			},
			userToFollow: {
				connect: {
					id: userId
				}
			}
		}
	});
};

export const removeApplicationById = (applicationIdToUnApply: string): Promise<Application> => {
	return prisma.application.delete({
		where: { id: applicationIdToUnApply }
	});
};

export const getApplicationById = (
	userIdToFollow: string,
	userIdWhoFollow: string
): Promise<Application | null> => {
	return prisma.application.findFirst({
		where: { userIdToFollow, userIdWhoFollow }
	});
};

export const removeWaitingApplicationById = (applicationId: string): Promise<Application> => {
	return prisma.application.delete({
		where: { id: applicationId }
	});
};

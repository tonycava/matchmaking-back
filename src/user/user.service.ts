import prisma from '../lib/db';
import type { Application, Follow, Game, Role, User } from '@prisma/client';
import { Chat } from 'matchmaking-shared';

type UserDTO = {
	id: string;
	username: string;
	createdAt: Date;
	profilePicture: string | null;
};

export const isAccountFollowingMe = (myId: string, otherId: string): Promise<Follow> => {
	return prisma.follow.findFirst({
		where: {
			followerId: otherId,
			followedId: myId
		}
	});
};

export const isAccountInApplication = (
	userIdToDemand: string,
	userId: string
): Promise<Application | null> => {
	return prisma.application.findFirst({
		where: {
			userIdToFollow: userId,
			userIdWhoFollow: userIdToDemand
		}
	});
};

export const getUserInformationById = (
	userId: string
): Promise<
	UserDTO & {
		chats: Chat[];
		_count: { loserGames: number; winnerGames: number; followers: number; followed: number };
		followers: Follow[];
		role: Role;
		loserGames: Game[];
		winnerGames: Game[];
		private: boolean;
		whoFollow: { id: string; userToFollow: UserDTO }[];
		followed: Follow[];
	}
> => {
	return prisma.user.findUnique({
		where: { id: userId },
		select: {
			id: true,
			private: true,
			role: true,
			username: true,
			whoFollow: {
				select: {
					id: true,
					userToFollow: {
						select: {
							id: true,
							username: true,
							createdAt: true,
							profilePicture: true
						}
					}
				}
			},
			createdAt: true,
			profilePicture: true,
			winnerGames: true,
			followers: true,
			loserGames: true,
			followed: true,
			_count: {
				select: {
					followers: true,
					followed: true,
					loserGames: true,
					winnerGames: true
				}
			},
			chats: {
				select: {
					userId: true,
					id: true,
					content: true,
					createdAt: true,
					user: { select: { username: true, role: true } }
				}
			}
		}
	});
};

export const changeProfilePicture = (userId: string, profilePicture: string): Promise<User> => {
	return prisma.user.update({
		where: { id: userId },
		data: { profilePicture }
	});
};

export const changeStatus = (userId: string, status: boolean): Promise<User> => {
	return prisma.user.update({
		where: { id: userId },
		data: { private: status }
	});
};

export const changeRole = (userId: string, role: Role): Promise<User> => {
	return prisma.user.update({
		where: { id: userId },
		data: { role }
	});
};

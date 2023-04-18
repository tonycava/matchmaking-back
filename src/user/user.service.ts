import prisma from '../lib/db';
import type { Follow, User } from '@prisma/client';
import { Chat } from 'matchmaking-shared';

type UserDTO = {
	id: string;
	username: string;
	createdAt: Date;
	profilePicture: string | null;
};

export const getUserInformationById = (
	userId: string
): Promise<
	UserDTO & {
		chats: Chat[];
		_count: { loserGames: number; winnerGames: number; followers: number; followed: number };
		followers: Follow[];
		followed: Follow[];
	}
> => {
	return prisma.user.findUnique({
		where: { id: userId },
		select: {
			id: true,
			username: true,
			createdAt: true,
			profilePicture: true,
			followers: true,
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
					user: { select: { username: true } }
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

export const getChatsByUserId = (userId: string): Promise<Chat[]> => {
	return prisma.chat.findMany({
		where: { userId },
		select: {
			createdAt: true,
			content: true,
			id: true,
			userId: true,
			user: { select: { username: true } }
		}
	});
};

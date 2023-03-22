import prisma from '../lib/db';
import { Chat, Game } from '@prisma/client';

export const createGame = async (gameId: string): Promise<Game> => {
	return prisma.game.create({
		data: { id: gameId },
	});
};

export const createChat = async (content: string, userId: string): Promise<Chat> => {
	return prisma.chat.create({
		data: {
			content,
			user: { connect: { id: userId } },
		},
	});
};

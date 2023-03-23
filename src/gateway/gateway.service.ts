import prisma from '../lib/db';
import { Chat, Game } from '@prisma/client';
import { ChatService } from '../chat/chat.service';

export const createGame = async (gameId: string): Promise<Game> => {
	return prisma.game.create({
		data: { id: gameId },
	});
};

export const createChat = async (content: string, userId: string): Promise<ChatService> => {
	return prisma.chat.create({
		select: {
			content: true,
			createdAt: true,
			id: true,
			userId: true,
			user: { select: { username: true } },
		},
		data: {
			content,
			user: { connect: { id: userId } },
		},
	});
};

import prisma from '../lib/db';
import { Game } from '@prisma/client';

export const createGame = async (gameId: string): Promise<Game> => {
	return prisma.game.create({
		data: { id: gameId }
	});
};

export const updateGame = async (
	gameId: string,
	{ winnerId, loserId }: Pick<Game, 'winnerId' | 'loserId'> | null
): Promise<Game> => {
	if (!winnerId || !loserId) return;
	return prisma.game.update({
		where: { id: gameId },
		data: { winnerId, loserId }
	});
};

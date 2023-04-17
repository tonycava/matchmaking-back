import prisma from '../lib/db';
import { Game } from '@prisma/client';

export const createGame = async (gameId: string): Promise<Game> => {
	return prisma.game.create({
		data: { id: gameId }
	});
};

export const updateGame = async (
	gameId: string,
	game: Pick<Game, 'winnerId' | 'loserId'> | null
): Promise<Game> => {
	if (!game?.winnerId || !game?.loserId) return;
	const { winnerId, loserId } = game;
	return prisma.game.update({
		where: { id: gameId },
		data: { winnerId, loserId }
	});
};

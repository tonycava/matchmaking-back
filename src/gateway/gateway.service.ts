import prisma from '../lib/db';
import { Game } from '@prisma/client';

export const createGame = async (gameId: string): Promise<Game> => {
	return prisma.game.create({
		data: { id: gameId },
	});
};

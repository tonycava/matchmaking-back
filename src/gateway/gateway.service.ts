import prisma from '../lib/db';

export const createGame = async (gameId: string) => {
	return prisma.game.create({
		data: { id: gameId }
	});
}
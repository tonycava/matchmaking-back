import prisma from '../lib/db';

type Leaderboard = {
	id: string;
	username: string;
	numberOfWins: number;
	numberOfLosses: number;
};

export const getTopTenWinners = async (): Promise<Leaderboard[]> => {
	const topUsers = await prisma.user.findMany({
		select: {
			id: true,
			username: true,
			winnerGames: {
				select: { id: true },
			},
			loserGames: {
				select: { id: true },
			},
		},
		orderBy: [{ winnerGames: { _count: 'desc' } }, { loserGames: { _count: 'desc' } }],
		take: 10,
	});

	return topUsers.map((user) => ({
		id: user.id,
		username: user.username,
		numberOfWins: user.winnerGames.length,
		numberOfLosses: user.loserGames.length,
	}));
};

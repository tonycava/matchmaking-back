import { Game, Move, Some, WhoWin } from './dto';

export const whoWin = (player1Move: Move, player2Move: Move): WhoWin | null => {
	if (player1Move === player2Move) return null;
	if (player1Move === 'rock' && player2Move === 'scissors') return 'player1';
	if (player1Move === 'rock' && player2Move === 'paper') return 'player2';

	if (player1Move === 'paper' && player2Move === 'rock') return 'player1';
	if (player1Move === 'paper' && player2Move === 'scissors') return 'player2';

	if (player1Move === 'scissors' && player2Move === 'paper') return 'player1';
	if (player1Move === 'scissors' && player2Move === 'rock') return 'player2';

	return null;
};

export const buildNewGame = (game: Game): Game => {
	const newTimerPlay = game.state === 'choosing' && game.timerPlay > 0 ? game.timerPlay - 1 : 10;
	const newTimerRev = game.state === 'reveal' && game.timerRev > 0 ? game.timerRev - 1 : 5;

	if (game.round === 4 || (game.timerPlay === 10 && game.timerRev === 1 && game.round === 3)) {
		return {
			...game,
			timerPlay: 0,
			timerRev: 0,
			state: 'finished',
		};
	}

	if (newTimerRev === 0 && game.round !== 4) {
		return {
			...game,
			timerRev: 0,
			timerPlay: 10,
			round: game.round + 1,
			state: 'choosing',
		};
	}

	if (newTimerPlay === 0 && game.round !== 4) {
		const who = whoWin(game.actualPlay[game.players[0]], game.actualPlay[game.players[1]]);

		if (who === 'player1') game.whoWin[game.round - 1] = game.players[0];
		if (who === 'player2') game.whoWin[game.round - 1] = game.players[1];
		return {
			...game,
			timerRev: 5,
			timerPlay: 0,
			state: 'reveal',
		};
	}

	return {
		...game,
		timerPlay: newTimerPlay,
		timerRev: newTimerRev,
	};
};

type GameLogic = {
	winnerId: string;
	loserId: string;
};

export const getWinningPlayer = (
	whoWin: [Some, Some, Some],
	players: [string, string],
): GameLogic | null => {
	const [player1, player2] = players;
	const records: Record<string, number> = { null: 0, [player1]: 0, [player2]: 0 };

	for (let i = 0; i < whoWin.length; i++) records[whoWin[i]] += 1;

	if (records['null'] === 0) {
		if (records[player1] > records[player2]) return { winnerId: player1, loserId: player2 };
		return {
			winnerId: player2,
			loserId: player1,
		};
	}

	if (records['null'] === 1) {
		if (records[player1] === 2) return { winnerId: player1, loserId: player2 };
		if (records[player2] === 2) return { winnerId: player2, loserId: player1 };
		return null;
	}

	if (records['null'] === 2) {
		if (records[player1] === 1) return { winnerId: player1, loserId: player2 };
		if (records[player2] === 1) return { winnerId: player2, loserId: player1 };
		return null;
	}

	if (records['null'] === 3) return null;
};

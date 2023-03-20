import { Game, Move, WhoWin } from './dto';

export const whoWin = (player1Move: Move, player2Move: Move): WhoWin | null => {
	if (player1Move === player2Move) return null;
	if (player1Move === 'rock' && player2Move === 'scissors') return 'player1';
	if (player1Move === 'rock' && player2Move === 'paper') return 'player2';
	if (player1Move === 'rock' && player2Move === 'rock') return null;

	if (player1Move === 'paper' && player2Move === 'rock') return 'player1';
	if (player1Move === 'paper' && player2Move === 'scissors') return 'player2';
	if (player1Move === 'paper' && player2Move === 'paper') return null;

	if (player1Move === 'scissors' && player2Move === 'paper') return 'player1';
	if (player1Move === 'scissors' && player2Move === 'rock') return 'player2';
	if (player1Move === 'scissors' && player2Move === 'scissors') return null;

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
		if (who === 'player2') game.whoWin[game.round - 1] = game.players[0];
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
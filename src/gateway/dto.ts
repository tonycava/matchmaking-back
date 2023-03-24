export type Waiter = {
	userId: string;
	joinAt: Date;
};

export type PlayDTO = {
	gameId: string;
	userId: string;
	move: Move;
};

export type ChatDTO = {
	userId: string;
	message: string;
};

export type Game = {
	state: 'choosing' | 'reveal' | 'finished';
	round: number;
	timerPlay: number;
	timerRev: number;
	players: [string, string];
	whoWin: [Some, Some, Some];
	actualPlay: Record<string, Move>;
};

export type Some = string | null;
export type Move = 'rock' | 'paper' | 'scissors';
export type WhoWin = 'player1' | 'player2';

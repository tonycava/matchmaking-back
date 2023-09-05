import { Move } from 'matchmaking-shared';

export type Waiter = {
	userId: string;
	joinAt: Date;
	lastTimeAlive: Date;
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

export type WhoWin = 'player1' | 'player2';

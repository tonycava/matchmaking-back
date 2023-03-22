import { io } from '../index';
import crypto from 'crypto';
import { createChat, createGame } from './gateway.service';
import { Game, Move, Waiter } from './dto';
import { buildNewGame } from './game.logic';

let waiters: Waiter[] = [];
const games: Map<string, Game> = new Map([]);

// setInterval(() => {
// 	for (const [gameId, game] of games) {
// 		const newGame = buildNewGame(game);
// 		games.set(gameId, newGame);
// 		io
// 			.to(gameId)
// 			.emit('update', newGame);
// 	}
// }, 1000);

io.on('connection', (socket) => {
	console.log('a user connected');

	socket.on('leaveWaiting', (data: Waiter) => {
		waiters = waiters.filter((waiter) => waiter.userId !== data.userId);
	});

	socket.on('joinGame', (gameId) => {
		socket.join(gameId);
	});

	socket.on('play', (data: { gameId: string; userId: string; move: Move }) => {
		const game = games.get(data.gameId)!;
		game.actualPlay[data.userId] = data.move;
		games.set(data.gameId, game);
	});

	socket.on('chat', async (data: { userId: string; message: string }) => {
		await createChat(data.message, data.userId);
		io.emit('newMessage', { id: data.userId, content: data.message, date: new Date() });
	});

	socket.on('joinWaiting', async (data: Waiter) => {
		socket.join(data.userId);

		if (waiters.length >= 1) {
			const partner = waiters.shift()!;
			// if (waiters.includes({ userId: partner.userId })) return
			// if (partner.userId === data.userId) return;
			const gameId = crypto.randomUUID();
			try {
				await createGame(gameId);
				games.set(gameId, {
					state: 'choosing',
					whoWin: [null, null, null],
					round: 1,
					actualPlay: {
						[partner.userId]: 'rock',
						[data.userId]: 'scissors',
					},
					timerPlay: 10,
					timerRev: 5,
					players: [partner.userId, data.userId],
				});
				io.to([data.userId, partner.userId]).emit('partner', { users: [partner, data], gameId });
			} catch (error) {
				console.log(error);
			}

			return;
		}
		waiters.push(data);
	});
});

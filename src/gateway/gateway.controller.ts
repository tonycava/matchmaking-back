import { io } from '../index';
import crypto from 'crypto';
import { createGame } from './gateway.service';
import { createChat } from '../chat/chat.service';
import { ChatDTO, Game, PlayDTO, Waiter } from './dto';
import { WEB_SOCKET_EVENT } from '../lib/utils';
import { buildNewGame } from './game.logic';

const waiters = new Map<string, Waiter>([]);
const games = new Map<string, Game>([]);

setInterval(() => {
	for (const [gameId, game] of games) {
		const newGame = buildNewGame(game);
		games.set(gameId, newGame);
		io.to(gameId).emit(WEB_SOCKET_EVENT.UPDATE, newGame);
	}
}, 1000);

io.on(WEB_SOCKET_EVENT.CONNECT, (socket) => {
	console.log('a user connected');

	socket.on(WEB_SOCKET_EVENT.LEAVE_WAITING, (data: Waiter) => {
		waiters.delete(data.userId);
	});

	socket.on(WEB_SOCKET_EVENT.JOIN_GAME, (gameId: string) => {
		socket.join(gameId);
	});

	socket.on(WEB_SOCKET_EVENT.PLAY, (data: PlayDTO) => {
		const game = games.get(data.gameId)!;
		game.actualPlay[data.userId] = data.move;
		games.set(data.gameId, game);
	});

	socket.on(WEB_SOCKET_EVENT.CHAT, async (data: ChatDTO) => {
		const chat = await createChat(data.message, data.userId);
		io.emit(WEB_SOCKET_EVENT.NEW_MESSAGE, {
			id: chat.id,
			userId: data.userId,
			content: data.message,
			createdAt: new Date(),
			user: { username: chat.user.username },
		});
	});

	socket.on(WEB_SOCKET_EVENT.JOIN_WAITING, async (data: Waiter) => {
		socket.join(data.userId);

		if (waiters.size >= 1) {
			const [firstPartner] = waiters.entries();
			const [partnerId, partner] = firstPartner;
			if (partnerId === data.userId) return;
			waiters.delete(partnerId);
			const gameId = crypto.randomUUID();
			try {
				await createGame(gameId);
				games.set(gameId, {
					state: 'choosing',
					whoWin: [null, null, null],
					round: 1,
					actualPlay: {
						[partnerId]: 'rock',
						[data.userId]: 'rock',
					},
					timerPlay: 10,
					timerRev: 5,
					players: [partnerId, data.userId],
				});
				io.to([data.userId, partnerId]).emit(WEB_SOCKET_EVENT.PARTNER, {
					users: [partner.userId, data.userId],
					gameId,
				});
			} catch (error) {
				console.error(error);
			}
			return;
		}

		if (waiters.has(data.userId)) return;
		waiters.set(data.userId, data);
	});
});

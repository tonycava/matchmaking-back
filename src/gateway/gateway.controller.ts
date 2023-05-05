import { io } from '../index';
import crypto from 'crypto';
import { createGame, updateGame } from './gateway.service';
import { createChat } from '../chat/chat.service';
import { ChatDTO, PlayDTO, Waiter } from './dto';
import { buildNewGame, getWinningPlayer } from './game.logic';
import { type Game, WEB_SOCKET_EVENT } from 'matchmaking-shared';
import { createDirect } from '../direct/direct.service';

const waiters = new Map<string, Waiter>([]);
const games = new Map<string, Game>([]);

setInterval(async () => {
	for (const [gameId, game] of games) {
		if (game.state === 'finished') {
			const winningPlayer = getWinningPlayer(game.whoWin, game.players);
			if (winningPlayer) {
				const toEmit = {
					id: gameId,
					winnerId: winningPlayer.winnerId,
					loserId: winningPlayer.loserId,
					result: winningPlayer.winnerId,
					createdAt: new Date()
				};
				io.emit(`user/${winningPlayer.winnerId}`, toEmit);
				io.emit(`user/${winningPlayer.loserId}`, toEmit);
			}
			await updateGame(gameId, winningPlayer);
			games.delete(gameId);
			continue;
		}
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

	socket.on(
		'newDirectChat',
		async ({ message, to, from }: { message: string; to: string; from: string }) => {
			await createDirect(from, to, message);
			io.to([`direct/${to}`, `direct/${from}`]).emit('newDirect', {
				content: message,
				personWhoRecivedId: to,
				personWhoSendId: from,
				createdAt: new Date()
			});
		}
	);

	socket.on(WEB_SOCKET_EVENT.PLAY, (data: PlayDTO) => {
		const game = games.get(data.gameId)!;
		game.actualPlay[data.userId] = data.move;
		games.set(data.gameId, game);
	});

	socket.on('joinDirect', ({ to, from }: { to: string; from: string }) => {
		socket.join([`direct/${to}`, `direct/${from}`]);
	});

	socket.on(WEB_SOCKET_EVENT.CHAT, async (data: ChatDTO) => {
		const chat = await createChat(data.message, data.userId);
		io.emit(WEB_SOCKET_EVENT.NEW_MESSAGE, {
			id: chat.id,
			userId: data.userId,
			content: data.message,
			createdAt: new Date(),
			user: { username: chat.user.username, role: chat.user.role }
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
						[data.userId]: 'rock'
					},
					timerPlay: 10,
					timerRev: 5,
					players: [partnerId, data.userId]
				});
				io.to([data.userId, partnerId]).emit(WEB_SOCKET_EVENT.PARTNER, {
					users: [partner.userId, data.userId],
					gameId
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

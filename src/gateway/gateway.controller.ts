import { io } from '../index';
import crypto from 'crypto';

type Waiter = {
	userId: string;
	joinAt: Date;
}

let waiters: Waiter[] = [];

io.on('connection', (socket) => {
	console.log('a user connected');

	socket.on('leaveWaiting', (data: Waiter) => {
		waiters = waiters.filter((waiter) => waiter.userId !== data.userId);
	});

	socket.on('joinWaiting', (data: Waiter) => {
		socket.join(data.userId);
		console.log('join at', data.userId);

		if (waiters.length >= 1) {
			const partner = waiters.shift()!;
			io
				.to([data.userId, partner.userId])
				.emit('partner', { users: [partner, data], gameId: crypto.randomUUID() });
			return;
		}
		waiters.push(data);
	});
});
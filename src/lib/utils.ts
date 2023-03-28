import type { CorsOptions } from 'cors';

export const CORS_CONFIG: CorsOptions = {
	origin: ['http://localhost:[0-9]', 'https://aml.tonycava.dev'],
	credentials: true,
};

export enum WEB_SOCKET_EVENT {
	CONNECT = 'connect',
	LEAVE_WAITING = 'leaveWaiting',
	JOIN_GAME = 'joinGame',
	JOIN_WAITING = 'joinWaiting',
	UPDATE = 'update',
	PLAY = 'play',
	CHAT = 'chat',
	NEW_MESSAGE = 'newMessage',
	PARTNER = 'partner',
}

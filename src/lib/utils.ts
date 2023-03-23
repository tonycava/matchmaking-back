export const CORS_CONFIG = {
	origin: ['http://localhost:11001'],
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

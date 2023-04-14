import { SafeParseReturnType } from 'zod';
import jwt from 'jsonwebtoken';

export enum WEB_SOCKET_EVENT {
	CONNECT = 'connect',
	LEAVE_WAITING = 'leaveWaiting',
	JOIN_GAME = 'joinGame',
	JOIN_WAITING = 'joinWaiting',
	UPDATE = 'update',
	PLAY = 'play',
	CHAT = 'chat',
	NEW_MESSAGE = 'newMessage',
	PARTNER = 'partner'
}

export const formatZodParseResponse = <Input = any, Output = any>(
	error: SafeParseReturnType<Input, Output>
): string[] => {
	if (error.success) return [];
	const errors = (error as any).error.errors;
	return errors.map((error: any) => error.message);
};

export const formatZodParseResponseOneLine = <Input = any, Output = any>(
	error: SafeParseReturnType<Input, Output>,
	separator = ';'
): string => {
	return formatZodParseResponse(error).join(separator);
};

export const signToken = (id: string, username: string, createdAt: Date): string => {
	return jwt.sign({ id, username, createdAt }, process.env.JWT_SECRET ?? '', {
		expiresIn: '7d'
	});
};

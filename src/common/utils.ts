import { SafeParseReturnType } from 'zod';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';

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

type JwtPayLoad = { id: string; username: string; role: Role; createdAt: Date };

export const signToken = ({ id, username, createdAt, role }: JwtPayLoad): string => {
	return jwt.sign({ id, username, createdAt, role }, process.env.JWT_SECRET ?? '', {
		expiresIn: '7d'
	});
};

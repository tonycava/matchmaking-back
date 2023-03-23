import prisma from '../lib/db';
import { Chat } from '@prisma/client';
import { Range } from '../lib/dto';

export type ChatService = Chat & { user: { username: string } };

export const getMessages = ({ start, end }: Range): Promise<ChatService[]> => {
	return prisma.chat.findMany({
		skip: +start,
		take: +end - +start,
		orderBy: { createdAt: 'desc' },
		select: {
			createdAt: true,
			content: true,
			id: true,
			userId: true,
			user: { select: { username: true } },
		},
	});
};

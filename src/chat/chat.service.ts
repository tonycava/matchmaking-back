import prisma from '../lib/db';
import { Chat, Range } from 'matchmaking-shared';

export const getMessages = ({ start, end }: Range): Promise<Chat[]> => {
	return prisma.chat.findMany({
		skip: +start,
		take: +end - +start,
		orderBy: { createdAt: 'desc' },
		select: {
			createdAt: true,
			content: true,
			id: true,
			userId: true,
			user: { select: { username: true } }
		}
	});
};

export const createChat = async (content: string, userId: string): Promise<Chat> => {
	return prisma.chat.create({
		select: {
			content: true,
			createdAt: true,
			id: true,
			userId: true,
			user: { select: { username: true } }
		},
		data: {
			content,
			user: { connect: { id: userId } }
		}
	});
};

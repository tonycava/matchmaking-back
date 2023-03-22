import prisma from '../lib/db';
import { Chat } from '@prisma/client';

export const getMessages = (): Promise<Chat[]> => {
	return prisma.chat.findMany();
};

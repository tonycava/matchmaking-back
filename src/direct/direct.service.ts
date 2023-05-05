import prisma from '../lib/db';
import { Direct } from '@prisma/client';

export const getDirectsChatsByUserId = async (
	userIdWhoSendTheRequest: string,
	userIdToGet: string
): Promise<any> => {
	return prisma.direct.findMany({
		where: {
			OR: [
				{
					personWhoRecivedId: userIdWhoSendTheRequest,
					personWhoSendId: userIdToGet
				},
				{
					personWhoRecivedId: userIdToGet,
					personWhoSendId: userIdWhoSendTheRequest
				}
			]
		},
		orderBy: { createdAt: 'desc' }
	});
};

export type Conversation = {
	content: string;
	personWhoRecived: {
		id: string;
		username: string;
		profilePicture: string;
	};
	personWhoSend: {
		id: string;
		username: string;
		profilePicture: string;
	};
};

export const getConversationsByUserId = async (userId: string): Promise<Conversation[]> => {
	return prisma.direct.findMany({
		where: {
			OR: [{ personWhoSendId: userId }, { personWhoRecivedId: userId }]
		},
		select: {
			content: true,
			personWhoRecived: {
				select: { username: true, profilePicture: true, id: true }
			},
			personWhoSend: {
				select: { username: true, profilePicture: true, id: true }
			}
		},
		orderBy: { createdAt: 'desc' },
		distinct: ['personWhoSendId', 'personWhoRecivedId']
	});
};

export const createDirect = async (
	personWhoSendId: string,
	personWhoRecivedId: string,
	content: string
): Promise<Direct> => {
	return prisma.direct.create({
		data: {
			personWhoSendId,
			personWhoRecivedId,
			content
		}
	});
};

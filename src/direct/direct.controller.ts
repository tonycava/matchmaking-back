import { AMLRequest, AMLResponse, AMLResult } from '../common/interfaces';
import { getConversationsByUserId, getDirectsChatsByUserId } from './direct.service';
import { LocalsDTO } from '../lib/dto';
import { getUserInformationById } from '../user/user.service';

const getDirectsChats = async (
	req: AMLRequest<any>,
	res: AMLResponse<any, LocalsDTO>
): Promise<any> => {
	const { useridtofetch } = req.headers as { useridtofetch: string };
	const { id } = res.locals.user;
	if (!useridtofetch) return res.send(new AMLResult('Missing userIdToFetch', 400));
	if (useridtofetch === id)
		return res.send(new AMLResult('Unable to retrieve your own message', 400));
	const directs = await getDirectsChatsByUserId(id, useridtofetch);
	const [
		{ username: username1, profilePicture: pp1 },
		{ username: username2, profilePicture: pp2 }
	] = await Promise.all([getUserInformationById(id), getUserInformationById(useridtofetch)]);
	return res.send(
		new AMLResult('OK', 200, {
			directs,
			[id]: { username: username1, profilePicture: pp1 },
			[useridtofetch]: { username: username2, profilePicture: pp2 }
		})
	);
};

export const getConversations = async (
	req: AMLRequest<any>,
	res: AMLResponse<any, LocalsDTO>
): Promise<any> => {
	const conversations = await getConversationsByUserId(res.locals.user.id).then((conversations) => {
		return conversations
			.map((conversation) => {
				if (conversation.personWhoRecived.id === res.locals.user.id)
					return { person: conversation.personWhoSend, lastMessage: conversation.content };
				return { person: conversation.personWhoRecived, lastMessage: conversation.content };
			})
			.filter((v, i, a) => a.findIndex((v2) => v2.person.username === v.person.username) === i);
	});
	return res.send(new AMLResult('OK', 200, conversations));
};

export default {
	getConversations,
	getDirectsChats
};

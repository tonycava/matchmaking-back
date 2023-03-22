import { ALMMatcherRequest, ALMMatcherResponse, ALMMatcherResult } from '../common/interfaces';
import { getMessages } from './chat.service';
import { Response } from 'express';

const getChat = async (
	req: ALMMatcherRequest<never>,
	res: ALMMatcherResponse,
): Promise<Response<ALMMatcherResult>> => {
	const messages = await getMessages();
	console.log(messages);
	return res.send(new ALMMatcherResult('Chat fetched', 200, { messages }));
};

export default { getChat };

import { ALMMatcherRequest, ALMMatcherResponse, ALMMatcherResult } from '../common/interfaces';
import { getMessages } from './chat.service';
import { Response } from 'express';
import { Range } from '../lib/dto';

const getChat = async (
	req: ALMMatcherRequest<never, Range>,
	res: ALMMatcherResponse,
): Promise<Response<ALMMatcherResult>> => {
	const messages = await getMessages(req.query);
	return res.send(new ALMMatcherResult('Chat.ts fetched', 200, { messages }));
};

export default { getChat };

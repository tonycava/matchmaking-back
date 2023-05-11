import { ALMRequest, ALMResponse, ALMResult } from '../common/interfaces';
import { getMessages } from './chat.service';
import { Response } from 'express';
import { Range } from 'matchmaking-shared';

const getChat = async (
	req: ALMRequest<never, Range>,
	res: ALMResponse
): Promise<Response<ALMResult>> => {
	const messages = await getMessages(req.query);
	return res.send(new ALMResult('Chat.ts fetched', 200, { messages }));
};

export default { getChat };

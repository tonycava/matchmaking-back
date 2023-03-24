import { AMLRequest, AMLResponse, AMLResult } from '../common/interfaces';
import { getMessages } from './chat.service';
import { Response } from 'express';
import { Range } from '../lib/dto';

const getChat = async (
	req: AMLRequest<never, Range>,
	res: AMLResponse,
): Promise<Response<AMLResult>> => {
	const messages = await getMessages(req.query);
	return res.send(new AMLResult('Chat.ts fetched', 200, { messages }));
};

export default { getChat };

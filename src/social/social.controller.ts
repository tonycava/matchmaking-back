import { AMLRequest, AMLResponse, AMLResult } from '../common/interfaces';
import { AddFollowDTO, LocalsDTO, UnFollowDTO } from '../lib/dto';
import { startFollowSomeone, unFollowSomeone } from './social.service';
import { type Follow } from '@prisma/client';
import { Response } from 'express';

const addFollow = async (
	req: AMLRequest<AddFollowDTO>,
	res: AMLResponse<{ follow: Follow }, LocalsDTO>
): Promise<Response<AMLResult<{ follow: Follow }>>> => {
	const { userIdToFollow } = req.body;
	const { id } = res.locals.user;

	if (userIdToFollow === id) return res.send(new AMLResult('You cannot follow yourself', 400));

	const follow = await startFollowSomeone(userIdToFollow, id);

	return res.send(new AMLResult('OK', 200, { follow }));
};

const removeFollow = async (req: AMLRequest<UnFollowDTO>, res: AMLResponse<any>): Promise<any> => {
	const { userIdToUnFollow } = req.body;
	const { id } = res.locals.user;
	if (userIdToUnFollow === id) return res.send(new AMLResult('You cannot unfollow yourself', 400));

	const unfollow = await unFollowSomeone(userIdToUnFollow, id);

	return res.send(new AMLResult('OK', 200, { unfollow }));
};

export default {
	addFollow,
	removeFollow
};

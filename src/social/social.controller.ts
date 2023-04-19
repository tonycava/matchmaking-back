import { AMLRequest, AMLResponse, AMLResult } from '../common/interfaces';
import {
	AcceptApplicationDTO,
	AddApplicationDTO,
	AddFollowDTO,
	LocalsDTO,
	RemoveApplicationDTO,
	RemoveWaitingApplicationDTO,
	UnFollowDTO
} from '../lib/dto';
import {
	addNewApplication,
	getApplicationById,
	removeApplicationById,
	removeWaitingApplicationById,
	startFollowSomeone,
	unFollowSomeone
} from './social.service';
import { Application, type Follow } from '@prisma/client';
import { Response } from 'express';
import { io } from '../index';

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

const removeFollow = async (
	req: AMLRequest<UnFollowDTO>,
	res: AMLResponse<{ unfollow: Follow }, LocalsDTO>
): Promise<Response<AMLResult<{ unfollow: Follow }>>> => {
	const { userIdToUnFollow } = req.body;
	const { id } = res.locals.user;
	if (userIdToUnFollow === id) return res.send(new AMLResult('You cannot unfollow yourself', 400));

	const unfollow = await unFollowSomeone(userIdToUnFollow, id);

	return res.send(new AMLResult('OK', 200, { unfollow }));
};

const addApplication = async (
	req: AMLRequest<AddApplicationDTO>,
	res: AMLResponse<{ application: Application }, LocalsDTO>
): Promise<Response<AMLResult<{ application: Application }>>> => {
	const { userIdToApply } = req.body;
	const { id: userId } = res.locals.user;

	if (userIdToApply === userId) return res.send(new AMLResult('Cannot add yourself', 200));

	const application = await addNewApplication(userIdToApply, userId);
	return res.send(new AMLResult('OK', 200, { application }));
};

const removeApplication = async (
	req: AMLRequest<RemoveApplicationDTO>,
	res: AMLResponse<{ application: Application }, LocalsDTO>
): Promise<Response<AMLResult<{ application: Application }>>> => {
	const { applicationIdToUnApply } = req.body;
	const application = await removeApplicationById(applicationIdToUnApply);
	return res.send(new AMLResult('OK', 200, { application }));
};

const acceptApplication = async (
	req: AMLRequest<AcceptApplicationDTO>,
	res: AMLResponse<{ application: Application; follow: Follow }, LocalsDTO>
): Promise<Response<AMLResult<{ application: Application; follow: Follow }>>> => {
	const { applicationIdToApply, userIdToFollow } = req.body;
	const application = await removeApplicationById(applicationIdToApply);
	const follow = await startFollowSomeone(res.locals.user.id, userIdToFollow);
	io.emit(`user/new-follow/${res.locals.user.id}`, follow);
	return res.send(new AMLResult('OK', 200, { application, follow }));
};

const removeWaitingApplication = async (
	req: AMLRequest<RemoveWaitingApplicationDTO>,
	res: AMLResponse<{ deletedApplication: Application }, LocalsDTO>
): Promise<Response<AMLResult<{ deletedApplication: Application }>>> => {
	const { userIdToUnWait } = req.body;
	const application = await getApplicationById(res.locals.user.id, userIdToUnWait);
	const deletedApplication = await removeWaitingApplicationById(application.id);
	return res.send(new AMLResult('OK', 200, { deletedApplication }));
};

export default {
	addFollow,
	removeFollow,
	addApplication,
	removeApplication,
	acceptApplication,
	removeWaitingApplication
};

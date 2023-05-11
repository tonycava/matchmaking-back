import { ALMRequest, ALMResponse, ALMResult } from '../common/interfaces';
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
	req: ALMRequest<AddFollowDTO>,
	res: ALMResponse<{ follow: Follow }, LocalsDTO>
): Promise<Response<ALMResult<{ follow: Follow }>>> => {
	const { userIdToFollow } = req.body;
	const { id } = res.locals.user;

	if (userIdToFollow === id) return res.send(new ALMResult('You cannot follow yourself', 400));
	const follow = await startFollowSomeone(userIdToFollow, id);

	return res.send(new ALMResult('OK', 200, { follow }));
};

const removeFollow = async (
	req: ALMRequest<UnFollowDTO>,
	res: ALMResponse<{ unfollow: Follow }, LocalsDTO>
): Promise<Response<ALMResult<{ unfollow: Follow }>>> => {
	const { userIdToUnFollow } = req.body;
	const { id } = res.locals.user;
	if (userIdToUnFollow === id) return res.send(new ALMResult('You cannot unfollow yourself', 400));

	const unfollow = await unFollowSomeone(userIdToUnFollow, id);
	io.emit(`user/remove-follow/${userIdToUnFollow}`, res.locals.user.id);
	return res.send(new ALMResult('OK', 200, { unfollow }));
};

const addApplication = async (
	req: ALMRequest<AddApplicationDTO>,
	res: ALMResponse<{ application: Application }, LocalsDTO>
): Promise<Response<ALMResult<{ application: Application }>>> => {
	const { userIdToApply } = req.body;
	const { id: userId } = res.locals.user;

	if (userIdToApply === userId) return res.send(new ALMResult('Cannot add yourself', 200));

	const application = await addNewApplication(userIdToApply, userId);
	io.emit(`user/demand/${userIdToApply}`, {
		id: application.id,
		userToFollow: {
			id: application.userIdToFollow,
			createdAt: application.createdAt,
			profilePicture: application.userToFollow.profilePicture,
			username: application.userToFollow.username
		}
	});
	return res.send(new ALMResult('OK', 200, { application }));
};

const removeApplication = async (
	req: ALMRequest<RemoveApplicationDTO>,
	res: ALMResponse<{ application: Application }, LocalsDTO>
): Promise<Response<ALMResult<{ application: Application }>>> => {
	const { applicationIdToUnApply } = req.body;
	const application = await removeApplicationById(applicationIdToUnApply);
	io.emit(`user/demand/reject/${application.userIdWhoFollow}/${application.userIdToFollow}`);
	return res.send(new ALMResult('OK', 200, { application }));
};

const acceptApplication = async (
	req: ALMRequest<AcceptApplicationDTO>,
	res: ALMResponse<{ application: Application; follow: Follow }, LocalsDTO>
): Promise<Response<ALMResult<{ application: Application; follow: Follow }>>> => {
	const { applicationIdToApply, userIdToFollow } = req.body;
	const application = await removeApplicationById(applicationIdToApply);
	const follow = await startFollowSomeone(res.locals.user.id, userIdToFollow);
	io.emit(`user/new-follow/${follow.followerId}`, follow);
	io.emit(`user/demand/accept/${follow.followerId}/${follow.followedId}`);
	return res.send(new ALMResult('OK', 200, { application, follow }));
};

const removeWaitingApplication = async (
	req: ALMRequest<RemoveWaitingApplicationDTO>,
	res: ALMResponse<{ deletedApplication: Application }, LocalsDTO>
): Promise<Response<ALMResult<{ deletedApplication: Application }>>> => {
	const { userIdToUnWait } = req.body;
	const application = await getApplicationById(res.locals.user.id, userIdToUnWait);
	const deletedApplication = await removeWaitingApplicationById(application.id);
	io.emit(`user/demand/remove/${userIdToUnWait}`, deletedApplication.id);
	return res.send(new ALMResult('OK', 200, { deletedApplication }));
};

export default {
	addFollow,
	removeFollow,
	addApplication,
	removeApplication,
	acceptApplication,
	removeWaitingApplication
};

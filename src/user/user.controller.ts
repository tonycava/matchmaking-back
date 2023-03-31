import { NextFunction, Response } from 'express';
import { AMLRequest, AMLResponse, AMLResult } from '../common/interfaces';
import { User } from '@prisma/client';
import { changeProfilePicture, getUserProfilePicture } from './user.service';
import { UploadProfilePictureDTO } from '../lib/dto';

const getInformations = async (
	req: AMLRequest<never>,
	res: AMLResponse<
		{ profilePicture: string },
		{ user: Pick<User, 'id' | 'username' | 'createdAt'> }
	>,
	next: NextFunction,
): Promise<void | Response<
	AMLResult<{ profilePicture: string }>,
	{ user: Pick<User, 'id' | 'username' | 'createdAt'> }
>> => {
	const { userid = '' } = req.headers as { userid: string };
	if (!userid) return next(new AMLResult('Missing userId', 400));

	const { profilePicture } = await getUserProfilePicture(userid);
	return res.json(new AMLResult('Profile picture retrieved successfully', 200, { profilePicture }));
};

const uploadProfilePicture = async (
	req: AMLRequest<UploadProfilePictureDTO>,
	res: AMLResponse<
		{ profilePicture: string },
		{ user: Pick<User, 'id' | 'username' | 'createdAt'> }
	>,
): Promise<
	Response<
		AMLResult<{ profilePicture: string }>,
		{ user: Pick<User, 'id' | 'username' | 'createdAt'> }
	>
> => {
	const { profilePicture } = await changeProfilePicture(
		res.locals.user.id,
		req.body.profilePicture,
	);
	return res.json(new AMLResult('Profile picture updated successfully', 200, { profilePicture }));
};

export default {
	getInformations,
	uploadProfilePicture,
};

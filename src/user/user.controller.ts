import { Request, Response } from 'express';
import { AMLResult } from '../common/interfaces';
import { User } from '@prisma/client';
import { getUserProfilePicture } from './user.service';

const getInformations = async (
	req: Request,
	res: Response<AMLResult, { user: Pick<User, 'id' | 'username' | 'createdAt'> }>,
): Promise<Response> => {
	const { userId = '' } = req.headers as { userId: string };
	if (!userId) return res.status(400).json(new AMLResult('Missing userId', 400));

	const { profilePicture } = await getUserProfilePicture(userId);
	return res.json(new AMLResult('Profile picture retrieved successfully', 200, { profilePicture }));
};

export default {
	getInformations,
};
